import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import api from "../utils/api";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";

import VaccinationCard from "../components/VaccinationCard";
import MedicineCard from "../components/MedicineCard";
import VetVisitCard from "../components/VetVisitCard";

import VaccinationForm from "../components/VaccinationForm";
import MedicineForm from "../components/MedicineForm";
import VetVisitForm from "../components/VetVisitForm";

const TAB_CONFIG = {
    vaccinations: {
        label: "Vaccinations",
        endpoint: "vaccinations",
        CardComponent: VaccinationCard,
        FormComponent: VaccinationForm,
        emptyMessage: "No vaccination records yet."
    },
    medicines: {
        label: "Medicines",
        endpoint: "medicines",
        CardComponent: MedicineCard,
        FormComponent: MedicineForm,
        emptyMessage: "No medicine records yet."
    },
    vetVisits: {
        label: "Vet Visits",
        endpoint: "vetVisits",
        CardComponent: VetVisitCard,
        FormComponent: VetVisitForm,
        emptyMessage: "No vet visit records yet."
    }
};

const TABS = [
    { key: "vaccinations", label: "Vaccinations" },
    { key: "medicines", label: "Medicines" },
    { key: "vetVisits", label: "Vet Visits" }
];

function PetHealth() {
    const { petId } = useParams();

    const [activeTab, setActiveTab] = useState("vaccinations");
    const [showAddForm, setShowAddForm] = useState(false);

    // One array per record type. Keeping them separate (rather than one
    // "records" array with a type field) matches how they're stored and
    // fetched on the backend — three different collections.
    const [vaccinations, setVaccinations] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [vetVisits, setVetVisits] = useState([]);

    // Groups the three state arrays behind the same keys as TAB_CONFIG,
    // so we can look up "the current tab's data" generically below.
    const dataByTab = {
        vaccinations,
        medicines,
        vetVisits
    };

    const setterByTab = {
        vaccinations: setVaccinations,
        medicines: setMedicines,
        vetVisits: setVetVisits
    };

    // Fetches ONE record type and stores it via the matching setter.
    async function fetchRecords(tabKey) {
        const { endpoint } = TAB_CONFIG[tabKey];
        const token = localStorage.getItem("token");

        try {
            const response = await api.get(`/pets/${petId}/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setterByTab[tabKey](response.data);
        } catch (err) {
            console.error(err);
        }
    }

    // On first load, fetch all three record types at once — so switching
    // tabs afterwards is instant (no fetch delay), it just shows data
    // that's already in state.
    useEffect(() => {
        fetchRecords("vaccinations");
        fetchRecords("medicines");
        fetchRecords("vetVisits");
    }, [petId]);

    async function handleDelete(tabKey, recordId) {
        const { endpoint } = TAB_CONFIG[tabKey];
        const token = localStorage.getItem("token");

        try {
            await api.delete(`/pets/${petId}/${endpoint}/${recordId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchRecords(tabKey); // refresh just this tab's list
        } catch (err) {
            console.error(err);
            alert("Failed to delete record.");
        }
    }

    function handleTabChange(tabKey) {
        setActiveTab(tabKey);
        setShowAddForm(false); // closing the form when switching tabs avoids a stale form sitting under the wrong tab
    }

    function handleRecordAdded() {
        fetchRecords(activeTab); // re-fetch so the new record appears in the list
        setShowAddForm(false);   // close the form now that it's saved
    }

    const currentConfig = TAB_CONFIG[activeTab];
    const currentRecords = dataByTab[activeTab];
    const CurrentCard = currentConfig.CardComponent;
    const CurrentForm = currentConfig.FormComponent;

    return (
        <>
            <Navbar />
            <main className = "healthPage">
                <h2 className = "pageHeading">Health Records</h2>

                <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

                <section className = "recordsSection" aria-labelledby="records-heading">
                    <h3 id="records-heading">{currentConfig.label}</h3>

                    <Button className = "simpleButton" type="button" onClick={() => setShowAddForm((prev) => !prev)}>
                        {showAddForm ? "Cancel" : `Add ${currentConfig.label.slice(0, -1)}`}
                    </Button>

                    {showAddForm && (
                        <CurrentForm petId={petId} onAdded={handleRecordAdded} />
                    )}

                    {currentRecords.length === 0 ? (
                        <p className = "emptyMessage" >{currentConfig.emptyMessage}</p>
                    ) : (
                        
                        <div className="healthRecordsGrid">
                            {currentRecords.map((record) => (
                                <CurrentCard
                                    key={record._id}
                                    record={record}
                                    onDelete={(id) => handleDelete(activeTab, id)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

export default PetHealth;