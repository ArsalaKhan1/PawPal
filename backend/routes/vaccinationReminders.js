const express = require("express");
const router = express.Router();

const Pet = require("../models/Pet");
const Vaccination = require("../models/Vaccination");
const protect = require("../middleware/protect");

// GET /vaccinations/upcoming
router.get("/upcoming", protect, async (req, res) => {
    try {
        // Step 1: find every pet this user owns, but only pull the _id
        const myPets = await Pet.find({ owner: req.user.id }).select("_id");
        const petIds = myPets.map((pet) => pet._id);

        // Step 2: find every vaccination record for those pets that has a due date.
        // Overdue records need to be included here so Profile can show the full reminder list.
        const vaccinations = await Vaccination.find({
            pet: { $in: petIds },
            nextDueDate: { $ne: null }
        })
            .populate("pet", "name animal")
            .sort({ nextDueDate: 1 }); // 1 = ascending, so soonest due date comes first

        res.json(vaccinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;