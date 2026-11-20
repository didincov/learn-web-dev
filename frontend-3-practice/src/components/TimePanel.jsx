export default function TimePanel({ slots, occupied, selectedTime, onTimeClick }) {
  return (
    <section className="time-panel" aria-label="Доступное время">
      <h2>Доступное время</h2>
      <div className="time-slots">
        {slots.map(time => <button type="button" key={time} disabled={occupied.includes(time)} className={`time-slot ${occupied.includes(time) ? 'occupied' : ''} ${selectedTime === time ? 'selected-time' : ''}`} onClick={() => onTimeClick(time)}>{time}</button>)}
      </div>
    </section>
  )
}
