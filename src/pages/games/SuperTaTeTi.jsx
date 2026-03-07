import { useState } from 'react';
import Board from '../../components/game/Board';
import PlayerSetup from '../../components/setup/PlayerSetup';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import { CLASSIC_RULES, SUPER_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';

const SuperTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({
        P1: { id: 'P1', name: 'Jugador 1', icon: 'X', color: '#3b82f6' },
        P2: { id: 'P2', name: 'Jugador 2', icon: 'Circle', color: '#ef4444' }
    });
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);

    const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
    const [isXNext, setIsXNext] = useState(true);
    const [activeSubBoard, setActiveSubBoard] = useState(null);
    const [subBoardWinners, setSubBoardWinners] = useState(Array(9).fill(null));
    const [globalWinner, setGlobalWinner] = useState(null);

    const handleSetupComplete = (setupData) => {
        setPlayers(setupData.players);
        setCompetitiveMode(setupData.competitiveMode);
        setTurnTime(setupData.turnTime);
        setSetupMode(false);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
        setIsXNext(true);
        setActiveSubBoard(null);
        setSubBoardWinners(Array(9).fill(null));
        setGlobalWinner(null);
    };

    const checkWinner = (cells) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (cells[a] && cells[a] !== 'DRAW' && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];

            const xLine = [a, b, c].every(idx => cells[idx] === 'X' || cells[idx] === 'DRAW');
            const hasX = [a, b, c].some(idx => cells[idx] === 'X');
            if (xLine && hasX) return 'X';

            const oLine = [a, b, c].every(idx => cells[idx] === 'O' || cells[idx] === 'DRAW');
            const hasO = [a, b, c].some(idx => cells[idx] === 'O');
            if (oLine && hasO) return 'O';
        }
        return null;
    };

    const handleCellClick = (boardIndex, cellIndex) => {
        if (globalWinner || (activeSubBoard !== null && activeSubBoard !== boardIndex) || subBoardWinners[boardIndex] || board[boardIndex][cellIndex]) return;

        const newBoard = board.map((subBoard, bIdx) => {
            if (bIdx === boardIndex) {
                const newSubBoard = [...subBoard];
                newSubBoard[cellIndex] = isXNext ? 'X' : 'O';
                return newSubBoard;
            }
            return subBoard;
        });

        const newSubBoardWinners = [...subBoardWinners];
        const winner = checkWinner(newBoard[boardIndex]);
        if (winner) newSubBoardWinners[boardIndex] = winner;
        else if (newBoard[boardIndex].every(cell => cell !== null)) newSubBoardWinners[boardIndex] = 'DRAW';

        const finalWinner = checkWinner(newSubBoardWinners);
        if (finalWinner) setGlobalWinner(finalWinner);

        let nextActiveSubBoard = cellIndex;
        if (newSubBoardWinners[nextActiveSubBoard]) nextActiveSubBoard = null;

        setBoard(newBoard);
        setSubBoardWinners(newSubBoardWinners);
        setIsXNext(!isXNext);
        setActiveSubBoard(nextActiveSubBoard);
    };

    const playersList = [players.P1, players.P2];
    const currentPlayerIndex = isXNext ? 0 : 1;

    const contextValue = {
        players: playersList,
        currentPlayerIndex,
        scores: { P1: 0, P2: 0 },
        gameStatus: globalWinner ? 'finished' : 'playing',
        gameTitle: "Super Ta-Te-Ti",
        rules: SUPER_RULES,
        competitiveMode,
        turnTime
    };

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {setupMode ? (
                <PlayerSetup
                    title="Super Ta-Te-Ti"
                    onComplete={handleSetupComplete}
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
                        tacticalHint={activeSubBoard === null ? "Libertad de movimiento" : `Casilla Requerida: ${activeSubBoard + 1}`}
                    >
                        {globalWinner ? (
                            <GameResult
                                winners={[globalWinner === 'X' ? players.P1 : players.P2]}
                                onReplay={resetGame}
                                onSetup={() => {
                                    resetGame();
                                    setSetupMode(true);
                                }}
                            />
                        ) : (
                            <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
                                <Board
                                    cells={board}
                                    onCellClick={handleCellClick}
                                    activeSubBoard={activeSubBoard}
                                    subBoardWinners={subBoardWinners}
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

export default SuperTaTeTi;
