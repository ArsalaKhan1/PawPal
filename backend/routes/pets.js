const express = require("express");
const router = express.Router({mergeParams: true});
const upload = require("../middleware/upload");
const Pet = require("../models/Pet"); /* imports Pet model */
const WeightEntry = require("../models/WeightEntry");
const protect = require("../middleware/protect");

router.use(express.json()); /* allows express to parse json data */


/*create*/
router.post("/", protect, upload.single("photo"), async (req, res) => {
    try {
        const newPet = await Pet.create({
            ...req.body,
            photoUrl: req.file ? req.file.path : undefined,
            owner: req.user.id
        });

        await WeightEntry.create({
            pet: newPet._id,
            weight: newPet.weight,
            recordedAt: new Date()
        });

        res.status(201).json({
            message: "Pet added successfully",
            newPet
        });
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
});

/*read*/
router.get("/", protect, async (req, res) => {
    try{
        const pets = await Pet.find({ owner: req.user.id });
        res.json(pets);
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});

/*update*/
router.put("/:id", protect, async(req, res) => {
    try{
        const pet = await Pet.findById(req.params.id);
        if(!pet){
            return res.status(404).json({
            message: "Pet not found to be updated!"
            })
        }
        if(pet.owner.toString() !== req.user.id){
            return res.status(403).json({
                message: "You are not authorized to update this pet"
            });
        }
        const previousWeight = pet.weight;
        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if (req.body.weight !== undefined && Number(req.body.weight) !== Number(previousWeight)) {
            await WeightEntry.create({
                pet: updatedPet._id,
                weight: updatedPet.weight,
                recordedAt: new Date()
            });
        }

        res.json({
            message: "Pet updated successfully",
            pet: updatedPet
        });
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
});

/*delete*/
router.delete("/:id", protect, async(req, res) => {
    try{
        const pet = await Pet.findById(req.params.id);
        if(!pet){
            return res.status(404).json({
                message: "Pet not found"
            });
        }
        if(pet.owner.toString() !== req.user.id){
            return res.status(403).json({
                message: "You are not authorized to delete this pet"
            });
        }
        await Pet.findByIdAndDelete(req.params.id);
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

module.exports = router; 