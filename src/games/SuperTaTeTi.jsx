import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import PlayerSetup from '../components/PlayerSetup';
import * as LucideIcons from 'lucide-react';

const SuperTaTeTi = ({ onExit }) => {
    // Estados del juego
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({
        P1: { icon: 'X', color: '#3b82f6' },
        P2: { icon: 'Circle', color: '#ef4444' }
    });

    const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
    const [isXNext, setIsXNext] = useState(true);
    const [activeSubBoard, setActiveSubBoard] = useState(null);
    const [subBoardWinners, setSubBoardWinners] = useState(Array(9).fill(null));
    const [globalWinner, setGlobalWinner] = useState(null);

    const handleSetupComplete = (selectedPlayers) => {
        setPlayers(selectedPlayers);
        setSetupMode(false);
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

    return (
        <div className="w-full max-w-4xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 w-full border-b border-white/5 pb-4">
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                    <LucideIcons.ArrowLeft size={16} /> Volver al Home
                </button>
                <div className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/50">
                    Super Ta-Te-Ti Mode
                </div>
            </div>

            {setupMode ? (
                <PlayerSetup onComplete={handleSetupComplete} />
            ) : (
                <div className="flex flex-col items-center">
                    <header className="mb-12 text-center w-full">
                        {globalWinner ? (
                            <div className="bg-white/5 p-8 rounded-3xl border-4 animate-bounce shadow-2xl flex flex-col items-center gap-4 transition-all"
                                style={{ borderColor: players[globalWinner === 'X' ? 'P1' : 'P2'].color }}>
                                <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: players[globalWinner === 'X' ? 'P1' : 'P2'].color }}>
                                    ¡GANADOR JUGADOR {globalWinner === 'X' ? '1' : '2'}!
                                </h2>
                                <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-white text-slate-950 rounded-lg hover:scale-105 transition-all uppercase text-sm font-bold">
                                    Reiniciar
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-8 text-2xl font-bold">
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${isXNext ? 'shadow-lg scale-110 ring-2 ring-white/20' : 'opacity-30'}`}
                                    style={{ backgroundColor: isXNext ? players.P1.color : 'transparent', color: isXNext ? 'white' : 'currentColor', border: `2px solid ${players.P1.color}` }}>
                                    {React.createElement(LucideIcons[players.P1.icon], { size: 28, strokeWidth: 3 })} JUGADOR 1
                                </div>
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${!isXNext ? 'shadow-lg scale-110 ring-2 ring-white/20' : 'opacity-30'}`}
                                    style={{ backgroundColor: !isXNext ? players.P2.color : 'transparent', color: !isXNext ? 'white' : 'currentColor', border: `2px solid ${players.P2.color}` }}>
                                    {React.createElement(LucideIcons[players.P2.icon], { size: 28, strokeWidth: 3 })} JUGADOR 2
                                </div>
                            </div>
                        )}
                    </header>

                    <div className="w-full max-w-2xl mx-auto">
                        <Board
                            cells={board}
                            onCellClick={handleCellClick}
                            activeSubBoard={activeSubBoard}
                            subBoardWinners={subBoardWinners}
                            playersConfig={players}
                            currentPlayerSymbol={isXNext ? 'X' : 'O'}
                        />
                    </div>

                    <footer className="mt-12 text-slate-500 text-sm font-bold uppercase tracking-widest text-center">
                        {activeSubBoard === null ? "Libertad de movimiento" : `Casilla Requerida: ${activeSubBoard + 1}`}
                    </footer>
                </div>
            )}
        </div>
    );
};

export default SuperTaTeTi;
