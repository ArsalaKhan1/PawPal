import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import PetCard from "../components/PetCard";
import {Link} from "react-router-dom";
import Onboarding from "../components/Onboarding";
function Home() {
    return (
    <>
        <Navbar />
        <Hero />
        <FeatureCard />
        <br></br>
        <Onboarding />
        <h2>Meet some of our featured pets!</h2>
        <PetCard 
            name = "Balloo"
            animal = "Cat"
            breed = "Persian"
            age = "5 years"
        />
        <Footer />
    </>
    );
}

export default Home;