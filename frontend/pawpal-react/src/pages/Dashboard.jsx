import { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import { Link } from "react-router-dom";

function Dashboard() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        async function fetchPets() {
            try {
                // TODO: once auth exists, filter by the logged-in user's
                // owner id instead of fetching everything — e.g.
                // Axios.get(`http://localhost:5000/pets?owner=${userId}`)
                const response = await Axios.get("http://localhost:5000/pets");
                setPets(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchPets();
    }, []);

    return (
        <>
            <Navbar />
            <main>
                <div className="dashboardHeader">
                <h2 className = "pageHeading">Your Pets</h2>
                <Link to="/NewPet" className="simpleButton">
                        + Add New Pet
                </Link>
                </div>
                {pets.length === 0 ? (
                    <p className = "emptyMessage">No pets registered yet.</p>
                ) : (
                    <div className = "pet-grid">
                    {pets.map((pet) => (
                        <PetCard
                            key={pet._id}
                            _id={pet._id}
                            name={pet.name}
                            animal={pet.animal}
                            breed={pet.breed}
                            age={pet.age}
                        />
                    ))}
                    </div>
                )}
            </main>
        </>
    );
}

export default Dashboard;