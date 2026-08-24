import { Link } from "react-router-dom";
function PetCard({_id, name, animal, breed, age}){
    return(
        <div className = "petCard">
            <h3>{name}</h3>
            <p>Animal: {animal}</p>
            <p>Breed: {breed}</p>
            <p>Age: {age}</p>
            <Link to = {`/pets/${_id}/health`}>View Health records</Link>
        </div>
    );
}
export default PetCard;