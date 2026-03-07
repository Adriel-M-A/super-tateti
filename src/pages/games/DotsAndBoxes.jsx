import { useState, useCallback } from 'react';
import DotsAndBoxesSetup from '../../components/setup/DotsAndBoxesSetup';
import DotsAndBoxesBoard from '../../components/game/DotsAndBoxesBoard';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import { DOTS_AND_BOXES_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';

const DotsAndBoxes = ({ onExit }) => {
    const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'finished'
    const [players, setPlayers] = useState([]);
    const [boardSize, setBoardSize] = useState(5);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);

    // Estado del tablero: líneas y cajas
    const [lines, setLines] = useState({ h: [], v: [] });
    const [boxes, setBoxes] = useState([]); // [r][c] almacena el playerIndex o null
    const [scores, setScores] = useState([]);
    const [winner, setWinner] = useState(null);

    const initializeGame = (setupData) => {
        const { players: configPlayers, boardSize: size, competitiveMode: cm, turnTime: tt } = setupData;

        // Actualizar siempre los estados competitivos
        setCompetitiveMode(cm ?? false);
        setTurnTime(tt ?? 0);

        // Persistencia Inteligente: ¿Ha cambiado algo estructural?
        const isSameStructure = size === boardSize && configPlayers.length === players.length;

        if (isSameStructure && players.length > 0) {
            setPlayers(configPlayers);
            setGameState('playing');
            return;
        }

        // Reinicio Total (solo si cambia estructura o es partida nueva)
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

    // Convertir scores a objeto por ID para el contexto
    const scoresById = {};
    players.forEach((p, i) => scoresById[p.id] = scores[i]);

    const contextValue = {
        players,
        currentPlayerIndex,
        scores: scoresById,
        gameStatus: gameState,
        gameTitle: "Puntos y Cajas",
        rules: DOTS_AND_BOXES_RULES,
        competitiveMode,
        turnTime
    };

    return (
        <div className="w-full flex flex-col items-center">
            {gameState === 'setup' && (
                <DotsAndBoxesSetup
                    onComplete={initializeGame}
                    initialPlayers={players}
                    initialBoardSize={boardSize}
                    initialCompetitiveMode={competitiveMode}
                    initialTurnTime={turnTime}
                    isGameInProgress={lines.h.some(r => r.some(c => c !== null)) || lines.v.some(r => r.some(c => c !== null))}
                />
            )}

            {(gameState === 'playing' || gameState === 'finished') && (
                <GameProvider value={contextValue}>
                    <GameLayout
                        onExit={onExit}
                        onReset={resetGame}
                        onConfig={() => setGameState('setup')}
                        tacticalHint="Duelo por puntos • Cierra cajas para sumar"
                    >
                        {gameState === 'playing' ? (
                            <DotsAndBoxesBoard
                                size={boardSize}
                                lines={lines}
                                boxes={boxes}
                                onMove={handleMove}
                            />
                        ) : (() => {
                            const isDraw = winner.length > 1 && winner.length === players.length;

                            return (
                                <GameResult
                                    winners={winner}
                                    isDraw={isDraw}
                                    onReplay={resetGame}
                                    onSetup={() => {
                                        setGameState('setup');
                                        setWinner(null);
                                    }}
                                />
                            );
                        })()}
                    </GameLayout>
                </GameProvider>
            )}
        </div>
    );
};

export default DotsAndBoxes;
