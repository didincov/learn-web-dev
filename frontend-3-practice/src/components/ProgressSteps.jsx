const steps = ['Выбор мастера', 'Выбор услуги', 'Выбор даты', 'Ваши данные', 'Подтверждение заказа']

export default function ProgressSteps() {
  return (
    <section className="progress" aria-label="Этапы записи">
      <div className="progress-track" />
      {steps.map((step, index) => (
        <div className={`step ${index < 2 ? 'completed' : ''} ${index === 2 ? 'current' : ''}`} key={step}>
          <span>{index + 1}</span><small>{step}</small>
        </div>
      ))}
    </section>
  )
}
