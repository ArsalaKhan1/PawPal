const mongoose = require("mongoose");

const weightEntrySchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    recordedAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("WeightEntry", weightEntrySchema);