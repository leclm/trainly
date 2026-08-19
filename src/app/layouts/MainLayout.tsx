import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/workouts', label: 'Meus treinos' },
  { to: '/exercises', label: 'Exercícios' },
  { to: '/history', label: 'Histórico' },
  { to: '/statistics', label: 'Evolução' },
  { to: '/settings', label: 'Configurações' },
]

export const MainLayout = () => {
  return (
    <div className="app-shell">
      <header>
        <h1>Trainly</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <nav aria-label="Navegação principal" className="bottom-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
