/*
  Displays one vaccination record.
  Pure presentational component — receives a "record" object as a prop,
  same idea as your existing PetCard.
*/

function VaccinationCard({ record, onDelete }) {
    return (
        <article className = "healthCard">
            <h3>{record.vaccineName}</h3>
            <dl>
                <dt>Date Given</dt>
                <dd>{new Date(record.dateGiven).toLocaleDateString()}</dd>

                {record.nextDueDate && (
                    <>
                        <dt>Next Due</dt>
                        <dd>{new Date(record.nextDueDate).toLocaleDateString()}</dd>
                    </>
                )}

                {record.vetName && (
                    <>
                        <dt>Vet</dt>
                        <dd>{record.vetName}</dd>
                    </>
                )}

                {record.notes && (
                    <>
                        <dt>Notes</dt>
                        <dd>{record.notes}</dd>
                    </>
                )}
            </dl>

            <button className = "deleteButton" type="button" onClick={() => onDelete(record._id)}>
                Delete
            </button>
        </article>
    );
}
export default VaccinationCard;