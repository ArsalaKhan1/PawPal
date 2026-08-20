import { useState } from "react";
import Axios from "axios";
import Input from "./Input";
import Button from "./Button";

function MedicineForm({ petId, onAdded }) {
    const [medicineName, setMedicineName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        const newRecord = { medicineName, dosage, frequency, startDate, endDate, reason };

        try {
            await Axios.post(`http://localhost:5000/pets/${petId}/medicines`, newRecord);
            onAdded();
        } catch (err) {
            console.error(err);
            alert("Failed to add medicine record.");
        }
    }

    return (
        <form className = "healthForm" onSubmit={handleSubmit}>
            <Input label="Medicine Name" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} required />
            <Input label="Dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
            <Input label="Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} required />
            <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <Input label="End Date (leave blank if ongoing)" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Input label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Button type="submit">Save Medicine</Button>
        </form>
    );
}

export default MedicineForm;