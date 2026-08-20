import {useState} from "react";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";
import Axios from "axios"


function NewPet(){

    const [name, setName] = useState(""); /* stores what user is typing */
    const [animal, setAnimal] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [owner, setOwner] = useState("");
    const [vaccinated, setVaccinated] = useState("");

    async function addPet(event) {
        event.preventDefault(); /* stops refresh */
    
    const newPet = {
        name, animal, breed, age, weight, owner, vaccinated
    };
    try{
        await Axios.post("http://localhost:5000/pets", newPet);
        alert("Pet added successfully!");
        setName("");
        setAnimal("");
        setBreed("");
        setAge("");
        setWeight("");
        setOwner("");
        setVaccinated("");
    }
    catch(err){
        console.error(err);
        alert("Failed to add pet, Please try again!");
    }
}

return (<>
    <Navbar />
    <main>
        <form className = "petForm" onSubmit={addPet}>
            <h2 className="pageHeading">Register a new pet!</h2>
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
                label= "Vaccinated"
                type = "boolean"
                value = {vaccinated}
                onChange = {(e)=> setVaccinated(e.target.value)}
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
            <Input
                label = "Owner"
                type = "string"
                value = {owner}
                onChange={(e) => setOwner(e.target.value)}
                required
            />

            <Button type = "submit">
                Add Pet
            </Button>

        </form>
    </main>
    </>
);
}

export default NewPet;
