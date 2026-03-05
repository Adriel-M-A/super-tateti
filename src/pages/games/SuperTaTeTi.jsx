import { useState } from 'react';
import Board from '../../components/game/Board';
import PlayerSetup from '../../components/setup/PlayerSetup';
import GameLayout from '../../components/layout/GameLayout';
import { Trophy, X, Circle } from 'lucide-react';
import { SUPER_RULES } from '../../constants/gameRules';

const SuperTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({
        P1: { id: 'P1', name: 'Jugador 1', icon: 'X', color: '#3b82f6' },
        P2: { id: 'P2', name: 'Jugador 2', icon: 'Circle', color: '#ef4444' }
    });

    const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
    const [isXNext, setIsXNext] = useState(true);
    const [activeSubBoard, setActiveSubBoard] = useState(null);
    const [subBoardWinners, setSubBoardWinners] = useState(Array(9).fill(null));
    const [globalWinner, setGlobalWinner] = useState(null);

    const handleSetupComplete = (selectedPlayers) => {
        const adaptedPlayers = {
            P1: { ...selectedPlayers.P1, id: 'P1', name: 'Jugador 1' },
            P2: { ...selectedPlayers.P2, id: 'P2', name: 'Jugador 2' }
        };
        setPlayers(adaptedPlayers);
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

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {setupMode ? (
                <PlayerSetup title="Super Ta-Te-Ti" onComplete={handleSetupComplete} />
            ) : (
                <GameLayout
                    gameTitle="Super Ta-Te-Ti"
                    onExit={onExit}
                    onReset={resetGame}
                    players={playersList}
                    currentPlayerIndex={currentPlayerIndex}
                    rules={SUPER_RULES}
                    gameStatus={globalWinner ? 'finished' : 'playing'}
                >
                    {globalWinner ? (
                        <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500 py-12">
                            <div className="p-12 bg-cell-hover border-4 rounded-[4rem] flex flex-col items-center gap-6 shadow-2xl max-w-xl text-center transition-all"
                                style={{ borderColor: players[globalWinner === 'X' ? 'P1' : 'P2'].color }}>
                                <Trophy size={100} className="text-yellow-500 animate-bounce" />
                                <div>
                                    <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-2"
                                        style={{ color: players[globalWinner === 'X' ? 'P1' : 'P2'].color }}>
                                        ¡VICTORIA!
                                    </h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                                        El Jugador {globalWinner === 'X' ? '1' : '2'} ha conquistado el tablero global
                                    </p>
                                </div>
                                <button
                                    onClick={resetGame}
                                    className="mt-8 px-12 py-4 bg-page-text text-page-bg font-black text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl uppercase"
                                >
                                    Volver a Jugar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
                            <Board
                                cells={board}
                                onCellClick={handleCellClick}
                                activeSubBoard={activeSubBoard}
                                subBoardWinners={subBoardWinners}
                                playersConfig={players}
                                currentPlayerSymbol={isXNext ? 'X' : 'O'}
                            />
                            <div className="mt-8 px-6 py-3 rounded-2xl bg-cell-hover border border-board-border text-slate-500 text-xs font-black uppercase tracking-[0.2em] shadow-inner italic">
                                {activeSubBoard === null ? "Libertad de movimiento" : `Casilla Requerida: ${activeSubBoard + 1}`}
                            </div>
                        </div>
                    )}
                </GameLayout>
            )}
        </div>
    );
};

export default SuperTaTeTi;
