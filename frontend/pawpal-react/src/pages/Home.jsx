import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
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
        <Footer />
    </>
    );
}

export default Home;