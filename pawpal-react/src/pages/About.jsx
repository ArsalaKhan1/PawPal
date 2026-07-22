import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Mission from '../components/Mission'
import PetCard from '../components/PetCard'

function About(){
    return(
        <>
            <Navbar />
            <PetCard/>
            <Mission />
            <Footer />
        </>
    );
}
export default About;