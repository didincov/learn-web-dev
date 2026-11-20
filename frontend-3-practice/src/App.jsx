import { useState } from 'react'
import Header from './components/Header.jsx'
import ProgressSteps from './components/ProgressSteps.jsx'
import CalendarPanel from './components/CalendarPanel.jsx'
import TimePanel from './components/TimePanel.jsx'
import BookingBottomBar from './components/BookingBottomBar.jsx'
import Footer from './components/Footer.jsx'

const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
const OCCUPIED = ['11:00', '13:00']

function App() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [selectedTime, setSelectedTime] = useState('14:00')
  const [slots, setSlots] = useState(TIMES)

  const handleMonthChange = (direction) => {
    const date = new Date(currentYear, currentMonth + direction, 1)
    setCurrentMonth(date.getMonth())
    setCurrentYear(date.getFullYear())
    setSelectedDay(null)
    setSelectedTime(null)
    setSlots(TIMES)
  }

  const handleDayClick = (day) => {
    setSelectedDay(day)
    setSelectedTime(null)
    setSlots(TIMES)
  }

  const handleTimeClick = (time) => {
    if (!OCCUPIED.includes(time)) setSelectedTime(time)
  }

  return (
    <>
      <Header />
      <ProgressSteps />
      <main className="booking">
        <div className="page-heading">
          <a href="#" className="back-link" aria-label="Назад">←</a>
          <h1>Выбор даты и времени</h1>
        </div>
        <div className="booking-panels">
          <CalendarPanel
            month={currentMonth}
            year={currentYear}
            selectedDay={selectedDay}
            onMonthChange={handleMonthChange}
            onDayClick={handleDayClick}
          />
          <TimePanel slots={slots} occupied={OCCUPIED} selectedTime={selectedTime} onTimeClick={handleTimeClick} />
        </div>
        <BookingBottomBar day={selectedDay} month={currentMonth} year={currentYear} time={selectedTime} />
      </main>
      <Footer />
    </>
  )
}

export default App
