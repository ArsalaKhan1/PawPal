import { Link } from "react-router-dom";
function PetCard({_id, name, animal, breed, age, photoUrl}) {
    return(
        <div className = "petCard">
            <h3>{name}</h3>
            <p>Animal: {animal}</p>
            <p>Breed: {breed}</p>
            <p>Age: {age}</p>
            {photoUrl && <img src={photoUrl} alt={name} width="100%" />}
            <Link to = {`/pets/${_id}/health`}>View Health records</Link>
        </div>
    );
}
export default PetCard;

