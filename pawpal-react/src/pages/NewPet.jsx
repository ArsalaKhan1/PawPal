import {useState} from "react";
import PetCard from "../components/PetCard";

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

return (
    <main>
        <h2>Register a new pet!</h2>
        <form onSubmit={addPet}>
            <label>Name</label>
            <input 
                type="text"
                value = {name}
                onChange = {(e) => setName(e.target.value)}
            />
            <br /><br />
            <label>Animal</label>
            <input 
                type = "text"
                value = {animal}
                onChange = {(e) => setAnimal(e.target.value)}
            />
            <br /><br />
            <label>Breed</label>
            <input
                type = "text"
                value = {breed}
                onChange = {(e) => setBreed(e.target.value) }
            />
            <br /><br />
            <label>Age</label>
            <input
                type = "text"
                value = {age}
                onChange = { (e) => setAge(e.target.value)}
            />
            <br /><br />
            <button type = "submmit">
                Add Pet
            </button>

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
);
}

export default NewPet;
