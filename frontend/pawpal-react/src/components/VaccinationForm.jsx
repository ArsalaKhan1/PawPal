import { useState } from "react";
import Axios from "axios";
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

    async function handleSubmit(event) {
        event.preventDefault();
        const newRecord = { vaccineName, dateGiven, nextDueDate, vetName, notes };

        try {
            await Axios.post(`http://localhost:5000/pets/${petId}/vaccinations`, newRecord);
            onAdded(); // tell the parent: "done, go refresh and close me"
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
            <Button type="submit">Save Vaccination</Button>
        </form>
    );
}

export default VaccinationForm;