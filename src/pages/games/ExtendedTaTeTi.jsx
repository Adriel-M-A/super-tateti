import { useState, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import GameLayout from '../../components/layout/GameLayout';
import ExtendedTaTeTiSetup from '../../components/setup/ExtendedTaTeTiSetup';
import ExtendedTaTeTiBoard from '../../components/game/ExtendedTaTeTiBoard';
import { EXTENDED_TATETI_RULES } from '../../constants/gameRules';

const ExtendedTaTeTi = ({ onExit }) => {
    const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'finished'
    const [players, setPlayers] = useState([]);
    const [config, setConfig] = useState({ rows: 7, cols: 7, winCondition: 4 });
    const [board, setBoard] = useState([]);
    const [completedLines, setCompletedLines] = useState([]);
    const [scores, setScores] = useState({});
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    const initializeGame = (setupData) => {
        const { players: selectedPlayers, rows, cols, winCondition } = setupData;

        const initialBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
        const initialScores = {};
        selectedPlayers.forEach(p => initialScores[p.id] = 0);

        setPlayers(selectedPlayers);
        setConfig({ rows, cols, winCondition });
        setBoard(initialBoard);
        setScores(initialScores);
        setCompletedLines([]);
        setCurrentPlayerIndex(0);
        setGameState('playing');
    };

    const findNewLines = (r, c, playerId, newBoard) => {
        const directions = [
            { dr: 0, dc: 1 },  // H
            { dr: 1, dc: 0 },  // V
            { dr: 1, dc: 1 },  // D1
            { dr: 1, dc: -1 }  // D2
        ];

        const { rows, cols, winCondition } = config;
        let newLinesFound = [];

        directions.forEach(({ dr, dc }) => {
            // Escanear en ambas direcciones para encontrar la secuencia máxima
            let lineCells = [{ r, c }];

            // Forward
            let nr = r + dr;
            let nc = c + dc;
            while (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc] === playerId) {
                lineCells.push({ r: nr, c: nc });
                nr += dr;
                nc += dc;
            }

            // Backward
            nr = r - dr;
            nc = c - dc;
            while (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc] === playerId) {
                lineCells.unshift({ r: nr, c: nc });
                nr -= dr;
                nc -= dc;
            }

            // Si la secuencia es suficientemente larga, buscar todos los sub-segmentos de longitud exacta winCondition
            if (lineCells.length >= winCondition) {
                for (let i = 0; i <= lineCells.length - winCondition; i++) {
                    const segment = lineCells.slice(i, i + winCondition);
                    // Importante: El segmento DEBE incluir la celda que se acaba de marcar (r, c)
                    const includesNewCell = segment.some(cell => cell.r === r && cell.c === c);

                    if (includesNewCell) {
                        // Crear un ID único para la línea basado en sus extremos (para no repetirla)
                        const start = segment[0];
                        const end = segment[segment.length - 1];
                        const lineId = `${playerId}-${start.r},${start.c}-${end.r},${end.c}`;

                        // Solo agregar si no estaba ya completada (aunque el algoritmo ya filtra por la celda nueva)
                        if (!completedLines.some(l => l.id === lineId)) {
                            newLinesFound.push({
                                id: lineId,
                                playerId,
                                start,
                                end,
                                cells: segment
                            });
                        }
                    }
                }
            }
        });

        return newLinesFound;
    };

    const handleCellClick = (r, c) => {
        if (gameState !== 'playing' || board[r][c]) return;

        const newBoard = board.map(row => [...row]);
        const currentPlayer = players[currentPlayerIndex];
        newBoard[r][c] = currentPlayer.id;

        const newLines = findNewLines(r, c, currentPlayer.id, newBoard);

        if (newLines.length > 0) {
            setCompletedLines(prev => [...prev, ...newLines]);
            setScores(prev => ({
                ...prev,
                [currentPlayer.id]: prev[currentPlayer.id] + newLines.length
            }));
        }

        setBoard(newBoard);

        // Verificar si el tablero está lleno
        const isFull = newBoard.every(row => row.every(cell => cell !== null));
        if (isFull) {
            setGameState('finished');
        } else {
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }
    };

    const handleReset = () => {
        const initialBoard = Array.from({ length: config.rows }, () => Array(config.cols).fill(null));
        const initialScores = {};
        players.forEach(p => initialScores[p.id] = 0);

        setBoard(initialBoard);
        setScores(initialScores);
        setCompletedLines([]);
        setCurrentPlayerIndex(0);
        setGameState('playing');
    };

    const backToSetup = () => {
        setGameState('setup');
    };

    const getWinner = () => {
        const result = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const maxScore = result[0][1];
        const winners = result.filter(r => r[1] === maxScore).map(r => players.find(p => p.id === r[0]));
        return { winners, maxScore };
    };

    return (
        <div className="w-full flex flex-col items-center">
            {gameState === 'setup' && (
                <ExtendedTaTeTiSetup onComplete={initializeGame} />
            )}

            {gameState === 'playing' && (
                <GameLayout
                    gameTitle="Ta-Te-Ti Extendido"
                    onExit={onExit}
                    onReset={handleReset}
                    players={players}
                    currentPlayerIndex={currentPlayerIndex}
                    scores={players.map(p => scores[p.id])}
                    rules={EXTENDED_TATETI_RULES}
                    gameStatus="playing"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="px-6 py-2 rounded-full bg-cell-hover border border-board-border text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                            Objetivo: {config.winCondition} en línea • {config.cols}x{config.rows}
                        </div>
                        <ExtendedTaTeTiBoard
                            rows={config.rows}
                            cols={config.cols}
                            board={board}
                            completedLines={completedLines}
                            players={players}
                            onCellClick={handleCellClick}
                        />
                    </div>
                </GameLayout>
            )}

            {gameState === 'finished' && (
                <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500 py-12">
                    {(() => {
                        const { winners, maxScore } = getWinner();
                        return (
                            <div className="p-12 bg-cell-hover border-4 border-page-text rounded-[4rem] flex flex-col items-center gap-6 shadow-2xl max-w-xl text-center">
                                <Trophy size={120} className="text-yellow-500 animate-bounce" />
                                <div>
                                    <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-2">
                                        {winners.length > 1 ? '¡Empate!' : '¡Victoria!'}
                                    </h3>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                        {winners.length > 1
                                            ? `Gran batalla con ${maxScore} puntos cada uno`
                                            : `${winners[0].name} domina la grilla con ${maxScore} puntos`
                                        }
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-6 mt-4">
                                    {winners.map(p => (
                                        <div key={p.id} className="flex flex-col items-center gap-2">
                                            <div className="p-6 rounded-3xl bg-page-bg shadow-inner" style={{ color: p.color }}>
                                                {/* Icono decorativo */}
                                                <div className="text-5xl font-black">
                                                    {scores[p.id]}
                                                </div>
                                            </div>
                                            <span className="font-black uppercase tracking-tighter text-lg">{p.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <button
                                        onClick={handleReset}
                                        className="px-8 py-4 bg-page-text text-page-bg font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl uppercase"
                                    >
                                        Revancha rápida
                                    </button>
                                    <button
                                        onClick={backToSetup}
                                        className="px-8 py-4 bg-page-text/10 text-page-text font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase border border-page-text/20"
                                    >
                                        Nueva Configuración
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default ExtendedTaTeTi;
