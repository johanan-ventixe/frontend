import React, { useEffect, useState } from 'react'
import EventCard from './EventCard'

const EventList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch("https://localhost:7281/api/events")
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data = await res.json()
        setEvents(data)
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
    <section>
      {events.map(event => (
        <EventCard key={event.id} card={event} />
      ))}
    </section>
  )
}

export default EventList