import { createContext, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children, value }) => {
    // Aseguramos valores por defecto para el modo competitivo si no vienen en value
    const contextValue = {
        competitiveMode: false,
        turnTime: 0,
        onTimeOut: null,
        timerResetTrigger: 0,
        ...value
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame debe usarse dentro de un GameProvider');
    }
    return context;
};

export default GameContext;
