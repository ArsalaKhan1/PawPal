import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";
import Axios from "axios"


function NewPet(){
    const navigate = useNavigate();

    const [name, setName] = useState(""); /* stores what user is typing */
    const [animal, setAnimal] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [vaccinated, setVaccinated] = useState("true");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");

    async function addPet(event) {
        event.preventDefault(); /* stops refresh */
    
    const newPet = {
        name,
        animal,
        breed,
        age: Number(age),
        weight: Number(weight),
        vaccinated: vaccinated === "true"
    };
    try{
        await Axios.post("http://localhost:5000/pets", newPet,
            {headers: {Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setStatusType("success");
        setStatusMessage("Pet added successfully. Returning to your dashboard...");
        setName("");
        setAnimal("");
        setBreed("");
        setAge("");
        setWeight("");
        setVaccinated("true");

        window.setTimeout(() => {
            navigate("/dashboard", {
                state: { message: "Pet added successfully." }
            });
        }, 1200);
    }
    catch(err){
        console.error(err);
        setStatusType("error");
        setStatusMessage(err.response?.data?.message || "Failed to add pet. Please try again.");
    }
}

return (<>
    <Navbar />
    <main>
        <form className = "petForm" onSubmit={addPet}>
            <h2 className="pageHeading">Register a new pet!</h2>
            {statusMessage && (
                <p className={statusType === "success" ? "successMessage" : "errorMessage"}>
                    {statusMessage}
                </p>
            )}
             <Input
                    label="Name"
                    type="text"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                    required
            />
            <Input
                    label="Animal"
                    type="text"
                    value = {animal}
                    onChange = {(e) => setAnimal(e.target.value)}
                    required
            />
            <Input
                    label="Breed"
                    type="text"
                    value = {breed}
                    onChange = {(e) => setBreed(e.target.value) }
                    required
            />
            <Input
                label = "Age"
                type = "number"
                value = {age}
                onChange = { (e) => setAge(e.target.value)}
                required
            />
            <Input 
                label = "Weight"
                type = "number"
                value = {weight}
                onChange = {(e) => setWeight(e.target.value)}
                required
            />
            <div className="inputField">
                <label>Vaccinated</label>
                <select value={vaccinated} onChange={(e) => setVaccinated(e.target.value)}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <Button type = "submit">
                Add Pet
            </Button>

        </form>
    </main>
    </>
);
}

export default NewPet;
