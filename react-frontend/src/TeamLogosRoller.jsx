// react-frontend/src/TeamLogosRoller.jsx
import React, { useRef, useState, useEffect } from "react";
import './HomePage.css';

const teamLogoImports = import.meta.glob("./assets/team/*.svg", { eager: true });
const slowSpeed = 10;  // The scroll speed = 10 px/s
const normalSpeed = 30;  // The scroll speed = 30 px/s

function TeamLogosRoller() {
    const [speed, setSpeed] = useState(normalSpeed);

    const [teamLogos, setTeamLogos] = useState([]);

    const [totalWidth, setTotalWidth] = useState(0);

    const offsetRef = useRef(0);  // Current horizontal offset for the scrolling
    const scrollingRowRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const lastFrameTimeRef = useRef(0);  // Used for the time-delta calculation

    useEffect(() => {
        const loadedLogos = Object.values(teamLogoImports).map(mod => mod.default);
        setTeamLogos(loadedLogos);
    }, []);

    useEffect(() => {
        if (!scrollingRowRef.current) return;

        requestAnimationFrame(() => {
            // scrollWidth gives the total width of all images side by side
            setTotalWidth(scrollingRowRef.current.scrollWidth);
        });
    }, [teamLogos]);

    /**
     * Main animation loop using requestAnimationFrame for smooth scrolling.
     */
    useEffect(() => {
        function animate(currentTime) {
            if (!lastFrameTimeRef.current) {
                lastFrameTimeRef.current = currentTime;
            }

            // Calculate time (in seconds) since last frame
            const delta = (currentTime - lastFrameTimeRef.current) / 1000;
            lastFrameTimeRef.current = currentTime;

            // Move offset by speed * delta
            offsetRef.current += speed * delta;

            // Reset offset to 0 for a seamless loop.
            if (offsetRef.current > totalWidth / 2) {
                offsetRef.current = 0;
            }

            // Apply transform to scrolling row
            if (scrollingRowRef.current) {
                scrollingRowRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
            }

            // Loop
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }

        // Start animation
        animationFrameIdRef.current = requestAnimationFrame(animate);

        // Clean up on unmount
        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
        };
    }, [speed, totalWidth]);

    const handleMouseEnter = () => setSpeed(slowSpeed);  // Slow speed on hover
    const handleMouseLeave = () => setSpeed(normalSpeed);  // Normal speed

    return (
        <div
            className="team-logos-roller"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="team-logos-scrolling-row" ref={scrollingRowRef}>
                {/* FIRST set of logos */}
                {teamLogos.map((logo, index) => (
                    <img
                        key={`logo-first-${index}`}
                        src={logo}
                        alt={`Team logo ${index}`}
                        className="team-logo-image"
                    />
                ))}
                {/* SECOND set of logos (duplicate) for seamless looping */}
                {teamLogos.map((logo, index) => (
                    <img
                        key={`logo-second-${index}`}
                        src={logo}
                        alt={`Team logo duplicate ${index}`}
                        className="team-logo-image"
                    />
                ))}
            </div>
        </div>
    );
}

export default TeamLogosRoller;
