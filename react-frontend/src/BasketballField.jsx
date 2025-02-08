import './home_page.css';

import lebronImg from './assets/lebron.avif';
import stephImg from './assets/steph-curry.jpg';
import durantImg from './assets/kevin-durant.jpg';

function BasketballField() {
  const players = [
    { name: "LeBron James", team: "Lakers", score: 99, image: lebronImg, position: "center-left" },
    { name: "Stephen Curry", team: "Warriors", score: 98, image: stephImg, position: "center" },
    { name: "Kevin Durant", team: "Suns", score: 95, image: durantImg, position: "center-right" },
  ];

  return (
    <div className="basketball-field">
      <div className="court">
        {players.map((player) => (
          <div key={player.name} className={`player-card ${player.position}`}>
            <img src={player.image} alt={player.name} className="player-image" />
            <div className="player-info">
              <h3>{player.name}</h3>
              <p>Team: {player.team}</p>
              <p>Score: {player.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BasketballField;
