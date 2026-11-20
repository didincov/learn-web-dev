import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchToday, fetchSlots } from './api.js';


const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const dateKey = ({ day, month, year }) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const dateFromKey = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return { day, month: month - 1, year };
};
const shiftMonth = (date, amount) => {
  const next = new Date(date.year, date.month + amount, 1);
  return { day: date.day, month: next.getMonth(), year: next.getFullYear() };
};
const formatSelectedDate = (date) => {
  const d = new Date(date.year, date.month, date.day);
  const weekday = d.toLocaleDateString('ru-RU', { weekday: 'long' });
  const month = d.toLocaleDateString('ru-RU', { month: 'long' });
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${date.day} ${month} ${date.year}`;
};

export default function App() {
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const requestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    async function loadToday() {
      setTodayLoading(true);
      setTodayError('');
      try {
        const serverToday = await fetchToday();
        if (cancelled) return;
        setToday(serverToday);
        setSelectedDate(serverToday);
        setVisibleMonth({ day: 1, month: serverToday.month, year: serverToday.year });
      } catch (error) {
        if (!cancelled) setTodayError(error.message || 'Ошибка загрузки даты.');
      } finally {
        if (!cancelled) setTodayLoading(false);
      }
    }
    loadToday();
    return () => { cancelled = true; };
  }, []);


  useEffect(() => {
    if (!selectedDate) return;
    const currentRequest = ++requestId.current;
    const selectedKey = dateKey(selectedDate);
    setSlotsLoading(true);
    setSlotsError('');
    setSlots([]);
    setSelectedTime('');

    fetchSlots(selectedDate)
      .then((result) => {
        if (currentRequest !== requestId.current || result.date !== selectedKey) return;
        setSlots(result.slots);
      })
      .catch((error) => {
        if (currentRequest !== requestId.current) return;
        setSlotsError(error.message || 'Не удалось загрузить слоты. Попробуйте ещё раз.');
      })
      .finally(() => {
        if (currentRequest === requestId.current) setSlotsLoading(false);
      });
  }, [selectedDate]);


  const calendarDays = useMemo(() => {
    if (!visibleMonth) return [];
    const first = new Date(visibleMonth.year, visibleMonth.month, 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(visibleMonth.year, visibleMonth.month, 1 - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const current = new Date(start);
      current.setDate(start.getDate() + index);
      return {
        day: current.getDate(),
        month: current.getMonth(),
        year: current.getFullYear(),
        inMonth: current.getMonth() === visibleMonth.month,
      };
    });
  }, [visibleMonth]);


  const handleDayClick = (date) => {
    if (!today || !visibleMonth) return;
    const clicked = new Date(date.year, date.month, date.day);
    const earliest = new Date(today.year, today.month, today.day);
    if (clicked < earliest) return;
    setSelectedDate(date);
    if (date.month !== visibleMonth.month || date.year !== visibleMonth.year) {
      setVisibleMonth({ day: 1, month: date.month, year: date.year });
    }
  };

  const changeMonth = (direction) => {
    if (!visibleMonth) return;
    setVisibleMonth((current) => shiftMonth(current, direction));
  };

  const selectedDateText = selectedDate ? formatSelectedDate(selectedDate) : '—';


  if (todayLoading) return <div className="app-message">Загрузка…</div>;
  if (todayError) return <div className="app-message error-message">{todayError}</div>;


  return (
    <>
      <header className="site-header">
        <div className="logo" aria-label="Стриж & Стиль"><span className="logo-text">✂</span></div>
        <nav className="main-nav">
          <a href="#">Мастера</a><a href="#">Услуги</a><a href="#">Отзывы</a><a href="#">Контакты</a>
        </nav>
      </header>


      <section className="progress" aria-label="Этапы записи">
        <div className="progress-track"></div>
        <div className="step completed"><span>1</span><small>Выбор мастера</small></div>
        <div className="step completed"><span>2</span><small>Выбор услуги</small></div>
        <div className="step current"><span>3</span><small>Выбор даты</small></div>
        <div className="step"><span>4</span><small>Ваши данные</small></div>
        <div className="step"><span>5</span><small>Подтверждение заказа</small></div>
      </section>


      <main className="booking">
        <div className="page-heading"><a href="#" className="back-link" aria-label="Назад">←</a><h1>Выбор даты и времени</h1></div>
        <div className="booking-panels">
          <section className="calendar-panel" aria-label="Календарь">
            <div className="panel-top">
              <span className="month">{visibleMonth ? `${MONTHS[visibleMonth.month]} ${visibleMonth.year}` : ''}</span>
              <div className="month-controls"><button type="button" aria-label="Предыдущий месяц" onClick={() => changeMonth(-1)}>‹</button><button type="button" aria-label="Следующий месяц" onClick={() => changeMonth(1)}>›</button></div>
            </div>
            <div className="weekdays">{WEEKDAYS.map((name) => <span key={name}>{name}</span>)}</div>
            <div className="calendar-days">
              {calendarDays.map((date, index) => {
                const isPast = today && new Date(date.year, date.month, date.day) < new Date(today.year, today.month, today.day);
                const isSelected = selectedDate && dateKey(date) === dateKey(selectedDate);
                return <button key={`${date.year}-${date.month}-${date.day}-${index}`} type="button" disabled={isPast} className={`day${isPast ? ' past' : ''}${!date.inMonth ? (date.month < visibleMonth.month || (visibleMonth.month === 0 && date.month === 11) ? ' past' : ' next-month') : ''}${isSelected ? ' selected' : ''}`} onClick={() => handleDayClick(date)}>{date.day}</button>;
              })}
            </div>
          </section>

          <section className="time-panel" aria-label="Доступное время">
            <h2>Доступное время</h2>
            {slotsLoading ? <p className="slot-message">Загрузка слотов…</p> : slotsError ? <p className="slot-message slot-error">{slotsError}</p> : slots.length === 0 ? <p className="slot-message">Нет доступного времени.</p> : <div className="time-slots">
              {slots.map((slot) => <button key={slot.time} type="button" disabled={!slot.available} className={`time-slot${!slot.available ? ' occupied' : ''}${selectedTime === slot.time ? ' selected-time' : ''}`} onClick={() => setSelectedTime(slot.time)}>{slot.time}</button>)}
            </div>}
          </section>
        </div>
        <div className="booking-bottom"><p>Выбранная дата и время: {selectedDateText}{selectedTime ? `, ${selectedTime}` : ''}</p><button type="button" className="next-button" disabled={!selectedDate || !selectedTime}>Далее</button></div>
      </main>


      <footer className="site-footer">
        <div className="footer-main">
          <section className="footer-about"><h2>«Стриж &amp; Стиль»</h2><p>Ваша любимая парикмахерская.<br />Профессиональный уход, доступные<br />цены и гарантированный результат.</p></section>
          <section className="footer-contacts"><h2><span>Контакты</span></h2><p>☎ &nbsp;+7 495 123-45-67</p><p>◎ &nbsp;ул. Садовая, 15, Москва</p></section>
          <section className="footer-hours"><h2><span>Режим работы</span></h2><p>Режим работы: Ежедневно с 09:00 до 21:00</p></section>
        </div>
        <div className="footer-bottom"><span>© 2026. Все права защищены.</span><a href="#">Политика конфиденциальности</a></div>
      </footer>
    </>
  );
}
