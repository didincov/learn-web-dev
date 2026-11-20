// ===== Данные =====
const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// ===== Состояние =====
const today = new Date();
today.setHours(0, 0, 0, 0);
const state = {
  currentMonth: today.getMonth(),
  currentYear: today.getFullYear(),
  selectedDay: today.getDate(),
  selectedTime: null,
  slots: []
};

// ===== Чистые функции =====
function compareDates(date1, date2) {
  const first = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const second = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return first.getTime() - second.getTime();
}


function isDateSelectable(day, month, year, currentDate = today) {
  return compareDates(new Date(year, month, day), currentDate) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  // Понедельник — первый день недели (0..6).
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;
  const grid = [];
  for (let cell = 0; cell < totalCells; cell++) {
    const day = cell - mondayOffset + 1;
    grid.push(day >= 1 && day <= daysInMonth ? day : null);
  }
  return grid;
}

function getSlotsForDate(day, month, year) {
  // Список времени демонстрационный; занятые слоты немного меняются по выбранной дате.
  const seed = day + month + year;
  return TIMES.map((time, index) => ({
    time,
    occupied: (seed + index * 3) % 7 === 0
  }));
}


// ===== Рендер календаря =====
function renderCalendar() {
  const calendar = document.querySelector('#calendar-days');
  const monthTitle = document.querySelector('#month-title');
  monthTitle.textContent = MONTHS_NOMINATIVE[state.currentMonth];
  const days = buildCalendarGrid(state.currentYear, state.currentMonth);

  calendar.innerHTML = days.map(day => {
    if (day === null) return '<span class="day empty"></span>';
    const selectable = isDateSelectable(day, state.currentMonth, state.currentYear);
    const selected = day === state.selectedDay;
    const classes = ['day'];
    if (!selectable) classes.push('past', 'disabled');
    if (selected) classes.push('selected');
    return `<button class="${classes.join(' ')}" data-day="${day}" ${selectable ? '' : 'disabled'} aria-pressed="${selected}">${day}</button>`;
  }).join('');

  // После обновления HTML обработчики добавляются к новым кнопкам.
  calendar.querySelectorAll('.day:not(.empty)').forEach(button => {
    button.addEventListener('click', onDayClick);
  });
}


// ===== Рендер времени =====
function renderTimeSlots() {
  const container = document.querySelector('#time-slots');
  if (state.selectedDay === null) {
    state.slots = [];
    container.innerHTML = '<p class="no-slots">Выберите доступную дату</p>';
    return;
  }
  state.slots = getSlotsForDate(state.selectedDay, state.currentMonth, state.currentYear);
  container.innerHTML = state.slots.map(slot => {
    const classes = ['time-slot'];
    if (slot.occupied) classes.push('occupied');
    if (slot.time === state.selectedTime) classes.push('selected-time');
    return `<button class="${classes.join('')}" data-time="${slot.time}" ${slot.occupied ? 'disabled' : ''}>${slot.time}</button>`;
  }).join('');
  container.querySelectorAll('.time-slot:not(.occupied)').forEach(button => {
    button.addEventListener('click', onTimeSlotClick);
  });
}


// ===== Обработчики =====
function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  if (!isDateSelectable(day, state.currentMonth, state.currentYear)) return;
  state.selectedDay = day;
  state.selectedTime = null; // Сброс выбранного времени при смене даты.
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}


function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}


function setupMonthNavigation() {
  document.querySelector('#prev-month').addEventListener('click', () => changeMonth(-1));
  document.querySelector('#next-month').addEventListener('click', () => changeMonth(1));
}
function changeMonth(direction) {
  const date = new Date(state.currentYear, state.currentMonth + direction, 1);
  state.currentMonth = date.getMonth();
  state.currentYear = date.getFullYear();
  const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  const monthFirst = new Date(state.currentYear, state.currentMonth, 1);
  const monthLast = new Date(state.currentYear, state.currentMonth, daysInMonth);
  if (compareDates(monthLast, today) < 0) {
    // В полностью прошедшем месяце нельзя выбрать день.
    state.selectedDay = null;
  } else {
    state.selectedDay = Math.min(today.getDate(), daysInMonth);
    if (!isDateSelectable(state.selectedDay, state.currentMonth, state.currentYear)) {
      state.selectedDay = 1;
    }
  }
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function updateBottomBar() {
  const dateText = document.querySelector('#selected-date-text');
  if (state.selectedDay === null) {
    dateText.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear} • выберите доступный месяц`;
    return;
  }
  const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  const weekday = DAYS_OF_WEEK[date.getDay()];
  const text = `${weekday}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}`;
  dateText.textContent = state.selectedTime ? `${text} • ${state.selectedTime}` : `${text} • время не выбрано`;
}


// ===== Инициализация =====
function init() {
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
}
document.addEventListener('DOMContentLoaded', init);
