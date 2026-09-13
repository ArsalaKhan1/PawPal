import { useEffect, useMemo, useState } from "react";
import Axios from "axios";
import api from "../utils/api";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { getVaccinationStatus } from "../utils/VaccinationStatus";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

function formatMonthKey(dateValue) {
    const date = new Date(dateValue);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(dateValue) {
    return new Date(dateValue).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric"
    });
}

function buildMonthRange(entries) {
    if (entries.length === 0) {
        return [];
    }

    const sortedEntries = [...entries].sort((left, right) => new Date(left.recordedAt) - new Date(right.recordedAt));
    const firstDate = new Date(sortedEntries[0].recordedAt);
    const lastDate = new Date(sortedEntries[sortedEntries.length - 1].recordedAt);
    const months = [];

    const current = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    const lastMonth = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);

    while (current <= lastMonth) {
        months.push({
            key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
            label: current.toLocaleDateString(undefined, { month: "short", year: "numeric" })
        });
        current.setMonth(current.getMonth() + 1);
    }

    return months;
}

function buildWeightChartData(entries) {
    const orderedEntries = [...entries].sort(
        (left, right) => new Date(left.recordedAt) - new Date(right.recordedAt)
    );

    const months = buildMonthRange(orderedEntries);
    const monthKeys = months.map((month) => month.key);
    const labels = months.map((month) => month.label);

    const petSeries = new Map();
    orderedEntries.forEach((entry) => {
        const petId = entry.pet?._id || entry.pet;
        const petName = entry.pet ? `${entry.pet.name} (${entry.pet.animal})` : "Unknown pet";
        const monthKey = formatMonthKey(entry.recordedAt);
        const recordedAt = new Date(entry.recordedAt).getTime();

        if (!petSeries.has(petId)) {
            petSeries.set(petId, { label: petName, points: new Map() });
        }

        const series = petSeries.get(petId);
        const existingPoint = series.points.get(monthKey);

        if (!existingPoint || recordedAt > existingPoint.recordedAt) {
            series.points.set(monthKey, { value: Number(entry.weight), recordedAt });
        }
    });

    const colors = ["#13737A", "#fbb04e", "#6b7280", "#b7791f", "#8b5cf6", "#c0392b", "#16a085"];

    return {
        labels,
        datasets: [...petSeries.values()].map((series, index) => ({
            label: series.label,
            data: monthKeys.map((key) => (series.points.has(key) ? series.points.get(key).value : null)),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length],
            tension: 0.3,
            spanGaps: true,
            pointRadius: 4,
            pointHoverRadius: 6,
        }))
    };
}

function buildVaccinationChartData(records, petId) {
    const filteredRecords = records.filter((record) => String(record.pet?._id || record.pet) === String(petId));

    const counts = {
        overdue: 0,
        upcoming: 0,
        onTrack: 0,
    };

    filteredRecords.forEach((record) => {
        const status = getVaccinationStatus(record.nextDueDate);

        if (status.level === "overdue") {
            counts.overdue += 1;
        } else if (status.level === "due-soon" || status.level === "upcoming") {
            counts.upcoming += 1;
        } else {
            counts.onTrack += 1;
        }
    });

    if (filteredRecords.length === 0 || (counts.overdue === 0 && counts.upcoming === 0 && counts.onTrack === 0)) {
        counts.onTrack = 1;
    }

    const hasStatusBreakdown = counts.overdue > 0 || counts.upcoming > 0;

    return {
        labels: hasStatusBreakdown ? ["Overdue", "Upcoming", "On schedule"] : ["On schedule"],
        datasets: [
            {
                data: hasStatusBreakdown
                    ? [counts.overdue, counts.upcoming, counts.onTrack]
                    : [1],
                backgroundColor: hasStatusBreakdown
                    ? ["#c0392b", "#fbb04e", "#2e7d32"]
                    : ["#2e7d32"],
                borderWidth: 0,
            }
        ]
    };
}

function normalizeVaccinationTone(level) {
    if (level === "overdue") {
        return "overdue";
    }

    if (level === "none") {
        return "none";
    }

    return "upcoming";
}

