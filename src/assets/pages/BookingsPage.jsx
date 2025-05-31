import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventList from '../components/EventList';

const BookingsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [signups, setSignups] = useState([]);

  const fetchSignups = async (eventId) => {
    try {
      const res = await fetch(`https://johanan-signupservice-a4ajefdnacd8akc2.swedencentral-01.azurewebsites.net/api/signup/event/${eventId}`);
      const data = await res.json();

      const sortedSignups = data.sort((a, b) => new Date(b.signUpDate) - new Date(a.signUpDate));
      setSignups(sortedSignups);
    } catch (error) {
      setSignups([]);
    }
  };

  const selectEvent = (event) => {
    setSelectedEvent(event);
    fetchSignups(event.id);
  };

  return (
    <div className='portal-wrapper'>
      <Nav />
      <Header />
      <main>
        <div className="container-wrapper">
        
          {/* Help from chatgpt how to display attendees*/}  
          {!selectedEvent ? (
            <EventList onEventClick={selectEvent}/>
          ) : (
            <div className='attendees-box'>
              <h5 className='attendees-title'>Attendees for: {selectedEvent.title}</h5>

              {signups.length > 0 ? (
                <table className='attendees-table'>
                  <thead>
                    <tr>
                      <th className='signup-name'>Name</th>
                      <th className='signup-email'>Email</th>
                      <th className='signup-phone'>Phone</th>
                      <th className='signup-date'>Sign Up Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {signups.map(signup => (
                      <tr key={signup.id}>
                        <td className='signup-name'>{signup.firstName} {signup.lastName}</td>
                        <td className='signup-email'>{signup.email}</td>
                        <td className='signup-phone'>{signup.phoneNumber || 'N/A'}</td>
                        <td className='signup-date'>{new Date(signup.signUpDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No attendees yet.</p>
              )}
              
              <p className='total-attendees'>Total: {signups.length}</p>
              <button className='btn attendees-back-button' onClick={() => setSelectedEvent(null)}>← Back</button>
            </div>

          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingsPage;