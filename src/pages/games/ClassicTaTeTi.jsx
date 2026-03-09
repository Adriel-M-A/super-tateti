import { useState, useCallback } from 'react';
import Board from '../../components/game/Board';
import PlayerSetup from '../../components/setup/PlayerSetup';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import { CLASSIC_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';
import { DEFAULT_PLAYERS } from '../../constants/playerConfig';

const ClassicTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({
        P1: DEFAULT_PLAYERS[0],
        P2: DEFAULT_PLAYERS[1]
    });
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const handleSetupComplete = (setupData) => {
        setPlayers(setupData.players);
        setCompetitiveMode(setupData.competitiveMode);
        setTurnTime(setupData.turnTime);
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

    // Selecciona una celda vacía al azar y juega como si fuera el jugador activo
    const handleTimeOut = useCallback(() => {
        const emptyCells = board.reduce((acc, cell, idx) => {
            if (cell === null) acc.push(idx);
            return acc;
        }, []);
        if (emptyCells.length === 0) return;
        const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        handleCellClick(randomIdx);
    }, [board, handleCellClick]);

    const playersList = [players.P1, players.P2];
    const currentPlayerIndex = isXNext ? 0 : 1;

    const contextValue = {
        players: playersList,
        currentPlayerIndex,
        scores: { P1: 0, P2: 0 },
        gameStatus: winner ? 'finished' : 'playing',
        gameTitle: "Ta-Te-Ti Clásico",
        rules: CLASSIC_RULES,
        competitiveMode,
        turnTime,
        onTimeOut: competitiveMode ? handleTimeOut : null
    };

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {setupMode ? (
                <PlayerSetup
                    title="Ta-Te-Ti Clásico"
                    onComplete={handleSetupComplete}
                    onBack={onExit}
                    initialPlayers={players}
                    initialCompetitiveMode={competitiveMode}
                    initialTurnTime={turnTime}
                />
            ) : (
                <GameProvider value={contextValue}>
                    <GameLayout
                        onExit={onExit}
                        onReset={resetGame}
                        onConfig={() => setSetupMode(true)}
                        tacticalHint="Objetivo: 3 en línea"
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
                            <div className="w-full aspect-square max-w-md mx-auto">
                                <Board
                                    cells={board}
                                    onCellClick={handleCellClick}
                                    level="super"
                                    isSelectable={!winner}
                                />
                            </div>
                        )}
                    </GameLayout>
                </GameProvider>
            )
            }
        </div >
    );
};

export default ClassicTaTeTi;
