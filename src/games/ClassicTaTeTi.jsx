import { useState } from 'react';
import Board from '../components/Board';
import PlayerSetup from '../components/PlayerSetup';
import { ArrowLeft, X, Circle } from 'lucide-react';

const ClassicTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({
        P1: { icon: 'X', color: '#3b82f6' },
        P2: { icon: 'Circle', color: '#ef4444' }
    });

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const handleSetupComplete = (selectedPlayers) => {
        setPlayers(selectedPlayers);
        setSetupMode(false);
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

    return (
        <div className="w-full max-w-4xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 w-full border-b border-white/5 pb-4">
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Volver al Home
                </button>
                <div className="text-xs font-black uppercase tracking-[0.3em] text-green-500/50">
                    Classic Mode
                </div>
            </div>

            {setupMode ? (
                <PlayerSetup onComplete={handleSetupComplete} />
            ) : (
                <div className="flex flex-col items-center">
                    <header className="mb-12 text-center w-full">
                        {winner ? (
                            <div className="bg-white/5 p-8 rounded-3xl border-4 animate-bounce shadow-2xl flex flex-col items-center gap-4 transition-all"
                                style={{ borderColor: winner === 'DRAW' ? '#94a3b8' : players[winner === 'X' ? 'P1' : 'P2'].color }}>
                                <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: winner === 'DRAW' ? '#94a3b8' : players[winner === 'X' ? 'P1' : 'P2'].color }}>
                                    {winner === 'DRAW' ? '¡EMPATE!' : `¡GANADOR JUGADOR ${winner === 'X' ? '1' : '2'}!`}
                                </h2>
                                <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-white text-slate-950 rounded-lg hover:scale-105 transition-all uppercase text-sm font-bold">
                                    Reiniciar
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-8 text-2xl font-bold">
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${isXNext ? 'shadow-lg scale-110 ring-2 ring-white/20' : 'opacity-30'}`}
                                    style={{ backgroundColor: isXNext ? players.P1.color : 'transparent', color: isXNext ? 'white' : 'currentColor', border: `2px solid ${players.P1.color}` }}>
                                    {players.P1.icon === 'X' ? <X size={28} strokeWidth={3} /> : <Circle size={28} strokeWidth={3} />} JUGADOR 1
                                </div>
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${!isXNext ? 'shadow-lg scale-110 ring-2 ring-white/20' : 'opacity-30'}`}
                                    style={{ backgroundColor: !isXNext ? players.P2.color : 'transparent', color: !isXNext ? 'white' : 'currentColor', border: `2px solid ${players.P2.color}` }}>
                                    {players.P2.icon === 'X' ? <X size={28} strokeWidth={3} /> : <Circle size={28} strokeWidth={3} />} JUGADOR 2
                                </div>
                            </div>
                        )}
                    </header>

                    <div className="w-full max-w-md mx-auto aspect-square">
                        <Board
                            cells={board}
                            onCellClick={handleCellClick}
                            level="super" // Cambiado de "sub" a "super" para obtener bordes gruesos (4px)
                            isSelectable={!winner}
                            playersConfig={players}
                            currentPlayerSymbol={isXNext ? 'X' : 'O'}
                        />
                    </div>

                    <footer className="mt-12 text-slate-500 text-sm font-black uppercase tracking-widest text-center italic opacity-30">
                        Tres en raya de toda la vida
                    </footer>
                </div>
            )}
        </div>
    );
};

export default ClassicTaTeTi;
