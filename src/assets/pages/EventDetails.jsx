import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventRes = await fetch(`https://johanan-eventservice-b0eyfverb8e7cnfx.swedencentral-01.azurewebsites.net/api/events/${id}`);
        
        if (!eventRes.ok) {
          throw new Error(`Failed to fetch event: ${eventRes.status}`);
        }
        
        const eventData = await eventRes.json();
        setEvent(eventData);
        const detailsRes = await fetch(`https://johanan-eventdetailsservice-f6huebb0fsf2djcz.swedencentral-01.azurewebsites.net/api/eventdetails/event/${id}`);
        
        if (detailsRes.ok) {
          const detailsData = await detailsRes.json();
          setEventDetails(detailsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

return (
  <div className='portal-wrapper'>
      <Nav />
      <Header />
      <main>
        <div className="container-wrapper">
          <div className='event-details-image-box'></div>
          <div className="event-details">
            <h5>{event.title}</h5>

            <div className="event-info-box">
              <div className="details-date-location-box">
                <p className='info-date'>
                  <i className="fa-thin fa-calendar"></i>
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} - {new Date(event.eventDate).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                  })}
                </p>
                <p className='info-location'><i className="fa-light fa-location-dot"></i> {event.location}</p>
              </div>

              {eventDetails && (
                <div className="tickets-box">
                  <span>Tickets Left</span>
                  <p>{eventDetails.ticketsLeft} <span> / {eventDetails.totalTickets}</span> </p>
                </div>
              )}
            </div>
            
            <div className="event-description-box">
              <h6>About Event</h6>
              {loading ? (
                <p>Loading event details...</p>
              ) : eventDetails ? (
                <p>{eventDetails.description}</p>
              ) : (
                <p>No description available.</p>
              )}
            </div>
            
            <div className="sign-up-btn">
              {eventDetails && (
                eventDetails.ticketsLeft > 0 ? (
                  <Link to={`/events/${id}/signup`}>
                    <button className='btn'>Sign up for this event</button>
                  </Link>
                ) : (
                  <p>Sorry, this event is sold out.</p>
                )
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EventDetails