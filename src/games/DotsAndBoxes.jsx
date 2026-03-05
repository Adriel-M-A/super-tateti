import { useState, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Users as UsersIcon, X, Circle, Triangle, Square, Hexagon } from 'lucide-react';
import DotsAndBoxesSetup from '../components/DotsAndBoxesSetup';
import DotsAndBoxesBoard from '../components/DotsAndBoxesBoard';

const icons = { X, Circle, Triangle, Square, Hexagon };
const IconRenderer = ({ iconName, ...props }) => {
    const Icon = icons[iconName];
    return Icon ? <Icon {...props} /> : null;
};

const DotsAndBoxes = ({ onExit }) => {
    const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'finished'
    const [players, setPlayers] = useState([]);
    const [boardSize, setBoardSize] = useState(5);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    // Estado del tablero: líneas y cajas
    // lines.h[r][c] es la línea horizontal entre (r,c) y (r, c+1)
    // lines.v[r][c] es la línea vertical entre (r,c) y (r+1, c)
    const [lines, setLines] = useState({ h: [], v: [] });
    const [boxes, setBoxes] = useState([]); // [r][c] almacena el playerIndex o null
    const [scores, setScores] = useState([]);
    const [winner, setWinner] = useState(null);

    const initializeGame = (setupData) => {
        const { players: configPlayers, boardSize: size } = setupData;
        setPlayers(configPlayers);
        setBoardSize(size);
        setScores(new Array(configPlayers.length).fill(0));
        setCurrentPlayerIndex(0);

        // Inicializar líneas (puntos son size + 1)
        const hLines = Array.from({ length: size + 1 }, () => new Array(size).fill(null));
        const vLines = Array.from({ length: size }, () => new Array(size + 1).fill(null));
        setLines({ h: hLines, v: vLines });

        // Inicializar cajas
        const boxGrid = Array.from({ length: size }, () => new Array(size).fill(null));
        setBoxes(boxGrid);

        setGameState('playing');
        setWinner(null);
    };

    const handleMove = useCallback((type, r, c) => {
        if (gameState !== 'playing') return false;

        const newLines = { ...lines };
        if (type === 'h') {
            if (newLines.h[r][c] !== null) return false;
            newLines.h[r][c] = currentPlayerIndex;
        } else {
            if (newLines.v[r][c] !== null) return false;
            newLines.v[r][c] = currentPlayerIndex;
        }
        setLines(newLines);

        // Comprobar si se completaron cajas
        let boxesCompleted = 0;
        const newBoxes = [...boxes];
        const newScores = [...scores];

        if (type === 'h') {
            // Comprobar caja de arriba
            if (r > 0) {
                if (checkIsBoxComplete(r - 1, c, newLines)) {
                    newBoxes[r - 1][c] = currentPlayerIndex;
                    newScores[currentPlayerIndex]++;
                    boxesCompleted++;
                }
            }
            // Comprobar caja de abajo
            if (r < boardSize) {
                if (checkIsBoxComplete(r, c, newLines)) {
                    newBoxes[r][c] = currentPlayerIndex;
                    newScores[currentPlayerIndex]++;
                    boxesCompleted++;
                }
            }
        } else {
            // Comprobar caja de la izquierda
            if (c > 0) {
                if (checkIsBoxComplete(r, c - 1, newLines)) {
                    newBoxes[r][c - 1] = currentPlayerIndex;
                    newScores[currentPlayerIndex]++;
                    boxesCompleted++;
                }
            }
            // Comprobar caja de la derecha
            if (c < boardSize) {
                if (checkIsBoxComplete(r, c, newLines)) {
                    newBoxes[r][c] = currentPlayerIndex;
                    newScores[currentPlayerIndex]++;
                    boxesCompleted++;
                }
            }
        }

        setBoxes(newBoxes);
        setScores(newScores);

        // Verificar fin de juego
        const totalBoxes = boardSize * boardSize;
        const completedBoxes = newScores.reduce((a, b) => a + b, 0);

        if (completedBoxes === totalBoxes) {
            setGameState('finished');
            const maxScore = Math.max(...newScores);
            const winnersIndexes = newScores.map((s, i) => s === maxScore ? i : -1).filter(i => i !== -1);
            setWinner(winnersIndexes.map(i => players[i]));
        } else if (boxesCompleted === 0) {
            // Si no completó caja, cambio de turno
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }

        return true;
    }, [gameState, lines, boxes, scores, currentPlayerIndex, players, boardSize]);

    const checkIsBoxComplete = (r, c, currentLines) => {
        // Una caja en (r, c) está delimitada por:
        // h[r][c], h[r+1][c], v[r][c], v[r][c+1]
        return (
            currentLines.h[r][c] !== null &&
            currentLines.h[r + 1][c] !== null &&
            currentLines.v[r][c] !== null &&
            currentLines.v[r][c + 1] !== null
        );
    };

    const resetGame = () => {
        initializeGame({ players, boardSize });
    };

    return (
        <div className="w-full max-w-6xl flex flex-col items-center">
            {/* Cabecera */}
            <div className="w-full flex justify-between items-center mb-8 px-4">
                <button
                    onClick={onExit}
                    className="p-3 rounded-2xl bg-cell-hover border border-board-border text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-blue-500">Puntos y Cajas</h2>
                    {gameState === 'playing' && (
                        <div className="flex gap-4 mt-2">
                            {players.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${i === currentPlayerIndex ? 'bg-page-text/10 border-page-text scale-110' : 'border-board-border opacity-50'
                                        }`}
                                    style={{ color: p.color }}
                                >
                                    <span className="font-black text-xs uppercase">{p.name}: {scores[i]}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={gameState === 'playing' ? resetGame : () => setGameState('setup')}
                    className="p-3 rounded-2xl bg-cell-hover border border-board-border text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md"
                >
                    <RotateCcw size={24} />
                </button>
            </div>

            {/* Contenido Principal */}
            {gameState === 'setup' && (
                <DotsAndBoxesSetup onComplete={initializeGame} />
            )}

            {gameState === 'playing' && (
                <div className="w-full flex items-center justify-center p-4">
                    <DotsAndBoxesBoard
                        size={boardSize}
                        lines={lines}
                        boxes={boxes}
                        currentPlayer={players[currentPlayerIndex]}
                        onMove={handleMove}
                        players={players}
                    />
                </div>
            )}

            {gameState === 'finished' && (
                <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500">
                    <div className="p-12 bg-cell-hover border-4 border-page-text rounded-[4rem] flex flex-col items-center gap-6 shadow-2xl max-w-xl text-center">
                        <Trophy size={120} className="text-yellow-500 animate-bounce" />
                        <div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-2">
                                {winner.length > 1 ? '¡Empate!' : '¡Victoria!'}
                            </h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest">
                                {winner.length > 1
                                    ? 'Varios jugadores han dominado el tablero'
                                    : `${winner[0].name} ha conquistado el territorio`
                                }
                            </p>
                        </div>

                        <div className="flex gap-4 mt-4">
                            {winner.map(p => (
                                <div key={p.id} className="flex flex-col items-center gap-2">
                                    <div className="p-4 rounded-2xl bg-page-bg" style={{ color: p.color }}>
                                        <IconRenderer iconName={p.icon} size={48} strokeWidth={3} />
                                    </div>
                                    <span className="font-black uppercase tracking-tighter" style={{ color: p.color }}>{p.name}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setGameState('setup')}
                            className="mt-8 px-12 py-4 bg-page-text text-page-bg font-black text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl uppercase"
                        >
                            Volver a Jugar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DotsAndBoxes;
