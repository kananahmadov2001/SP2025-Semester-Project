// src/utils/utils.js

/**
 * Returns "back" if position contains "g"; otherwise returns "front".
 * @param {string} position - The player's position.
 * @returns {string} The court type.
 */
export function getCourtType(position) {
    // Convert to lowercase just in case
    const pos = position.toLowerCase();

    // Rule: if the position string contains 'g', 
    // we classify the player as back court.
    if (pos.includes("g")) {
        return "back";
    }
    // Otherwise, treat everything else (F, C, etc.) as front court
    return "front";
}
