import { Link } from 'react-router-dom'

const EventCard = ({card}) => {
  return (
    <Link to={`/events/${card.id}`}>
      <h5>{card.title}</h5>
    </Link>
  )
}

export default EventCard