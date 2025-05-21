import Nav from '../Components/Nav'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import EventList from '../Components/EventList'

const EventPage = () => {
  return (
    <div className='portal-wrapper'>
      <Nav />
      <Header />
      <main>
          <EventList />
      </main>
      <Footer />
    </div>
  )
}

export default EventPage