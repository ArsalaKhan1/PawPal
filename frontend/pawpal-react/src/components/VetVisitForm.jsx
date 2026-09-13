import { useState } from "react";
import Axios from "axios";
import api from "../utils/api";
import Input from "./Input";
import Button from "./Button";

function VetVisitForm({ petId, onAdded }) {
    const [visitDate, setVisitDate] = useState("");
    const [reason, setReason] = useState("");
    const [vetName, setVetName] = useState("");
    const [clinicName, setClinicName] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [followUpNeeded, setFollowUpNeeded] = useState(false);
    const [followUpDate, setFollowUpDate] = useState("");
    const [cost, setCost] = useState("");
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
        formData.append("visitDate", visitDate);
        formData.append("reason", reason);
        if (vetName) formData.append("vetName", vetName);
        if (clinicName) formData.append("clinicName", clinicName);
        if (diagnosis) formData.append("diagnosis", diagnosis);
        formData.append("followUpNeeded", String(followUpNeeded));
        if (followUpNeeded && followUpDate) formData.append("followUpDate", followUpDate);
        if (cost) formData.append("cost", String(Number(cost)));
        if (photo) formData.append("photo", photo);

        const token = localStorage.getItem("token");

        try {
            await api.post(`/pets/${petId}/vetVisits`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onAdded();
        } catch (err) {
            console.error(err);
            alert("Failed to add vet visit record.");
        }
    }

    return (
        <form className = "healthForm" onSubmit={handleSubmit}>
            <Input label="Visit Date" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required />
            <Input label="Reason for Visit" value={reason} onChange={(e) => setReason(e.target.value)} required />
            <Input label="Vet Name" value={vetName} onChange={(e) => setVetName(e.target.value)} />
            <Input label="Clinic Name" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
            <Input label="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />

            <div>
                <input
                    type="checkbox"
                    id="follow-up-needed"
                    checked={followUpNeeded}
                    onChange={(e) => setFollowUpNeeded(e.target.checked)}
                />
                <label htmlFor="follow-up-needed">Follow-up needed?</label>
            </div>

            {followUpNeeded && (
                <Input label="Follow-up Date" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            )}

            <Input label="Cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />

            <div className="inputField">
                <label htmlFor="vet-visit-photo">Invoice or receipt photo (optional)</label>
                <input
                    type="file"
                    id="vet-visit-photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                />
            </div>

            {photoPreview && (
                <img src={photoPreview} alt="Vet visit attachment preview" style={{ maxWidth: "100%", marginTop: "12px", borderRadius: "8px" }} />
            )}

            <Button type="submit">Save Vet Visit</Button>
        </form>
    );
}

export default VetVisitForm;