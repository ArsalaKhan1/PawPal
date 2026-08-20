function MedicineCard({ record, onDelete }) {
    const isOngoing = !record.endDate;

    return (
        <article className = "healthCard">
            <h3>{record.medicineName}</h3>
            <dl>
                <dt>Dosage</dt>
                <dd>{record.dosage}</dd>

                <dt>Frequency</dt>
                <dd>{record.frequency}</dd>

                <dt>Start Date</dt>
                <dd>{new Date(record.startDate).toLocaleDateString()}</dd>

                <dt>Status</dt>
                <dd>{isOngoing ? "Ongoing" : `Ended ${new Date(record.endDate).toLocaleDateString()}`}</dd>

                {record.reason && (
                    <>
                        <dt>Reason</dt>
                        <dd>{record.reason}</dd>
                    </>
                )}
            </dl>

            <button className = "deleteButton"type="button" onClick={() => onDelete(record._id)}>
                Delete
            </button>
        </article>
    );
}

export default MedicineCard;