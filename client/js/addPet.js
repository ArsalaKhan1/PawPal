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
