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

document.getElementById("petInfo").innerHTML = petInfo;