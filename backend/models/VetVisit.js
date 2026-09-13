const mongoose = require("mongoose");
const vetVisitSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId, ref: "Pet" ,required : true},
        vetName: {type: String, required : true},
        visitDate: {type: Date, required: true},
        reason: {type: String, required: true},
        clinicName: {type: String},
        diagnosis: {type: String},
        followupNeeded: {type: Boolean, default: false},
        followupDate: {type: Date},
        cost: {type: Number},
        photoUrl: { type: String }
}, {timestamps: true});

module.exports = mongoose.model("VetVisit", vetVisitSchema);