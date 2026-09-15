import { useState } from "react";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";
import Axios from "axios";
import api from "../utils/api";

function NewPet(){
    const [name, setName] = useState("");
    const [animal, setAnimal] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [vaccinated, setVaccinated] = useState("");
    const [photo, setPhoto] = useState(null);
    async function addPet(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("animal", animal);
        formData.append("breed", breed);
        formData.append("age", age);
        formData.append("weight", weight);
        formData.append("vaccinated", vaccinated);
        if (photo) {
            formData.append("photo", photo);
        }

        const token = localStorage.getItem("token");

        try {
            await api.post("/NewPet", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Pet added successfully!");
            setName(""); setAnimal(""); setBreed(""); setAge("");
            setWeight(""); setVaccinated(""); setPhoto(null);
        } catch (err) {
            console.error(err);
            alert("Failed to add pet, Please try again!");
        }
    }

    return (<>
        <Navbar />
        <main>
            <form className="petForm" onSubmit={addPet}>
                <h2>Register a new pet!</h2>
                <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Animal" type="text" value={animal} onChange={(e) => setAnimal(e.target.value)} required />
                <Input label="Breed" type="text" value={breed} onChange={(e) => setBreed(e.target.value)} required />
                <Input label="Vaccinated" type="text" value={vaccinated} onChange={(e) => setVaccinated(e.target.value)} />
                <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                <Input label="Weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />

                <div className="inputField">
                    <label htmlFor="pet-photo">Pet Photo</label>
                    <input
                        type="file"
                        id="pet-photo"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                </div>

                <Button type="submit">Add Pet</Button>
            </form>
        </main>
    </>);
}

export default NewPet;