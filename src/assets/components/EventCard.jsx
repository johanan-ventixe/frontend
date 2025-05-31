import { Link } from 'react-router-dom'

const EventCard = ({ card, onEventClick }) => {
  const cardContent = (
    <div className='event-card'>
      <div className="card-image-box"></div>
      <div className='card-info-box'>
        <p className='info-date'>
          {new Date(card.eventDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })} - {new Date(card.eventDate).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </p>
        <h5>{card.title}</h5>
        <p className='info-location'>
          <i className="fa-light fa-location-dot"></i> {card.location}
        </p>
      </div>
    </div>
  );

  // Help from chatgpt how to handle eventcard click on different page
  return onEventClick ? (
    <div onClick={() => onEventClick(card)}>
      {cardContent}
    </div>
  ) : (
    <Link to={`/events/${card.id}`}>
      {cardContent}
    </Link>
  );
};

export default EventCard