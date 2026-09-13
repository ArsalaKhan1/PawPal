import { useState } from "react";
import Axios from "axios";
import api from "../utils/api";
import Input from "./Input";
import Button from "./Button";

function MedicineForm({ petId, onAdded }) {
    const [medicineName, setMedicineName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");

    function handlePhotoChange(event) {
        const file = event.target.files?.[0] || null;
        setPhoto(file);

        if (!file) {
            setPhotoPreview("");
            return;
        }

        setPhotoPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append("medicineName", medicineName);
        formData.append("dosage", dosage);
        formData.append("frequency", frequency);
        formData.append("startDate", startDate);
        if (endDate) formData.append("endDate", endDate);
        if (reason) formData.append("reason", reason);
        if (photo) formData.append("photo", photo);

        const token = localStorage.getItem("token");

        try {
            await api.post(`/pets/${petId}/medicines`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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

            <div className="inputField">
                <label htmlFor="medicine-photo">Prescription or receipt photo (optional)</label>
                <input
                    type="file"
                    id="medicine-photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                />
            </div>

            {photoPreview && (
                <img src={photoPreview} alt="Medicine attachment preview" style={{ maxWidth: "100%", marginTop: "12px", borderRadius: "8px" }} />
            )}

            <Button type="submit">Save Medicine</Button>
        </form>
    );
}

export default MedicineForm;