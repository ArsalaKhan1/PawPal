import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";

function Dashboard() {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [animalFilter, setAnimalFilter] = useState("");
    const [vaccinatedFilter, setVaccinatedFilter] = useState("");

    useEffect(() => {
        async function fetchPets() {
            const token = localStorage.getItem("token");
            try {
                const response = await api.get("/pets", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPets(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchPets();
    }, []);

    const animalOptions = Object.values(
        pets.reduce((uniqueAnimals, pet) => {
            const key = pet.animal.trim().toLowerCase();
            if (!uniqueAnimals[key]) {
                uniqueAnimals[key] = pet.animal; // keep whichever casing was typed first, just for display
            }
            return uniqueAnimals;
        }, {})
    );

    const filteredPets = pets.filter((pet) => {
        const search = searchTerm.trim().toLowerCase();

        const matchesSearch =
            search === "" ||
            pet.name.toLowerCase().includes(search) ||
            pet.breed.toLowerCase().includes(search) ||
            pet.age.toString().includes(search);

        const matchesAnimal = animalFilter === "" || pet.animal.trim().toLowerCase() === animalFilter.trim().toLowerCase();

        const matchesVaccinated =
            vaccinatedFilter === "" || String(pet.vaccinated) === vaccinatedFilter;

        return matchesSearch && matchesAnimal && matchesVaccinated;
    });

    return (
        <>
            <Navbar />
            <main>
                <div className="dashboardHeader">
                    <h2 className="pageHeading">Your Pets</h2>
                    <div className="dashboardActions">
                        <Link to="/pets" className="simpleButton">+ Add New Pet</Link>
                    </div>
                </div>

                <div className="petFilters">
                    <input
                        type="text"
                        className="petSearchInput"
                        placeholder="Search by name, breed, or age..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select value={animalFilter} onChange={(e) => setAnimalFilter(e.target.value)}>
                        <option value="">All Species</option>
                        {animalOptions.map((animal) => (
                            <option key={animal} value={animal}>{animal}</option>
                        ))}
                    </select>

                    <select value={vaccinatedFilter} onChange={(e) => setVaccinatedFilter(e.target.value)}>
                        <option value="">All Vaccination Statuses</option>
                        <option value="true">Vaccinated</option>
                        <option value="false">Not Vaccinated</option>
                    </select>
                </div>

                {filteredPets.length === 0 ? (
                    <p className="emptyMessage">
                        {pets.length === 0 ? "No pets registered yet." : "No pets match your search."}
                    </p>
                ) : (
                    <div className="pet-grid">
                        {filteredPets.map((pet) => (
                            <PetCard
                                key={pet._id}
                                _id={pet._id}
                                name={pet.name}
                                animal={pet.animal}
                                breed={pet.breed}
                                age={pet.age}
                                photoUrl={pet.photoUrl}
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}

export default Dashboard;