function buildVetVisitChartData(seriesEntry) {
    const colors = ["#13737A", "#fbb04e", "#6b7280", "#b7791f", "#8b5cf6", "#c0392b", "#16a085"];

    return {
        labels: seriesEntry.labels,
        datasets: seriesEntry.series.map((entry, index) => ({
            label: `${entry.pet.name} (${entry.pet.animal})`,
            data: entry.counts,
            backgroundColor: colors[index % colors.length],
            borderRadius: 8,
        }))
    };
}

function Profile() {
    const [pets, setPets] = useState([]);
    const [weightEntries, setWeightEntries] = useState([]);
    const [upcomingVaccinations, setUpcomingVaccinations] = useState([]);
    const [monthlyVetVisits, setMonthlyVetVisits] = useState({ labels: [], series: [] });
    const [selectedPetId, setSelectedPetId] = useState("");
    const [vaccinationViewPetId, setVaccinationViewPetId] = useState("");
    const [weightValue, setWeightValue] = useState("");
    const [weightDate, setWeightDate] = useState(new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(true);
    const [remindersLoading, setRemindersLoading] = useState(true);

    useEffect(() => {
        async function fetchPets() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const response = await api.get("/pets", { headers });
                setPets(response.data);
                setSelectedPetId((currentPetId) => currentPetId || response.data[0]?._id || "");
                setVaccinationViewPetId((currentViewPetId) => currentViewPetId || response.data[0]?._id || "");
            } catch (err) {
                console.error(err);
            }
        }

        async function fetchWeightAnalytics() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const response = await api.get("/analytics/weight-history", { headers });

                setWeightEntries(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPets();
        fetchWeightAnalytics();
        // This page is a dashboard view, so we only need the initial snapshot.
    }, []);

    useEffect(() => {
        async function fetchMonthlyVetVisits() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const response = await api.get("/analytics/monthly-vet-visits", {
                    headers
                });

                setMonthlyVetVisits(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchMonthlyVetVisits();
    }, []);

    useEffect(() => {
        async function fetchUpcomingVaccinations() {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const response = await api.get("/vaccinations/upcoming", { headers });
                setUpcomingVaccinations(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setRemindersLoading(false);
            }
        }

        void fetchUpcomingVaccinations();
    }, []);

    const weightChartData = useMemo(() => buildWeightChartData(weightEntries), [weightEntries]);
    const vaccinationChartData = useMemo(
        () => buildVaccinationChartData(upcomingVaccinations, vaccinationViewPetId),
        [upcomingVaccinations, vaccinationViewPetId]
    );
    const vetVisitSeries = Array.isArray(monthlyVetVisits.series) ? monthlyVetVisits.series : [];
    const vetVisitChartData = useMemo(() => {
        return buildVetVisitChartData({
            labels: monthlyVetVisits.labels,
            series: vetVisitSeries
        });
    }, [monthlyVetVisits.labels, vetVisitSeries]);

    async function handleWeightSubmit(event) {
        event.preventDefault();

        if (!selectedPetId || !weightValue) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            await api.post(
                "/analytics/weight-history",
                { petId: selectedPetId, weight: weightValue, recordedAt: weightDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await api.get("/analytics/weight-history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeightEntries(response.data);
            setWeightValue("");
            setWeightDate(new Date().toISOString().slice(0, 10));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to log weight.");
        }
    }

    return (
        <>
            <Navbar />
            <main className="analyticsPage">
                <h2 className="pageHeading">Profile Analytics</h2>
                <p className="analyticsIntro">
                    This page turns your pet records into charts. The weight chart uses a separate history log, so every new entry becomes another point on the monthly line graph.
                </p>

                <section className="analyticsCard analyticsCard--wide">
                    <div className="analyticsCardHeader">
                        <div>
                            <h3>Log a weight update</h3>
                            <p>Add a new snapshot whenever you weigh a pet. That creates the history the line chart uses.</p>
                        </div>
                    </div>

                    <form className="weightLogger" onSubmit={handleWeightSubmit}>
                        <div className="weightLoggerFields">
                            <div className="inputField">
                                <label htmlFor="weight-pet">Pet</label>
                                <select
                                    id="weight-pet"
                                    value={selectedPetId}
                                    onChange={(event) => setSelectedPetId(event.target.value)}
                                    required
                                >
                                    <option value="">Select a pet</option>
                                    {pets.map((pet) => (
                                        <option key={pet._id} value={pet._id}>
                                            {pet.name} ({pet.animal})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Weight"
                                type="number"
                                value={weightValue}
                                onChange={(event) => setWeightValue(event.target.value)}
                                required
                            />

                            <Input
                                label="Date"
                                type="date"
                                value={weightDate}
                                onChange={(event) => setWeightDate(event.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit">Save Weight</Button>
                    </form>
                </section>

                <section className="analyticsCard analyticsCard--wide">
                    <div className="analyticsCardHeader">
                        <div>
                            <h3>Vaccination Reminders</h3>
                            <p>This view shows overdue vaccinations in red and upcoming vaccinations in orange, pet by pet.</p>
                        </div>
                    </div>

                    {remindersLoading ? (
                        <p className="emptyMessage">Loading vaccination reminders...</p>
                    ) : upcomingVaccinations.length === 0 ? (
                        <p className="emptyMessage">No vaccination reminders — you're all caught up!</p>
                    ) : (
                        <div className="reminderList">
                            {upcomingVaccinations.map((record) => {
                                const status = getVaccinationStatus(record.nextDueDate);
                                const tone = normalizeVaccinationTone(status.level);
                                const petLabel = record.pet ? `${record.pet.name} (${record.pet.animal})` : "Unknown pet";
                                const petLink = record.pet ? `/pets/${record.pet._id}/health` : "/dashboard";

                                return (
                                    <article key={record._id} className={`reminderCard reminderCard--${tone}`}>
                                        <div className="reminderCardMain">
                                            <h3>{record.vaccineName}</h3>
                                            <p>
                                                <Link to={petLink}>{petLabel}</Link>
                                            </p>
                                        </div>
                                        <span className={`statusBadge statusBadge--${tone}`}>
                                            {status.label}
                                        </span>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {loading ? (
                    <p className="emptyMessage">Loading analytics...</p>
                ) : (
                    <div className="analyticsGrid">
                        <section className="analyticsCard analyticsCard--wide">
                            <div className="analyticsCardHeader">
                                <div>
                                    <h3>Weight History</h3>
                                    <p>Each pet gets its own line. The legend shows which color belongs to which pet.</p>
                                </div>
                            </div>
                            {weightEntries.length === 0 ? (
                                <p className="emptyMessage">No weight history yet. Add the first entry above.</p>
                            ) : (
                                <div className="chartWrap chartWrap--large">
                                    <Line
                                        data={weightChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: "bottom" }
                                            },
                                            scales: {
                                                x: {
                                                    ticks: {
                                                        maxRotation: 45,
                                                        minRotation: 45
                                                    }
                                                },
                                                y: {
                                                    beginAtZero: false,
                                                    ticks: { precision: 0 }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </section>

                        <section className="analyticsCard">
                            <div className="analyticsCardHeader">
                                <div>
                                    <h3>Vaccination Progress</h3>
                                    <p>Pick one pet. Overdue vaccinations are red, upcoming ones are orange, and pets with nothing due show a full green ring.</p>
                                </div>
                            </div>

                            <div className="inputField">
                                <label htmlFor="vaccination-view-pet">Vaccination view</label>
                                <select
                                    id="vaccination-view-pet"
                                    value={vaccinationViewPetId}
                                    onChange={(event) => setVaccinationViewPetId(event.target.value)}
                                    required
                                >
                                    {pets.map((pet) => (
                                        <option key={pet._id} value={pet._id}>
                                            {pet.name} ({pet.animal})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {vaccinationViewPetId ? null : (
                                <p className="emptyMessage">Select a pet to see its vaccination progress.</p>
                            )}

                            {!vaccinationViewPetId ? (
                                <p className="emptyMessage">No vaccination records yet.</p>
                            ) : (
                                <div className="chartWrap">
                                    <Doughnut
                                        data={vaccinationChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: "bottom" }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </section>

                        <section className="analyticsCard">
                            <div className="analyticsCardHeader">
                                <div>
                                    <h3>Monthly Vet Visits</h3>
                                    <p>Each pet gets its own color so you can compare their rolling 12-month visit history at a glance.</p>
                                </div>
                            </div>
                            {vetVisitSeries.length === 0 ? (
                                <p className="emptyMessage">No vet visit records yet.</p>
                            ) : (
                                <div className="chartWrap chartWrap--compact">
                                    <Bar
                                        data={vetVisitChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: "bottom" }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: { precision: 0 }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </main>
        </>
    );
}

export default Profile;
