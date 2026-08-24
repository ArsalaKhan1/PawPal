const express = require ("express");
const router = express.Router({mergeParams: true});
const vetVisit = require("../models/vetVisit"); /*imports the vetVisits model*/
const protect = require("../middleware/protect");

router.use(protect);

/*routes for vetVisits records of a pet */

/*GET ALL*/
router.get("/", async(req,res)=>{
    try{
        const records = await vetVisit.find({pet: req.params.petId});
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
        const newRecord = await vetVisit.create({
            ...req.body, 
            pet: req.params.petId
        });
        res.status(201).json({
            message: "Vet visit record added successfully",
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
        const Updatedrecord = await vetVisit.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!Updatedrecord){
            return res.status(400).json({
                message: "Vet visit record not found to be updated!"
            });
        }
        res.json({
            message: "Vet visit record updated successfully",
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
        const deletedRec = await vetVisit.findByIdAndDelete(req.params.id);
        if(!deletedRec){
            return res.status(404).json({
                message: "Vet visit record not found to be deleted!"
            });
        }
        res.json({
            message: "Vet visit record deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            message:err.message
        });
    }
});

module.exports = router; /* exports router to be used in server.js */