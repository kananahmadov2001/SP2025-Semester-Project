const getPlayerImage = (team) => {
    switch (team) {
        case "Los Angeles Lakers":
            return "https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg";
        case "Golden State Warriors":
            return "https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg";
        case "Miami Heat":
            return "https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg";
        case "Boston Celtics":
            return "https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg";
        case "Brooklyn Nets":
            return "https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg";
        case "Dallas Mavericks":
            return "https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg";
        case "Philadelphia 76ers":
            return "https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg";
        case "Denver Nuggets":
            return "https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg";
        case "Phoenix Suns":
            return "https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg";
        case "New York Knicks":
            return "https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg";
        case "LA Clippers":
            return "https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg";
        case "Toronto Raptors":
            return "https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg";
        case "Milwaukee Bucks":
            return "https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg";
        case "Atlanta Hawks":
            return "https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg";
        case "Chicago Bulls":
            return "https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg";
        case "New Orleans Pelicans":
            return "https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg";
        case "Utah Jazz":
            return "https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg";
        case "Orlando Magic":
            return "https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg";
        case "Portland Trail Blazers":
            return "https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg";
        case "Indiana Pacers":
            return "https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg";
        case "Charlotte Hornets":
            return "https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg";
        case "Minnesota Timberwolves":
            return "https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg";
        case "Oklahoma City Thunder":
            return "https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg";
        case "Sacramento Kings":
            return "https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg";
        case "Washington Wizards":
            return "https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg";
        case "Detroit Pistons":
            return "https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg";
        case "Houston Rockets":
            return "https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg";
        case "Brooklyn Nets":
            return "https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg";
        case "Memphis Grizzlies":
            return "https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg";
        case "New Jersey Nets":
            return "https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg";
        case "New York Knicks":
            return "https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg";
        case "Toronto Raptors":
            return "https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg";
        case "Atlanta Hawks":
            return "https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg";
        case "Chicago Bulls":
            return "https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg";
        case "Cleveland Cavaliers":
            return "https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg";
        case "San Antonio Spurs":
            return "https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg";
        default:
            return defaultPlayerImg; // Fallback image
    }
};

export default getPlayerImage;