import { useState, useEffect } from 'react';

export const useEventModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const eventModal = document.getElementById('eventModal');
    
    if (eventModal && window.bootstrap) {
      const handleModalHidden = () => {
        setIsModalOpen(false);
        
        document.querySelectorAll('.input-validation-error').forEach(input => {
          input.classList.remove('input-validation-error');
        });

        document.querySelectorAll('.field-validation-error, .text-danger').forEach(span => {
          span.textContent = '';
          span.classList.remove('field-validation-error');
          span.classList.add('field-validation-valid');
        });
      };

      const handleModalShown = () => {
        setIsModalOpen(true);
      };

      eventModal.addEventListener('hidden.bs.modal', handleModalHidden);
      eventModal.addEventListener('shown.bs.modal', handleModalShown);
      
      return () => {
        if (eventModal) {
          eventModal.removeEventListener('hidden.bs.modal', handleModalHidden);
          eventModal.removeEventListener('shown.bs.modal', handleModalShown);
        }
      };
    }
  }, []);

  const openModal = () => {
    if (window.bootstrap) {
      const eventModal = new window.bootstrap.Modal(document.getElementById('eventModal'));
      eventModal.show();
    } else {
      console.error('Bootstrap is not loaded');
    }
  };

  const closeModal = () => {
    if (window.bootstrap) {
      const eventModal = window.bootstrap.Modal.getInstance(document.getElementById('eventModal'));
      if (eventModal) {
        eventModal.hide();
      }
    }
  };

  const closeModalAfterDelay = (delay = 2000) => {
    setTimeout(() => {
      closeModal();
    }, delay);
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    closeModalAfterDelay
  };
};

export const isBootstrapAvailable = () => {
  return typeof window !== 'undefined' && window.bootstrap;
};

export const initializeBootstrapModals = () => {
  if (isBootstrapAvailable()) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      new window.bootstrap.Modal(modal);
    });
  }
};

export const useModalFormState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetFormState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
    if (isLoading) {
      setError(null);
    }
  };

  const setErrorState = (errorMessage) => {
    setLoading(false);
    setError(errorMessage);
    setSuccess(false);
  };

  const setSuccessState = () => {
    setLoading(false);
    setError(null);
    setSuccess(true);
  };

  return {
    loading,
    error,
    success,
    resetFormState,
    setLoadingState,
    setErrorState,
    setSuccessState
  };
};