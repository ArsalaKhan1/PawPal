const express = require ("express");
const router = express.Router({mergeParams: true});
const Vaccination = require("../models/Vaccination"); /*imports the Vaccination model*/

/*routes for Vaccination records of a pet */

/*GET ALL*/
router.get("/", async(req,res)=>{
    try{
        const records = await Vaccination.find({pet: req.params.petId}).sort({dateGiven: -1});
        res.json(records);
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});

/* POST NEW */
router.post("/", async (req, res) => {
    try{
        const newRecord = await Vaccination.create({
            ...req.body, 
            pet: req.params.petId
        });
        res.status(201).json({
            message: "Vaccination record added successfully",
            newRecord
        });
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
});

/* update */
router.put("/:id", async(req,res)=>{
    try{
        const Updatedrecord = await Vaccination.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!Updatedrecord){
            return res.status(400).json({
                message: "Vaccination record not found to be updated!"
            });
        }
        res.json({
            message: "Vaccination record updated sucessfully",
            Updatedrecord
        });
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
});


/*delete*/ 
router.delete("/:id", async(req, res)=>{
    try{
        const deletedRec = await Vaccination.findByIdAndDelete(req.params.id);
        if(!deletedRec){
            return res.status(404).json({
                message: "Vaccination record not found to be deleted!"
            });
        }
        res.json({
            message: "Vaccination record deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            message:err.message
        });
    }
});

module.exports = router; /* exports router to be used in server.js */