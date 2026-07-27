function PetCard({name, animal, breed, age}){
    return(
        <div className = "petCard">
            <h3>{name}</h3>
            <p>Animal: {animal}</p>
            <p>Breed: {breed}</p>
            <p>Age: {age}</p>
        </div>
    );
}
export default PetCard;