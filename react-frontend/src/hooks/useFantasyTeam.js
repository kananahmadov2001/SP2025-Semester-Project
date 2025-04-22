// react-frontend/src/hooks/useFantasyTeam.js
import { useState, useEffect } from "react";

/**
 * Fetches starters and bench players for a given userId.
 * Returns { starters, bench, loading, error }.
 */
export default function useFantasyTeam(userId) {
    const [starters, setStarters] = useState([]);
    const [bench, setBench] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;          // Nothing to do if not logged in
        let isMounted = true;         // So we can safely abort on unmount
        setLoading(true);
        setError("");

        fetch(
            `http://localhost:3000/api/fantasy/team?userId=${userId}&t=${Date.now()}`,
            { credentials: "include" }
        )
            .then((r) => r.json().then((data) => [r.ok, data]))
            .then(([ok, data]) => {
                if (!isMounted) return;
                if (!ok) throw new Error(data.error || "Failed to fetch team");

                const startersNormalized = (data.starters || []).map((p) => ({
                    ...p,
                    position: p.real_position, // keep existing helpers working
                }));
                setStarters(startersNormalized);
                setBench(data.bench || []);
            })
            .catch((err) => isMounted && setError(err.message))
            .finally(() => isMounted && setLoading(false));

        return () => {
            isMounted = false;          // Abort pending updates
        };
    }, [userId]);

    return { starters, bench, loading, error };
}
