import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for event ID:", id);
        setLoading(true);
        
        const eventResponse = await fetch(`https://localhost:7281/api/events/${id}`);
        
        if (!eventResponse.ok) {
          throw new Error(`Failed to fetch event: ${eventResponse.status}`);
        }
        
        const eventData = await eventResponse.json();
        console.log("Event data:", eventData);
        setEvent(eventData);
        
        console.log("Fetching event details from:", `https://localhost:7230/api/eventdetails/event/${id}`);
        const detailsResponse = await fetch(`https://localhost:7230/api/eventdetails/event/${id}`);
        
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          console.log("Event details data:", detailsData);
          setEventDetails(detailsData);
        } else {
          console.log("No event details found, status:", detailsResponse.status);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      
      {eventDetails && (
        <>
          <p>Description: {eventDetails.description}</p>
          <div>
            <p>Tickets available: {eventDetails.ticketsLeft} / {eventDetails.totalTickets}</p>
            
            {eventDetails.ticketsLeft > 0 ? (
              <Link to={`/events/${id}/signup`}>
                <button>Register for this Event</button>
              </Link>
            ) : (
              <p>Sorry, this event is sold out.</p>
            )}
          </div>
        </>
      )}
      
      <Link to="/">Back to Events</Link>
    </div>
  );
}

export default EventDetails