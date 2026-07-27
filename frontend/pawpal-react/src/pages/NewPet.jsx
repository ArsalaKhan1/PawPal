import {useState} from "react";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import Input from "../components/Input";
import Button from "../components/Button";

function NewPet(){
    const [pets, setPets] = useState([]); /*pets are stored here, initially empty*/
    const [name, setName] = useState(""); /* stores what user is typing */
    const [animal, setAnimal] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");

    function addPet(event) {
        event.preventDefault(); /* stops refresh */
    
    const newPet = {
        name, animal, breed, age
    };
    setPets([...pets, newPet]); /*adds new pet */
    setName("");
    setAnimal("");
    setBreed("");
    setAge("");
}

return (<>
    <Navbar />
    <main>
        <form className = "petForm" onSubmit={addPet}>
            <h2>Register a new pet!</h2>
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
                type = "text"
                value = {age}
                onChange = { (e) => setAge(e.target.value)}
                required
            />
            <Button type = "submit">
                Add Pet
            </Button>

        </form>
        <hr />
        {pets.map((pet,index) => (
            <PetCard 
                key ={index}
                name = {pet.name}
                animal = {pet.animal}
                breed = {pet.breed}
                age = {pet.age}/>
        ))}
    </main>
    </>
);
}

export default NewPet;
