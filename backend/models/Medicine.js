const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema({
    pet: {type: mongoose.Schema.Types.ObjectId, required : true},
    medicineName: {type: String, required: true},
    dosage: {type: String, required: true},
    frequency: { type: String, required: true },     
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    reason: { type: String },
    photoUrl: { type: String }
},{timestamps: true});

module.exports = mongoose.model("Medicine", medicineSchema);