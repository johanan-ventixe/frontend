import { useEffect, useState } from 'react'
import EventCard from './EventCard'

const EventList = ({ onEventClick }) => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true)
        const res = await fetch("https://johanan-eventservice-b0eyfverb8e7cnfx.swedencentral-01.azurewebsites.net/api/events")
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data = await res.json()

        const sortedEvents = data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))

        setEvents(sortedEvents)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getEvents()
  }, [])

  if (loading) return <div>Loading events...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <section className="events-box" id="events-box">
      {events.map(event => (
        <EventCard key={event.id} card={event} onEventClick={onEventClick} />
      ))}
    </section>
  )
}

export default EventList