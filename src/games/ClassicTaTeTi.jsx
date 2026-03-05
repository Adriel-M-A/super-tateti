import { useState } from 'react';
import Board from '../components/Board';
import PlayerSetup from '../components/PlayerSetup';
import GameLayout from '../components/GameLayout';
import { Trophy, X, Circle } from 'lucide-react';

const CLASSIC_RULES = [
    "El juego se desarrolla en un tablero de 3x3.",
    "Dos jugadores (X y O) se turnan para marcar una casilla vacía.",
    "El primer jugador en lograr 3 marcas en línea (horizontal, vertical o diagonal) gana.",
    "Si todas las casillas se llenan sin un ganador, el resultado es empate.",
    "La estrategia consiste en bloquear al oponente mientras creas tu propia línea."
];

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

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {setupMode ? (
                <PlayerSetup title="Ta-Te-Ti Clásico" onComplete={handleSetupComplete} />
            ) : (
                <GameLayout
                    gameTitle="Ta-Te-Ti Clásico"
                    onExit={onExit}
                    onReset={resetGame}
                    players={playersList}
                    currentPlayerIndex={currentPlayerIndex}
                    rules={CLASSIC_RULES}
                    gameStatus={winner ? 'finished' : 'playing'}
                >
                    {winner ? (
                        <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500 py-12">
                            <div className="p-12 bg-cell-hover border-4 rounded-[4rem] flex flex-col items-center gap-6 shadow-2xl max-w-xl text-center transition-all"
                                style={{ borderColor: winner === 'DRAW' ? '#94a3b8' : players[winner === 'X' ? 'P1' : 'P2'].color }}>
                                <Trophy size={100} className={winner === 'DRAW' ? 'text-slate-400' : 'text-yellow-500 animate-bounce'} />
                                <div>
                                    <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-2"
                                        style={{ color: winner === 'DRAW' ? '#94a3b8' : players[winner === 'X' ? 'P1' : 'P2'].color }}>
                                        {winner === 'DRAW' ? '¡EMPATE!' : '¡VICTORIA!'}
                                    </h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                                        {winner === 'DRAW' ? 'Nadie ha logrado alinear sus piezas' : `El Jugador ${winner === 'X' ? '1' : '2'} ha ganado la partida`}
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
            )}
        </div>
    );
};

export default ClassicTaTeTi;
