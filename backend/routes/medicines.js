const express = require ("express");
const router = express.Router({mergeParams: true});
const Medicine = require("../models/Medicine"); /*imports the Medicine model*/
const protect = require("../middleware/protect");

router.use(protect);

/*routes for Medicine records of a pet */

/*GET ALL*/
router.get("/", async(req,res)=>{
    try{
        const records = await Medicine.find({pet: req.params.petId});
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
        const newRecord = await Medicine.create({
            ...req.body, 
            pet: req.params.petId
        });
        res.status(201).json({
            message: "Medicine record added successfully",
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
        const Updatedrecord = await Medicine.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!Updatedrecord){
            return res.status(400).json({
                message: "Medicine record not found to be updated!"
            });
        }
        res.json({
            message: "Medicine record updated successfully",
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
        const deletedRec = await Medicine.findByIdAndDelete(req.params.id);
        if(!deletedRec){
            return res.status(404).json({
                message: "Medicine record not found to be deleted!"
            });
        }
        res.json({
            message: "Medicine record deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            message:err.message
        });
    }
});

module.exports = router; /* exports router to be used in server.js */