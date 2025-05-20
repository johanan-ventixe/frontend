
import { Route, Routes } from 'react-router-dom'
import './App.css'
import EventPage from './assets/pages/EventPage'
import EventDetails from './assets/pages/EventDetails'
import SignUpPage from './assets/pages/SignUpPage'
import BookingsPage from './assets/pages/BookingsPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<EventPage />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/events/:id/signup" element={<SignUpPage />} />
      <Route path="/bookings" element={<BookingsPage />} />

    </Routes>
  )
}

export default App
