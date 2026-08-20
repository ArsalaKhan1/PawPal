function VetVisitCard({ record, onDelete }) {
    return (
        <article className = "healthCard">
            <h3>{record.reason}</h3>
            <dl>
                <dt>Visit Date</dt>
                <dd>{new Date(record.visitDate).toLocaleDateString()}</dd>

                {record.clinicName && (
                    <>
                        <dt>Clinic</dt>
                        <dd>{record.clinicName}</dd>
                    </>
                )}

                {record.vetName && (
                    <>
                        <dt>Vet</dt>
                        <dd>{record.vetName}</dd>
                    </>
                )}

                {record.diagnosis && (
                    <>
                        <dt>Diagnosis</dt>
                        <dd>{record.diagnosis}</dd>
                    </>
                )}

                {record.followUpNeeded && (
                    <>
                        <dt>Follow-up Needed</dt>
                        <dd>{record.followUpDate ? new Date(record.followUpDate).toLocaleDateString() : "Yes"}</dd>
                    </>
                )}

                {typeof record.cost === "number" && (
                    <>
                        <dt>Cost</dt>
                        <dd>{record.cost}</dd>
                    </>
                )}
            </dl>

            <button className = "deleteButton" type="button" onClick={() => onDelete(record._id)}>
                Delete
            </button>
        </article>
    );
}

export default VetVisitCard;