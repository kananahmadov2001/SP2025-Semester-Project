// react-frontend/src/components/SquadSelection.jsx

import React, { useState } from "react";
import "./SquadSelection.css"; // Import your CSS for styling

function SquadSelection() {
    // State to track how many players have been selected and the money remaining
    const [selectedPlayersCount, setSelectedPlayersCount] = useState(0);
    const [moneyRemaining, setMoneyRemaining] = useState(100.0);

    // State to toggle between "court" and "list" view
    const [viewType, setViewType] = useState("court");

    return (
        <div className="squad-selection-container">
            {/* Header section: Players Selected & Money Remaining */}
            <div className="squad-header">
                <span className="players-selected">
                    Players Selected: {selectedPlayersCount} / 10
                </span>
                <span className="money-remaining">
                    Money Remaining: {moneyRemaining.toFixed(1)}
                </span>
            </div>

            {/* View Toggle Buttons */}
            <div className="view-toggle-container">
                <button
                    className={`toggle-btn ${viewType === "court" ? "active" : ""}`}
                    onClick={() => setViewType("court")}
                >
                    Court View
                </button>
                <button
                    className={`toggle-btn ${viewType === "list" ? "active" : ""}`}
                    onClick={() => setViewType("list")}
                >
                    List View
                </button>
            </div>

            {/* Render Court View or List View */}
            {viewType === "court" ? (
                <div className="court-view">
                    {/* Front Court */}
                    <div className="front-court">
                        <h3>Front Court</h3>
                        <div className="fc-row">
                            <div className="fc-slot">Add FC</div>
                            <div className="fc-slot">Add FC</div>
                            <div className="fc-slot">Add FC</div>
                        </div>
                        <div className="fc-row">
                            <div className="fc-slot">Add FC</div>
                            <div className="fc-slot">Add FC</div>
                        </div>
                    </div>

                    {/* Back Court */}
                    <div className="back-court">
                        <h3>Back Court</h3>
                        <div className="bc-row">
                            <div className="bc-slot">Add BC</div>
                            <div className="bc-slot">Add BC</div>
                            <div className="bc-slot">Add BC</div>
                        </div>
                        <div className="bc-row">
                            <div className="bc-slot">Add BC</div>
                            <div className="bc-slot">Add BC</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="list-view">
                    {/* Front Court in List View */}
                    <div className="front-court-list">
                        <h3>Front Court</h3>
                        {[...Array(5)].map((_, i) => (
                            <div key={`fc-list-${i}`} className="fc-slot-list">
                                Select Front Court Player
                            </div>
                        ))}
                    </div>

                    {/* Back Court in List View */}
                    <div className="back-court-list">
                        <h3>Back Court</h3>
                        {[...Array(5)].map((_, i) => (
                            <div key={`bc-list-${i}`} className="bc-slot-list">
                                Select Back Court Player
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SquadSelection;
