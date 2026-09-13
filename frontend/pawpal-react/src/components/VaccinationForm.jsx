import { useState } from "react";
import Axios from "axios";
import api from "../utils/api";
import Input from "./Input";
import Button from "./Button";

/*
  Props:
  - petId: which pet this record belongs to
  - onAdded: callback the parent gives us to run after a successful save
             (parent uses this to refetch the list and close the form)
*/
function VaccinationForm({ petId, onAdded }) {
    const [vaccineName, setVaccineName] = useState("");
    const [dateGiven, setDateGiven] = useState("");
    const [nextDueDate, setNextDueDate] = useState("");
    const [vetName, setVetName] = useState("");
    const [notes, setNotes] = useState("");
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
        formData.append("vaccineName", vaccineName);
        formData.append("dateGiven", dateGiven);
        if (nextDueDate) formData.append("nextDueDate", nextDueDate);
        if (vetName) formData.append("vetName", vetName);
        if (notes) formData.append("notes", notes);
        if (photo) formData.append("photo", photo);

        const token = localStorage.getItem("token");

        try {
            await api.post(`/pets/${petId}/vaccinations`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onAdded(); 
        } catch (err) {
            console.error(err);
            alert("Failed to add vaccination record.");
        }
    }

    return (
        <form className = "healthForm" onSubmit={handleSubmit}>
            <Input label="Vaccine Name" value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} required />
            <Input label="Date Given" type="date" value={dateGiven} onChange={(e) => setDateGiven(e.target.value)} required />
            <Input label="Next Due Date" type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} />
            <Input label="Vet Name" value={vetName} onChange={(e) => setVetName(e.target.value)} />
            <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <div className="inputField">
                <label htmlFor="vaccination-photo">Vaccination receipt or proof (optional)</label>
                <input
                    type="file"
                    id="vaccination-photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                />
            </div>

            {photoPreview && (
                <img src={photoPreview} alt="Vaccination attachment preview" style={{ maxWidth: "100%", marginTop: "12px", borderRadius: "8px" }} />
            )}

            <Button type="submit">Save Vaccination</Button>
        </form>
    );
}

export default VaccinationForm;