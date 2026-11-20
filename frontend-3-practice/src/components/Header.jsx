export default function Header() {
  return (
    <header className="site-header">
      <div className="logo">
        <img src="/images/logo.png" alt="Логотип" />
         <span>Стриж& Стиль</span>
      </div>

      <nav className="main-nav">
        <a href="#">Мастера</a>
        <a href="#">Услуги</a>
        <a href="#">Отзывы</a>
        <a href="#">Контакты</a>
      </nav>
    </header>
  )
}