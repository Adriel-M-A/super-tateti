import { useState } from 'react';
import Board from '../../components/game/Board';
import PlayerSetup from '../../components/setup/PlayerSetup';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import { CLASSIC_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';

const ClassicTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({
        P1: { id: 'P1', name: 'Jugador 1', icon: 'X', color: '#3b82f6' },
        P2: { id: 'P2', name: 'Jugador 2', icon: 'Circle', color: '#ef4444' }
    });

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const handleSetupComplete = (selectedPlayers) => {
        // Adaptar nombres para el layout
        const adaptedPlayers = {
            P1: { ...selectedPlayers.P1, id: 'P1', name: 'Jugador 1' },
            P2: { ...selectedPlayers.P2, id: 'P2', name: 'Jugador 2' }
        };
        setPlayers(adaptedPlayers);
        setSetupMode(false);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    const checkWinner = (cells) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
        }
        if (cells.every(cell => cell !== null)) return 'DRAW';
        return null;
    };

    const handleCellClick = (index) => {
        if (winner || board[index]) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';

        const win = checkWinner(newBoard);
        if (win) setWinner(win);

        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const playersList = [players.P1, players.P2];
    const currentPlayerIndex = isXNext ? 0 : 1;

    const contextValue = {
        players: playersList,
        currentPlayerIndex,
        scores: {}, // El clásico de momento no guarda scores acumulados entre partidas
        gameStatus: winner ? 'finished' : 'playing',
        gameTitle: "Ta-Te-Ti Clásico",
        rules: CLASSIC_RULES
    };

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {setupMode ? (
                <PlayerSetup title="Ta-Te-Ti Clásico" onComplete={handleSetupComplete} />
            ) : (
                <GameProvider value={contextValue}>
                    <GameLayout
                        onExit={onExit}
                        onReset={resetGame}
                    >
                        {winner ? (
                            <GameResult
                                winners={winner === 'DRAW' ? playersList : [winner === 'X' ? players.P1 : players.P2]}
                                isDraw={winner === 'DRAW'}
                                onReplay={resetGame}
                                onSetup={() => {
                                    resetGame();
                                    setSetupMode(true);
                                }}
                            />
                        ) : (
                            <div className="w-full max-w-md mx-auto aspect-square">
                                <Board
                                    cells={board}
                                    onCellClick={handleCellClick}
                                    level="super"
                                    isSelectable={!winner}
                                    playersConfig={players}
                                    currentPlayerSymbol={isXNext ? 'X' : 'O'}
                                />
                            </div>
                        )}
                    </GameLayout>
                </GameProvider>
            )}
        </div>
    );
};

export default ClassicTaTeTi;
