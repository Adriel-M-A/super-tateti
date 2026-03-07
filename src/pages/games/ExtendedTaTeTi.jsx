import { useState, useCallback } from 'react';

import GameLayout from '../../components/layout/GameLayout';
import ExtendedTaTeTiSetup from '../../components/setup/ExtendedTaTeTiSetup';
import ExtendedTaTeTiBoard from '../../components/game/ExtendedTaTeTiBoard';
import GameResult from '../../components/game/GameResult';
import { EXTENDED_TATETI_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';

const ExtendedTaTeTi = ({ onExit }) => {
    const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'finished'
    const [players, setPlayers] = useState([]);
    const [config, setConfig] = useState({ rows: 7, cols: 7, winCondition: 4 });
    const [board, setBoard] = useState([]);
    const [completedLines, setCompletedLines] = useState([]);
    const [scores, setScores] = useState({});
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);

    const initializeGame = (setupData) => {
        const { players: selectedPlayers, rows, cols, winCondition, competitiveMode: cm, turnTime: tt } = setupData;

        // Actualizar siempre los estados competitivos
        setCompetitiveMode(cm ?? false);
        setTurnTime(tt ?? 0);

        // Persistencia Inteligente
        const isSameStructure = rows === config.rows &&
            cols === config.cols &&
            winCondition === config.winCondition &&
            selectedPlayers.length === players.length;

        if (isSameStructure && players.length > 0) {
            setPlayers(selectedPlayers);
            setGameState('playing');
            return;
        }

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

    const contextValue = {
        players,
        currentPlayerIndex,
        scores,
        gameStatus: gameState,
        gameTitle: "Ta-Te-Ti Extendido",
        rules: EXTENDED_TATETI_RULES,
        competitiveMode,
        turnTime
    };

    return (
        <div className="w-full flex flex-col items-center">
            {gameState === 'setup' && (
                <ExtendedTaTeTiSetup
                    onComplete={initializeGame}
                    initialPlayers={players}
                    initialConfig={config}
                    initialCompetitiveMode={competitiveMode}
                    initialTurnTime={turnTime}
                    isGameInProgress={board.some(r => r.some(c => c !== null))}
                />
            )}

            {(gameState === 'playing' || gameState === 'finished') && (
                <GameProvider value={contextValue}>
                    <GameLayout
                        onExit={onExit}
                        onReset={handleReset}
                        onConfig={backToSetup}
                        tacticalHint={`Objetivo: ${config.winCondition} en línea • ${config.cols}x${config.rows}`}
                    >
                        {gameState === 'playing' ? (
                            <ExtendedTaTeTiBoard
                                rows={config.rows}
                                cols={config.cols}
                                board={board}
                                completedLines={completedLines}
                                onCellClick={handleCellClick}
                            />
                        ) : (() => {
                            const { winners } = getWinner();
                            const isDraw = winners.length === players.length && winners.length > 1 &&
                                Object.values(scores).every(s => s === Object.values(scores)[0]);

                            return (
                                <GameResult
                                    winners={winners}
                                    isDraw={isDraw && winners.length > 2}
                                    onReplay={handleReset}
                                    onSetup={backToSetup}
                                />
                            );
                        })()}
                    </GameLayout>
                </GameProvider>
            )}
        </div>
    );
};

export default ExtendedTaTeTi;
