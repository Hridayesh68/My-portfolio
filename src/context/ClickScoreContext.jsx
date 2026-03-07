import React, { createContext, useState, useEffect } from 'react';

export const ClickScoreContext = createContext();

export const ClickScoreProvider = ({ children }) => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        const handleClick = () => {
            setScore(prev => prev + 10);
        };

        // Add listener capturing phase so it catches all clicks before propagation is stopped
        window.addEventListener('click', handleClick, true);

        return () => {
            window.removeEventListener('click', handleClick, true);
        };
    }, []);

    return (
        <ClickScoreContext.Provider value={{ score, setScore }}>
            {children}
        </ClickScoreContext.Provider>
    );
};
