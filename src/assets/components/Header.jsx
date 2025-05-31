import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = ({ onAddEventClick }) => {
  const location = useLocation();
  const { id } = useParams();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.match(/^\/events\/[^/]+\/signup$/)) {
      return "Sign Up";
    } else if (path.match(/^\/events\/[^/]+$/)) {
      return "Event Details";
    } else if (path === "/bookings") {
      return "Bookings";
    } else {
      return "Events";
    }
  };

  const isEventDetailsPage = location.pathname.match(/^\/events\/[^/]+$/);
  const isSignUpPage = location.pathname.match(/^\/events\/[^/]+\/signup$/);

  const getBackLink = () => {
    if (isEventDetailsPage) {
      return "/";
    } else if (isSignUpPage) {
      return `/events/${id}`;
    }
    return "/";
  };

  return (
    <header className="header">
      <div className="header-arrow-box">
        {(isEventDetailsPage || isSignUpPage) && (
          <Link to={getBackLink()}>
            <i className="fa-light fa-arrow-left"></i>
          </Link>
        )}
        <h4 id="page-title">{getPageTitle()}</h4>
      </div>
      
      {/* Only show Add Event button on Events page */}
      {location.pathname === '/' && (
        <button 
          type="button"
          className="add-event-btn btn"
          onClick={onAddEventClick}
        >
          + Add Event
        </button>
      )}
    </header>
  );
};

export default Header;