const express = require("express");
const router = express.Router({mergeParams: true});
        
const Pet = require("../models/Pet"); /* imports Pet model */

router.use(express.json()); /* allows express to parse json data */


/*create*/
router.post("/", async (req, res) => {
    try{
    const newPet = await Pet.create(req.body);
    res.status(201).json({
        message: "Pet added successfully",
        newPet
    }); 
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
});

/*read*/
router.get("/", async (req, res) => {
    try{
        const pets = await Pet.find();
        res.json(pets);
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});

/*update*/
router.put("/:id", async(req, res) => {
    try{
        const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!pet){
            return res.status(404).json({
            message: "Pet not found to be updated!"
            })
        }
        res.json({
            message: "Pet updated successfully",
            pet
        });
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
});

/*delete*/
router.delete("/:id", async(req, res) => {
    try{
        const pet = await Pet.findByIdAndDelete(req.params.id)
        if(!pet){
            res.status(404).json({
                message: "Pet not found"
            });
        }
        res.json({
            message: "Pet deleted successfully"
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router; /* exports router to be used in server.js */