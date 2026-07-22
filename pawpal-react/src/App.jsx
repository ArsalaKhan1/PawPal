import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";
import Footer from "./components/Footer";
import PetCard from "./components/PetCard";
import NewPet from "./pages/NewPet";
import './App.css'

function App() {
  return(
    <>
        <Navbar />
        <Hero />
        <FeatureCard />
        <h2>Meet some of our featured pets!</h2>
        <PetCard 
            name = "Balloo"
            animal = "Cat"
            breed = "Persian"
            age = {5}
        />
        <NewPet />
        <Footer />
    </>
  );
}
export default App;
