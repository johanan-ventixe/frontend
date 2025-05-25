import { useState } from 'react';

export const useSignUpValidation = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const handleFieldBlur = (fieldName, value) => {
    const error = validateSignUpField(fieldName, value);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const validateForm = (formData) => {
    const errors = validateAllSignUpFields(formData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (fieldName, value, setFormData) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    if (validationErrors[fieldName]) {
      const error = validateSignUpField(fieldName, value);
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
    
    return value;
  };

  return {
    validationErrors,
    handleFieldBlur,
    clearValidationErrors,
    validateForm,
    handleFieldChange
  };
};

export const validateSignUpField = (fieldName, value) => {
  let errorMessage = "";

  switch (fieldName) {
    case 'firstName':
      if (!value || value.trim() === "") {
        errorMessage = "First Name is required.";
      } else if (value.trim().length < 2) {
        errorMessage = "First Name must be at least 2 characters long.";
      } else if (!/^[a-zA-ZåäöÅÄÖ\s'-]+$/.test(value.trim())) {
        errorMessage = "First Name can only contain letters, spaces, hyphens, and apostrophes.";
      }
      break;
      
    case 'lastName':
      if (!value || value.trim() === "") {
        errorMessage = "Last Name is required.";
      } else if (value.trim().length < 2) {
        errorMessage = "Last Name must be at least 2 characters long.";
      } else if (!/^[a-zA-ZåäöÅÄÖ\s'-]+$/.test(value.trim())) {
        errorMessage = "Last Name can only contain letters, spaces, hyphens, and apostrophes.";
      }
      break;
      
    case 'email':
      if (!value || value.trim() === "") {
        errorMessage = "Email is required.";
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) {
          errorMessage = "Please enter a valid email address.";
        }
      }
      break;
      
    case 'phoneNumber':
      if (value && value.trim() !== "") {
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        
        if (!phonePattern.test(cleanPhone)) {
          errorMessage = "Please enter a valid phone number.";
        } else if (cleanPhone.length < 7) {
          errorMessage = "Phone number must be at least 7 digits long.";
        } else if (cleanPhone.length > 15) {
          errorMessage = "Phone number cannot be longer than 15 digits.";
        }
      }
      break;
      
    default:
      break;
  }

  return errorMessage;
};

export const validateAllSignUpFields = (formData) => {
  const errors = {};
  Object.keys(formData).forEach(fieldName => {
    const error = validateSignUpField(fieldName, formData[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });
  return errors;
};