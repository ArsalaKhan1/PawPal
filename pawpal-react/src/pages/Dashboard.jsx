import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Mission from '../components/Mission'
import PetCard from '../components/PetCard'
import FeatureCard from '../components/FeatureCard'

function Dashboard(){
    return(
        <>
            <Navbar />
            <br></br>
            <Hero />
            <br></br>
            <h2>Stats</h2>
            <h3>Registered Pets: 10</h3>
            <h3>Upcoming vaccinations: 3</h3>
            <h4>Due pets:</h4>
            
            <Footer />
        </>
    );
}
export default Dashboard;