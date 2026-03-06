import { createContext, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children, value }) => {
    return (
        <GameContext.Provider value={value}>
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
