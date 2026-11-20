const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WEEKDAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

export default function BookingBottomBar({ day, month, year, time }) {
  const date = day ? new Date(year, month, day) : null
  const label = date ? `${WEEKDAYS[date.getDay()]}, ${day} ${MONTHS[month]} ${year}` : 'Дата не выбрана'
  return (
    <div className="booking-bottom">
      <p>Выбранная дата и время: {label}{time ? ` ${time}` : ''}</p>
      <button className="next-button" type="button" disabled={!day || !time}>Далее</button>
    </div>
  )
}
