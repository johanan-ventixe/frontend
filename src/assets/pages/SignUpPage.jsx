import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSignUpValidation } from '../js/SignUpValidation';

const SignUpPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null, success: false });

  const { validationErrors, handleFieldBlur, clearValidationErrors, validateForm, handleFieldChange } = useSignUpValidation();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7281/api/events/${id}`);
        if (!response.ok) throw new Error('Event not found');
        
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFieldChange(name, value, setFormData);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    handleFieldBlur(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(formData)) return;

    setSubmitStatus({ loading: true, error: null, success: false });
    
    try {
      const response = await fetch('https://localhost:7111/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, ...formData })
      });
      
      if (!response.ok) {
        let errorMessage = `Failed to register: ${response.status}`;
        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage = errorData.trim().startsWith('{') 
              ? JSON.parse(errorData).message || errorData 
              : errorData;
          }
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }
        throw new Error(errorMessage);
      }
      
      setSubmitStatus({ loading: false, error: null, success: true });
      clearValidationErrors();
    } catch (err) {
      setSubmitStatus({ loading: false, error: err.message, success: false });
    }
  };

  if (loading) return <div>Loading event information...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  if (submitStatus.success) {
    return (
      <div>
        <h2>Registration Successful!</h2>
        <p>You have successfully signed up for {event.title}.</p>
        <Link to={`/events/${id}`}>Back to Event</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign Up for Event</h1>
      <div>
        <h2>{event.title}</h2>
        <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
        <p>Location: {event.location}</p>
      </div>
      
      <form onSubmit={handleSubmit} noValidate>
        {[
          { name: 'firstName', label: 'First Name', type: 'text', required: true },
          { name: 'lastName', label: 'Last Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: false }
        ].map(field => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}:</label>
            <input 
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              className={validationErrors[field.name] ? 'input-validation-error' : ''}
              required={field.required}
            />
            {validationErrors[field.name] && (
              <span className="field-validation-error">
                {validationErrors[field.name]}
              </span>
            )}
          </div>
        ))}
        
        {submitStatus.error && (
          <div className='sign-up-error'>
            {submitStatus.error}
          </div>
        )}
        
        {/* disabled to prevent double clicking while loading */}
        <button type="submit" disabled={submitStatus.loading}>
          {submitStatus.loading ? 'Submitting...' : 'Sign Up'}
        </button>
      </form>
      
      <div>
        <Link to={`/events/${id}`}>Back to Event</Link>
      </div>
    </div>
  );
};

export default SignUpPage;