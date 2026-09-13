// Computes a reminder status purely from a date — never stored,
// always calculated fresh at render time using today's real date.
// Used by both the per-pet Health page AND the cross-pet
// "Upcoming Vaccinations" page, so the logic only lives in one place.

export function getVaccinationStatus(nextDueDate) {
    if (!nextDueDate) {
        return { label: "No reminder set", level: "none" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // zero-out the time, so we're comparing whole days only

    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    // Subtracting two Date objects gives a difference in milliseconds.
    // Dividing by (1000 * 60 * 60 * 24) converts that into whole days.
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilDue = Math.round((dueDate - today) / msPerDay);

    if (daysUntilDue < 0) {
        return { label: "Overdue", level: "overdue" };
    }
    if (daysUntilDue === 0) {
        return { label: "Due today", level: "due-soon" };
    }
    if (daysUntilDue <= 14) {
        return { label: `Due in ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`, level: "due-soon" };
    }
    return { label: `Upcoming (${dueDate.toLocaleDateString()})`, level: "upcoming" };
}