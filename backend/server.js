const express = require("express"); /* imports the express module */
const app = express(); /* builds app */
const PORT = 5000; /* sets port */
app.use(express.json()); /* allows express to parse json data */
app.get("/", (req, res) => { /* / for request path, req body, res for response body */
    res.send("PawPal Companion API Running"); /* sends simple mssage back */
});

let pets = [ /* mock array holding data for testing until no db */
    {
        id: 1,
        name: "Buddy",
        animal: "Dog",
        breed: "Golden Retriever",
        age: 4
    },
    {
        id: 2,
        name: "Luna",
        animal: "Cat",
        breed: "Persian",
        age: 2
    }
];

app.get("/", (req, res) => {
    res.send("PawPal Companion API Running");
});

app.get("/pets", (req, res) => {
    res.json(pets);
});

app.post("/pets", (req, res) => {
    const newPet = req.body;
    pets.push(newPet);

    res.json({
        message: "Pet added successfully",
        pet: newPet
    });
});

app.put("/pets/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedPet = req.body;

    const pet = pets.find(p => p.id === id);

    if (!pet) {
        return res.status(404).json({
            message: "Pet not found"
        });
    }

    Object.assign(pet, updatedPet);

    res.json({
        message: "Pet updated",
        pet
    });
});

app.delete("/pets/:id", (req, res) => {
    const id = Number(req.params.id);
    const ogLen = pets.length;
    pets = pets.filter(p => p.id !== id);

    if (pets.length === ogLen) {
        return res.status(404).json({
            message: "Pet not found"
        });
    }
    else{
    res.json({
        message: "Pet deleted"
    });
    }
});


app.listen(PORT, () => { /* actually starts the server and listens on the port */
    console.log(`Server running on port ${PORT}`); /* logs on terminal */
});