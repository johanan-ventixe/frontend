import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSignUpValidation } from '../js/SignupValidation';
import Nav from '../components/Nav';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignUpPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null, success: false });
  const { validationErrors, handleFieldBlur, clearValidationErrors, validateForm, handleFieldChange } = useSignUpValidation();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://johanan-eventservice-b0eyfverb8e7cnfx.swedencentral-01.azurewebsites.net/api/events/${id}`);
        if (!res.ok) throw new Error('Event not found');
        
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchEvent();
  }, [id]);

  const handleChange = (e) => handleFieldChange(e.target.name, e.target.value, setFormData);
  const handleBlur = (e) => handleFieldBlur(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    setSubmitStatus({error: null, success: false });
    
    try {
      const res = await fetch('https://johanan-signupservice-a4ajefdnacd8akc2.swedencentral-01.azurewebsites.net/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, ...formData })
      });
      
      if (!res.ok) {
        let errorMessage = `Failed to register: ${res.status}`;
        try {
          const errorData = await res.text();
          if (errorData) {
            errorMessage = errorData.trim().startsWith('{') 
              ? JSON.parse(errorData).message || errorData 
              : errorData;
          }
        } catch (errorMessage) {
          throw new Error(errorMessage);
        }
      }
      
      setSubmitStatus({ loading: false, error: null, success: true });
      clearValidationErrors();
    } catch (err) {
      setSubmitStatus({ loading: false, error: err.message, success: false });
    }
  };

  const formatDate = (date) => 
    `${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} - ${new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: false }
  ];

  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  if (submitStatus.success) {
    return (
      <div className='portal-wrapper'>
        <Nav />
        <Header />
        <main>
          <div className="container-wrapper">
            <h5>{event.title}</h5>
            <p>Thank you for signing up for {event.title}.</p>
            <Link to={`/events/${id}`}>
              <button className='btn'>
                Back to Event
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='portal-wrapper'>
      <Nav />
      <Header />
      <main>
        <div className="container-wrapper">
          <div className='sign-up-page-event'>
            <h5>{event.title}</h5>
            <p className='info-date'>
              <i className="fa-thin fa-calendar"></i>
              {formatDate(event.eventDate)}
            </p>
            <p><i className="fa-light fa-location-dot"></i> {event.location}</p>
          </div>
          
          <form className="sign-up-form" onSubmit={handleSubmit} noValidate>
            {fields.map(field => (
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
            
            {submitStatus.error && <div className='sign-up-error'>{submitStatus.error}</div>}
            
            {/* disabled to prevent double clicking while loading */}
            <button className='btn' type="submit" disabled={submitStatus.loading}>
              {submitStatus.loading ? 'Submitting...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;