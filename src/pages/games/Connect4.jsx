import { useState, useCallback } from 'react';
import Connect4Setup from '../../components/setup/Connect4Setup';
import Connect4Board from '../../components/game/Connect4Board';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import { CONNECT4_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';

const ROWS = 6;
const COLS = 7;

const Connect4 = ({ onExit }) => {
    const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'finished'
    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => new Array(COLS).fill(null)));
    const [winner, setWinner] = useState(null);
    const [winningCells, setWinningCells] = useState([]);
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);

    const handleSetupComplete = (setupData) => {
        setPlayers(setupData.players);
        setCompetitiveMode(setupData.competitiveMode);
        setTurnTime(setupData.turnTime);
        setGameState('playing');
        // No reiniciamos el grid ni el turno aquí para permitir persistencia
    };

    const initializeGame = (setupData) => {
        // Este se usa para el RESET real del botón de reiniciar
        if (setupData?.players) setPlayers(setupData.players);
        setGrid(Array.from({ length: ROWS }, () => new Array(COLS).fill(null)));
        setCurrentPlayerIndex(0);
        setGameState('playing');
        setWinner(null);
        setWinningCells([]);
        // Los estados competitivos se mantienen entre resets
    };

    const checkVictory = (newGrid, r, c, playerIdx) => {
        const directions = [
            [0, 1],  // Horizontal
            [1, 0],  // Vertical
            [1, 1],  // Diagonal \
            [1, -1]  // Diagonal /
        ];

        for (const [dr, dc] of directions) {
            let count = 1;
            let cells = [[r, c]];

            // Check in one direction
            for (let i = 1; i < 4; i++) {
                const nr = r + dr * i;
                const nc = c + dc * i;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc] === playerIdx) {
                    count++;
                    cells.push([nr, nc]);
                } else break;
            }

            // Check in opposite direction
            for (let i = 1; i < 4; i++) {
                const nr = r - dr * i;
                const nc = c - dc * i;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc] === playerIdx) {
                    count++;
                    cells.push([nr, nc]);
                } else break;
            }

            if (count >= 4) {
                return cells;
            }
        }
        return null;
    };

    const handleColumnClick = useCallback((col) => {
        if (gameState !== 'playing') return;

        // Encontrar la fila libre más baja
        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][col] === null) {
                row = r;
                break;
            }
        }

        if (row === -1) return; // Columna llena

        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = currentPlayerIndex;
        setGrid(newGrid);

        const winCells = checkVictory(newGrid, row, col, currentPlayerIndex);
        if (winCells) {
            setWinningCells(winCells);
            setWinner([players[currentPlayerIndex]]);
            setGameState('finished');
        } else {
            // Comprobar empate
            const isBoardFull = newGrid.every(r => r.every(cell => cell !== null));
            if (isBoardFull) {
                setGameState('finished');
                setWinner([]); // Empate
            } else {
                setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
            }
        }
    }, [grid, gameState, currentPlayerIndex, players]);

    const resetGame = () => {
        initializeGame({ players });
    };

    const contextValue = {
        players,
        currentPlayerIndex,
        scores: { P1: 0, P2: 0 },
        gameStatus: gameState,
        gameTitle: "Conecta 4",
        rules: CONNECT4_RULES,
        competitiveMode,
        turnTime
    };

    return (
        <div className="w-full flex flex-col items-center">
            {gameState === 'setup' && (
                <Connect4Setup
                    onComplete={handleSetupComplete}
                    initialPlayers={players}
                    initialCompetitiveMode={competitiveMode}
                    initialTurnTime={turnTime}
                />
            )}

            {(gameState === 'playing' || gameState === 'finished') && (
                <GameProvider value={contextValue}>
                    <GameLayout
                        onExit={onExit}
                        onReset={resetGame}
                        onConfig={() => setGameState('setup')}
                        tacticalHint="Objetivo: 4 en línea • Gravedad activa"
                    >
                        {gameState === 'playing' ? (
                            <Connect4Board
                                grid={grid}
                                onColumnClick={handleColumnClick}
                                winningCells={winningCells}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <GameResult
                                    winners={winner}
                                    isDraw={winner && winner.length === 0}
                                    onReplay={resetGame}
                                    onSetup={() => setGameState('setup')}
                                />
                            </div>
                        )}
                    </GameLayout>
                </GameProvider>
            )}
        </div>
    );
};

export default Connect4;
