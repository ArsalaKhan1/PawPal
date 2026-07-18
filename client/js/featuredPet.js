const pet = {
    name: "Balloo",
    animal: "Cat",
    breed: "Persian",
    age: 5,
    weight: 10
};  

const getAgeCategory=(age)=>{
    if(age < 2){
        return "Puppy";
    }else if(age < 7){
        return "Adult";
    }else{
        return "Senior";
    }
}

/*building a template literal or string*/
/*template literal exp that valuates whatever is inside and returns string*/
const petInfo = ` 
Name: ${pet.name}<br> 
Animal: ${pet.animal}<br>
Breed: ${pet.breed}<br>
Age: ${pet.age} years (${getAgeCategory(pet.age)})<br>
Weight: ${pet.weight} kg
`;

const petInfoElement = document.getElementById("petInfo");
if (petInfoElement){
    petInfoElement.innerHTML = petInfo;}

const form = document.getElementById("petForm");
const container = document.getElementById("petContainer");

if(form){
    form.addEventListener("submit", addPet);
}
function addPet(event){
    event.preventDefault();
    const name = document.getElementById("petName").value;
    const animal = document.getElementById("petAnimal").value;
    const breed = document.getElementById("petBreed").value;
    const age = document.getElementById("petAge").value;
    const weight = document.getElementById("petWeight").value;

    const card = document.createElement("div");
    card.className = "petCard";
    card.innerHTML = `
        <h3>${name}</h3>
        <p><strong>Animal: </strong>${animal}</p>
        <p><strong>Breed: </strong>${breed}</p>
        <p><strong>Age: </strong>${age} years (${getAgeCategory(age)})</p>
        <p><strong>Weight: </strong>${weight} kg</p> `;

    container.appendChild(card);
    form.reset();
}
