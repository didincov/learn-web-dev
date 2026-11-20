const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

function buildDays(year, month) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  return Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - firstWeekday + 1
    if (dayNumber < 1) return { day: prevMonthDays + dayNumber, outside: true, offset: -1 }
    if (dayNumber > daysInMonth) return { day: dayNumber - daysInMonth, outside: true, offset: 1 }
    return { day: dayNumber, outside: false, offset: 0 }
  })
}

export default function CalendarPanel({ month, year, selectedDay, onMonthChange, onDayClick }) {
  const today = new Date()
  const days = buildDays(year, month)
  return (
    <section className="calendar-panel" aria-label="Календарь">
      <div className="panel-top">
        <span className="month">{MONTHS[month]}</span>
        <div className="month-controls">
          <button type="button" onClick={() => onMonthChange(-1)} aria-label="Предыдущий месяц">‹</button>
          <button type="button" onClick={() => onMonthChange(1)} aria-label="Следующий месяц">›</button>
        </div>
      </div>
      <div className="weekdays">{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => <span key={day}>{day}</span>)}</div>
      <div className="calendar-days">
        {days.map((item, index) => {
          const past = !item.outside && new Date(year, month, item.day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const className = ['day', item.outside ? 'outside' : '', past ? 'past' : '', selectedDay === item.day && !item.outside ? 'selected' : ''].filter(Boolean).join(' ')
          return <button type="button" key={index} className={className} disabled={item.outside || past} onClick={() => onDayClick(item.day)}>{item.day}</button>
        })}
      </div>
    </section>
  )
}
