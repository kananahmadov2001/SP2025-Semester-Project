// react-frontend/src/BasketballField.jsx


function BasketballField({ players = [] }) {
  return (
    <div className="court-container">
      {players.length === 0 ? (
        <p>No starters selected.</p>
      ) : (
        <div className="starter-grid">
          {players.map((p) => (
            <div className="starter-card" key={p.id}>
              <h4>{p.firstname} {p.lastname}</h4>
              <p>Position: {p.position}</p>
              <p>Team: {p.team}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



export default BasketballField;
