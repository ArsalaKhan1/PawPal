const mongoose = require ("mongoose");
const vaccinationSchema = new mongoose.Schema({
    pet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required
    },
    vaccineName: {type: String, required},
    dateGiven: {type: Date, required},
    nextDueDate: {type: Date, required},
    vetName: {type: String},
    notes: {type: String}
}, {timestamps: true});

module.exports = mongoose.model("Vaccination", vaccinationSchema);