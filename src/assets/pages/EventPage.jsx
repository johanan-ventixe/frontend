import Nav from '../components/Nav'
import Header from '../components/Header'
import Footer from '../components/Footer'
import EventList from '../components/EventList'
import { useState } from 'react'
import { useEventValidation } from '../js/Validation'
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
    validationErrors, handleFieldBlur, clearValidationErrors, validateForm, getFieldClassName, handleFieldChange } = useEventValidation();

  const { openModal, closeModalAfterDelay } = useEventModal();
  const { loading, error, success, resetFormState, setLoadingState, setErrorState, setSuccessState } = useModalFormState();

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
      const eventRes = await fetch('https://johanan-eventservice-b0eyfverb8e7cnfx.swedencentral-01.azurewebsites.net/api/Events', {
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
      
      if (!eventRes.ok) {
        throw new Error(`Failed to create event: ${eventRes.status}`);
      }
      
      const eventData = await eventRes.json();
      
      const detailsRes = await fetch('https://johanan-eventdetailsservice-f6huebb0fsf2djcz.swedencentral-01.azurewebsites.net/api/eventdetails', {
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
      
      if (!detailsRes.ok) {
        throw new Error(`Failed to create event details: ${detailsRes.status}`);
      }
      setSuccessState();
      resetForm();
      
      closeModalAfterDelay(2000);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      setErrorState(err.message);
    }
  };

  return (
    <div className='portal-wrapper'>
      <Nav />
      <Header onAddEventClick={handleAddEventClick} />
      <main>
        <div className="container-wrapper">
          <EventList />
        </div>
      </main>
      <Footer />
      
      {/* Add Event Modal */}
      <div className="modal fade" id="eventModal" tabIndex="-1" aria-labelledby="eventModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit} id="eventForm" className='eventForm' noValidate>
              <div className="modal-header">
                <h4 className="modal-title" id="eventModalLabel">Add Event</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
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