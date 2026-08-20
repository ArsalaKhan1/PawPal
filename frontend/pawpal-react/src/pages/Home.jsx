import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import PetCard from "../components/PetCard";
import {Link} from "react-router-dom";
import Onboarding from "../components/Onboarding";

import Axios from "axios";
import {useEffect, useState} from "react";

function Home() {
    const [pets, setPets] = useState([]);
    useEffect(()=>{
        async function fetchPets(){
            try{
                const response = await Axios.get("http://localhost:5000/pets")
                setPets(response.data);
            }
            catch (err){
                console.error(err);
            }
        }
    fetchPets();
    }, []); /* [] indicates run this when array empty */

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