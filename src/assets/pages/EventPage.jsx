import Nav from '../Components/Nav'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import EventList from '../Components/EventList'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { useEventValidation } from '../js/validation'
import { useEventModal, useModalFormState } from '../js/EventModal'

const EventPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    eventDate: '',
    location: '',
    description: '',
    totalTickets: 100
  });

  const {
    validationErrors,
    handleFieldBlur,
    clearValidationErrors,
    validateForm,
    getFieldClassName,
    handleFieldChange
  } = useEventValidation();

  const { openModal, closeModalAfterDelay } = useEventModal();
  const { 
    loading, 
    error, 
    success, 
    resetFormState, 
    setLoadingState, 
    setErrorState, 
    setSuccessState 
  } = useModalFormState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFieldChange(name, value, setFormData);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    handleFieldBlur(name, value);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      eventDate: '',
      location: '',
      description: '',
      totalTickets: 100
    });
    resetFormState();
    clearValidationErrors();
  };

  const handleAddEventClick = () => {
    resetForm();
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setLoadingState(true);
    
    try {
      const eventResponse = await fetch('https://localhost:7281/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          eventDate: formData.eventDate,
          location: formData.location
        })
      });
      
      if (!eventResponse.ok) {
        throw new Error(`Failed to create event: ${eventResponse.status}`);
      }
      
      const eventData = await eventResponse.json();
      console.log("Event created:", eventData);
      
      const detailsResponse = await fetch('https://localhost:7230/api/eventdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: eventData.id,
          description: formData.description,
          totalTickets: formData.totalTickets,
          ticketsLeft: formData.totalTickets
        })
      });
      
      if (!detailsResponse.ok) {
        throw new Error(`Failed to create event details: ${detailsResponse.status}`);
      }
      
      console.log("Event details created successfully");
      setSuccessState();
      resetForm();
      
      closeModalAfterDelay(2000);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error("Error creating event:", err);
      setErrorState(err.message);
    }
  };

  return (
    <div className='portal-wrapper'>
      <Nav />
      <Header />
      <main>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', alignItems: 'center' }}>
          <EventList />
          <button 
            type="button"
            className="add-event-btn btn"
            onClick={handleAddEventClick}
          >
            + Add Event
          </button>
          <Link to="/bookings">View Bookings</Link>
        </div>
      </main>
      <Footer />
      
      {/* Add Event Modal */}
      <div className="modal fade" id="eventModal" tabIndex="-1" aria-labelledby="eventModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit} id="eventForm" noValidate>
              <div className="modal-header">
                <h2 className="modal-title" id="eventModalLabel">Add Event</h2>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {success ? (
                  <div style={{ textAlign: 'center', color: 'green' }}>
                    <p>Event created successfully!</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label">Event Title:</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className={getFieldClassName('title')}
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {validationErrors.title && (
                        <span className="field-validation-error text-danger">{validationErrors.title}</span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="eventDate" className="form-label">Date and Time:</label>
                      <input
                        type="datetime-local"
                        name="eventDate"
                        id="eventDate"
                        className={getFieldClassName('eventDate')}
                        value={formData.eventDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {validationErrors.eventDate && (
                        <span className="field-validation-error text-danger">{validationErrors.eventDate}</span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="location" className="form-label">Location:</label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        className={getFieldClassName('location')}
                        value={formData.location}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {validationErrors.location && (
                        <span className="field-validation-error text-danger">{validationErrors.location}</span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="form-label">Description:</label>
                      <textarea
                        name="description"
                        id="description"
                        className={getFieldClassName('description')}
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {validationErrors.description && (
                        <span className="field-validation-error text-danger">{validationErrors.description}</span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="totalTickets" className="form-label">Total Tickets:</label>
                      <input
                        type="number"
                        name="totalTickets"
                        id="totalTickets"
                        className={getFieldClassName('totalTickets')}
                        value={formData.totalTickets}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="1"
                        max="10000"
                        required
                      />
                      {validationErrors.totalTickets && (
                        <span className="field-validation-error text-danger">{validationErrors.totalTickets}</span>
                      )}
                    </div>
                    
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!success && (
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventPage