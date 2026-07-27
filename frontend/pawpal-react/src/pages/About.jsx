import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Mission from '../components/Mission'
import PetCard from '../components/PetCard'
import FeatureCard from '../components/FeatureCard'

function About(){
    return(
        <>
            <Navbar />
            <br></br>
            <Mission />
            <br></br>
            <FeatureCard />
            <br></br>
            <Footer />
        </>
    );
}
export default About;