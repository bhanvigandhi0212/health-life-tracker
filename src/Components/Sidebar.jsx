
function Sidebar() {
  const currentPage = window.location.hash || '#dashboard'

  const links = [
    { href: '#dashboard', icon: '◫', label: 'Dashboard' },
    { href: '#health', icon: '♡', label: 'Health Tracker' },
    { href: '#nutrition', icon: '🍽', label: 'Nutrition' },
    { href: '#planner', icon: '☷', label: 'Daily Planner' },
    { href: '#reports', icon: '▥', label: 'Reports' },
    { href: '#history', icon: '📅', label: 'Calendar & History' },
    { href: '#assistant', icon: '✦', label: 'LifeSync AI' },
  ]

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✦</div>
        <div>
          <h2>LifeSync</h2>
          <span>Your life, in balance</span>
        </div>
      </div>

      <p className="sidebar-label">WORKSPACE</p>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <a
            key={link.href}
            className={`nav-link ${
              currentPage === link.href ? 'active' : ''
            }`}
            href={link.href}
          >
            <span>{link.icon}</span> {link.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <span>✧ Daily reminder</span>
          <p>Small steps every day lead to big changes.</p>
        </div>
        <p className="sidebar-footer">Made for a better you ♡</p>
      </div>
    </aside>
  )
}

export default Sidebar
