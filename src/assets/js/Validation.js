import { useState } from 'react';


export const useEventValidation = (initialFormData) => {
  const [validationErrors, setValidationErrors] = useState({});

  const handleFieldBlur = (fieldName, value) => {
    const error = validateEventField(fieldName, value);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleFieldInput = (fieldName, value) => {
    if (validationErrors[fieldName]) {
      const error = validateEventField(fieldName, value);
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const validateForm = (formData) => {
    const errors = validateAllEventFields(formData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldClassName = (fieldName, baseClass = 'form-control') => {
    return `${baseClass} ${validationErrors[fieldName] ? 'input-validation-error' : ''}`;
  };

  const handleFieldChange = (fieldName, value, setFormData) => {
    const newValue = fieldName === 'totalTickets' ? parseInt(value) || '' : value;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: newValue
    }));

    handleFieldInput(fieldName, newValue);
    
    return newValue;
  };

  return {
    validationErrors,
    handleFieldBlur,
    handleFieldInput,
    clearValidationErrors,
    validateForm,
    getFieldClassName,
    handleFieldChange
  };
};

export const validateEventField = (fieldName, value) => {
  let errorMessage = "";

  switch (fieldName) {
    case 'title':
      if (!value || value.trim() === "") {
        errorMessage = "Event Title is required.";
      }
      break;
    case 'eventDate':
      if (!value || value.trim() === "") {
        errorMessage = "Date and Time is required.";
      } else {
        const selectedDate = new Date(value);
        const now = new Date();
        if (selectedDate <= now) {
          errorMessage = "Event date must be in the future.";
        }
      }
      break;
    case 'location':
      if (!value || value.trim() === "") {
        errorMessage = "Location is required.";
      }
      break;
    case 'description':
      if (!value || value.trim() === "") {
        errorMessage = "Description is required.";
      }
      break;
    case 'totalTickets':
      if (!value || value === "") {
        errorMessage = "Total Tickets is required.";
      } else {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 1) {
          errorMessage = "Total Tickets must be at least 1.";
        }
      }
      break;
    default:
      break;
  }

  return errorMessage;
};

export const validateAllEventFields = (formData) => {
  const errors = {};
  Object.keys(formData).forEach(fieldName => {
    const error = validateEventField(fieldName, formData[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });
  return errors;
};

export const validateField = (field) => {
  const fieldName = field.name;
  const errorSpan = document.querySelector(`[data-valmsg-for="${fieldName}"]`);

  if (!errorSpan) return;

  let errorMessage = "";

  if (field.type === 'checkbox') {
    if (field.hasAttribute("data-val-required") && !field.checked) {
      errorMessage = field.getAttribute("data-val-required");
    }
  } else {
    const value = field.value.trim();

    if (field.hasAttribute("data-val-required") && value === "") {
      errorMessage = field.getAttribute("data-val-required");
    }
    else if (field.hasAttribute("data-val-email") && value !== "") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        errorMessage = field.getAttribute("data-val-email");
      }
    }
    else if (field.hasAttribute("data-val-regex") && value !== "") {
      const pattern = new RegExp(field.getAttribute("data-val-regex-pattern"));
      if (!pattern.test(value)) {
        errorMessage = field.getAttribute("data-val-regex");
      }
    }
    else if (field.hasAttribute("data-val-minlength") && value !== "") {
      const minLength = parseInt(field.getAttribute("data-val-minlength-min"));
      if (value.length < minLength) {
        errorMessage = field.getAttribute("data-val-minlength");
      }
    }
    else if (field.hasAttribute("data-val-equalto") && value !== "") {
      const otherFieldName = field.getAttribute("data-val-equalto-other").replace('*.', '');
      const otherField = document.querySelector(`[name="${otherFieldName}"]`);
      if (otherField && value !== otherField.value) {
        errorMessage = field.getAttribute("data-val-equalto");
      }
    }
  }

  if (errorMessage) {
    field.classList.add("input-validation-error");
    errorSpan.textContent = errorMessage;
    errorSpan.classList.add("field-validation-error");
    errorSpan.classList.remove("field-validation-valid");
  } else {
    field.classList.remove("input-validation-error");
    errorSpan.textContent = "";
    errorSpan.classList.remove("field-validation-error");
    errorSpan.classList.add("field-validation-valid");
  }
};

export const initializeFormValidation = () => {
  document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll("form[novalidate]");

    forms.forEach(form => {
      const fields = form.querySelectorAll("input[data-val='true'], textarea[data-val='true'], select[data-val='true']");

      fields.forEach(field => {
        field.addEventListener("blur", function () {
          validateField(field);
        });

        field.addEventListener("input", function () {
          validateField(field);
        });

        if (field.type === 'checkbox') {
          field.addEventListener("change", function () {
            validateField(field);
          });
        }
      });

      form.addEventListener("submit", function (e) {
        let isValid = true;

        fields.forEach(field => {
          validateField(field);
          if (field.classList.contains("input-validation-error")) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  });
};