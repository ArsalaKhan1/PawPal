import { useState } from "react";
import Axios from "axios";
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

    async function handleSubmit(event) {
        event.preventDefault();
        const newRecord = {
            visitDate,
            reason,
            vetName,
            clinicName,
            diagnosis,
            followUpNeeded,
            followUpDate,
            cost: cost ? Number(cost) : undefined // convert string -> number, only if provided
        };

        try {
            await Axios.post(`http://localhost:5000/pets/${petId}/vetVisits`, newRecord);
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

            <Button type="submit">Save Vet Visit</Button>
        </form>
    );
}

export default VetVisitForm;