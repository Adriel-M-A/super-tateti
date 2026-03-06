import { useState, useCallback } from 'react';
import DotsAndBoxesSetup from '../../components/setup/DotsAndBoxesSetup';
import DotsAndBoxesBoard from '../../components/game/DotsAndBoxesBoard';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import { DOTS_AND_BOXES_RULES } from '../../constants/gameRules';

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
        <div className="w-full flex flex-col items-center">
            {gameState === 'setup' && (
                <DotsAndBoxesSetup onComplete={initializeGame} />
            )}

            {(gameState === 'playing' || gameState === 'finished') && (
                <GameLayout
                    gameTitle="Puntos y Cajas"
                    onExit={onExit}
                    onReset={resetGame}
                    players={players}
                    currentPlayerIndex={currentPlayerIndex}
                    scores={scores}
                    rules={DOTS_AND_BOXES_RULES}
                    gameStatus={gameState}
                >
                    {gameState === 'playing' ? (
                        <DotsAndBoxesBoard
                            size={boardSize}
                            lines={lines}
                            boxes={boxes}
                            currentPlayer={players[currentPlayerIndex]}
                            onMove={handleMove}
                            players={players}
                        />
                    ) : (() => {
                        const winnerScores = {};
                        players.forEach((p, i) => winnerScores[p.id] = scores[i]);
                        const isDraw = winner.length > 1 && winner.length === players.length;

                        return (
                            <GameResult
                                winners={winner}
                                isDraw={isDraw}
                                scores={winnerScores}
                                onReplay={resetGame}
                                onSetup={() => {
                                    setGameState('setup');
                                    setWinner(null);
                                }}
                            />
                        );
                    })()}
                </GameLayout>
            )}
        </div>
    );
};

export default DotsAndBoxes;
