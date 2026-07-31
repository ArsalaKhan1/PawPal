const mongoose = require("mongoose");
const petSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        animal: {
            type: String,
            required: true
        },
        breed:{
            type: String,
            required: true
        },
        age:{
            type: Number,
            required: true
        },
        weight:{
            type: Number,
            required: true
        },
        vaccinated:{
            type: Boolean,
            required: true
        },
        owner: {
            type: String,
            required: true
        }
    });

    const Pet = mongoose.model("Pet", petSchema);
    module.exports = Pet;
