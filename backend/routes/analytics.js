const express = require("express");
const router = express.Router();

const Pet = require("../models/Pet");
const Vaccination = require("../models/Vaccination");
const VetVisit = require("../models/VetVisit");
const WeightEntry = require("../models/WeightEntry");
const protect = require("../middleware/protect");

function normalizeDay(date) {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
}

function getVaccinationLevel(nextDueDate) {
    const today = normalizeDay(new Date());
    const dueDate = normalizeDay(nextDueDate);
    const daysUntilDue = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
        return "overdue";
    }
    if (daysUntilDue <= 14) {
        return "due-soon";
    }
    return "upcoming";
}

async function getAuthorizedPetIds(req, petId) {
    if (petId) {
        const pet = await Pet.findOne({ _id: petId, owner: req.user.id }).select("_id");
        return pet ? [pet._id] : [];
    }

    const pets = await Pet.find({ owner: req.user.id }).select("_id");
    return pets.map((pet) => pet._id);
}

router.use(protect);

router.get("/weight-history", async (req, res) => {
    try {
        const petIds = await getAuthorizedPetIds(req, req.query.petId);

        const entries = await WeightEntry.find({ pet: { $in: petIds } })
            .populate("pet", "name animal")
            .sort({ recordedAt: 1 });

        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/weight-history", async (req, res) => {
    try {
        const { petId, weight, recordedAt } = req.body;
        const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        const newEntry = await WeightEntry.create({
            pet: pet._id,
            weight: Number(weight),
            recordedAt: recordedAt ? new Date(recordedAt) : new Date()
        });

        res.status(201).json({ message: "Weight entry added successfully", newEntry });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/vaccination-progress", async (req, res) => {
    try {
        const petIds = await getAuthorizedPetIds(req, req.query.petId);

        if (req.query.petId && petIds.length === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const vaccinations = await Vaccination.find({
            pet: { $in: petIds },
            nextDueDate: { $ne: null }
        }).select("nextDueDate");

        const counts = {
            overdue: 0,
            "due-soon": 0,
            upcoming: 0
        };

        vaccinations.forEach((record) => {
            if (!record.nextDueDate) {
                return;
            }
            const level = getVaccinationLevel(record.nextDueDate);
            counts[level] += 1;
        });

        const total = counts.overdue + counts["due-soon"] + counts.upcoming;

        res.json({
            labels: ["Overdue", "Due soon", "On track"],
            counts: [counts.overdue, counts["due-soon"], counts.upcoming],
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/monthly-vet-visits", async (req, res) => {
    try {
        const petIds = await getAuthorizedPetIds(req, req.query.petId);
        if (req.query.petId && petIds.length === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const pets = await Pet.find({ _id: { $in: petIds } }).select("_id name animal");

        const visits = await VetVisit.aggregate([
            {
                $match: {
                    pet: { $in: petIds }
                }
            },
            {
                $project: {
                    pet: 1,
                    monthKey: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$visitDate",
                            timezone: "UTC"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        pet: "$pet",
                        monthKey: "$monthKey"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        const now = new Date();
        const labels = [];
        const series = pets.map((pet) => ({
            pet: {
                _id: pet._id,
                name: pet.name,
                animal: pet.animal
            },
            counts: []
        }));
        const petMonthCounts = new Map(pets.map((pet) => [pet._id.toString(), new Map()]));

        visits.forEach((visit) => {
            const petId = visit._id.pet.toString();
            if (!petMonthCounts.has(petId)) {
                petMonthCounts.set(petId, new Map());
            }

            petMonthCounts.get(petId).set(visit._id.monthKey, visit.count);
        });

        for (let offset = 11; offset >= 0; offset -= 1) {
            const monthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
            const key = `${monthDate.getUTCFullYear()}-${String(monthDate.getUTCMonth() + 1).padStart(2, "0")}`;
            labels.push(monthDate.toLocaleDateString(undefined, { month: "short", year: "numeric", timeZone: "UTC" }));

            series.forEach((entry) => {
                const count = petMonthCounts.get(entry.pet._id.toString())?.get(key) || 0;
                entry.counts.push(count);
            });
        }
        res.json({ labels, series });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;