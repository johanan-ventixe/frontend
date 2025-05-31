import Logotype from '../images/ventixe-logo.svg'
import { Link, useLocation } from 'react-router-dom'

const Nav = () => {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="logo-box">
        <Link to="/"><img className="logo" src={Logotype} alt="Ventixe Logo" /></Link>
      </div>

      <ul className="nav-links">
        <Link to="/" className={location.pathname === '/' || location.pathname.startsWith('/events') ? 'active' : ''}>
          <i className="fa-regular fa-ticket-simple"></i>Events
        </Link>
        <Link to="/bookings" className={location.pathname === '/bookings' ? 'active' : ''}>
          <i className="fa-sharp fa-regular fa-square-check"></i>Bookings
        </Link>
      </ul>
    </nav>
  )
}

export default Nav