import { useState, useCallback } from 'react';
import PlayerSetup from '../../components/setup/PlayerSetup';
import MobileTaTeTiBoard from '../../components/game/MobileTaTeTiBoard';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import { GameProvider } from '../../contexts/GameContext';
import { MOBILE_TATETI_RULES } from '../../constants/gameRules';

// Combinaciones ganadoras del tablero 3×3
const WIN_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

const checkVictory = (board, playerIdx) =>
    WIN_LINES.find(line => line.every(i => board[i] === playerIdx)) ?? null;

// Celdas adyacentes (máx. 8 vecinos en el tablero 3×3)
const getAdjacent = (idx) => {
    const r = Math.floor(idx / 3), c = idx % 3;
    const adj = [];
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3)
                adj.push(nr * 3 + nc);
        }
    return adj;
};

const PIECES_PER_PLAYER = 3;
const TOTAL_PIECES = PIECES_PER_PLAYER * 2;

const MobileTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState([]);
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);

    // Estado del tablero
    const [board, setBoard] = useState(Array(9).fill(null));
    const [phase, setPhase] = useState('placement'); // 'placement' | 'movement'
    const [piecesPlaced, setPiecesPlaced] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState(null);
    const [gameState, setGameState] = useState('setup');

    // ---------- Setup ----------
    const handleSetupComplete = ({ players: playersObj, competitiveMode: cm, turnTime: tt }) => {
        const playersArray = [playersObj.P1, playersObj.P2];
        setPlayers(playersArray);
        setCompetitiveMode(cm ?? false);
        setTurnTime(tt ?? 0);
        resetGame(playersArray);
        setSetupMode(false);
    };

    const resetGame = (ps = players) => {
        setBoard(Array(9).fill(null));
        setPhase('placement');
        setPiecesPlaced(0);
        setSelectedIdx(null);
        setCurrentPlayerIndex(0);
        setWinner(null);
        setWinningLine(null);
        setGameState('playing');
    };

    // ---------- Click handler ----------
    const handleCellClick = useCallback((idx) => {
        if (gameState !== 'playing') return;

        if (phase === 'placement') {
            // Solo se puede colocar en celdas vacías
            if (board[idx] !== null) return;
            const newBoard = [...board];
            newBoard[idx] = currentPlayerIndex;
            const newPiecesPlaced = piecesPlaced + 1;

            const line = checkVictory(newBoard, currentPlayerIndex);
            if (line) {
                setBoard(newBoard);
                setWinningLine(line);
                setWinner(players[currentPlayerIndex]);
                setGameState('finished');
                return;
            }

            setBoard(newBoard);
            setPiecesPlaced(newPiecesPlaced);

            if (newPiecesPlaced >= TOTAL_PIECES) {
                setPhase('movement');
            }
            setCurrentPlayerIndex(1 - currentPlayerIndex);

        } else {
            // Fase de movimiento
            if (selectedIdx === null) {
                // Seleccionar pieza propia
                if (board[idx] === currentPlayerIndex) {
                    setSelectedIdx(idx);
                }
            } else {
                if (idx === selectedIdx) {
                    // Deseleccionar
                    setSelectedIdx(null);
                } else if (board[idx] === null && getAdjacent(selectedIdx).includes(idx)) {
                    // Movimiento válido
                    const newBoard = [...board];
                    newBoard[idx] = newBoard[selectedIdx];
                    newBoard[selectedIdx] = null;
                    setSelectedIdx(null);

                    const line = checkVictory(newBoard, currentPlayerIndex);
                    if (line) {
                        setBoard(newBoard);
                        setWinningLine(line);
                        setWinner(players[currentPlayerIndex]);
                        setGameState('finished');
                        return;
                    }

                    setBoard(newBoard);
                    setCurrentPlayerIndex(1 - currentPlayerIndex);
                } else if (board[idx] === currentPlayerIndex) {
                    // Cambiar selección a otra pieza propia
                    setSelectedIdx(idx);
                }
                // Ignorar: rival o celda no adyacente sin pieza propia
            }
        }
    }, [board, phase, piecesPlaced, selectedIdx, currentPlayerIndex, players, gameState]);

    // ---------- Timeout modo competitivo ----------
    const handleTimeOut = useCallback(() => {
        if (phase === 'placement') {
            const empties = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
            if (empties.length === 0) return;
            handleCellClick(empties[Math.floor(Math.random() * empties.length)]);
        } else {
            // Recopilar pares (from, to) válidos
            const moves = [];
            board.forEach((v, from) => {
                if (v !== currentPlayerIndex) return;
                getAdjacent(from).forEach(to => {
                    if (board[to] === null) moves.push([from, to]);
                });
            });
            if (moves.length === 0) return;
            const [from, to] = moves[Math.floor(Math.random() * moves.length)];
            const newBoard = [...board];
            newBoard[to] = newBoard[from];
            newBoard[from] = null;
            const line = checkVictory(newBoard, currentPlayerIndex);
            setBoard(newBoard);
            setSelectedIdx(null);
            if (line) {
                setWinningLine(line);
                setWinner(players[currentPlayerIndex]);
                setGameState('finished');
            } else {
                setCurrentPlayerIndex(1 - currentPlayerIndex);
            }
        }
    }, [board, phase, currentPlayerIndex, players, handleCellClick]);

    // ---------- Celdas válidas para mover ----------
    const validTargets = selectedIdx !== null
        ? getAdjacent(selectedIdx).filter(i => board[i] === null)
        : [];

    // ---------- Indicador de fase ----------
    const phasesPlaced = [0, 1].map(pi => board.filter(v => v === pi).length);
    const tacticalHint = phase === 'placement'
        ? `Colocación · ${piecesPlaced}/${TOTAL_PIECES} piezas`
        : 'Fase de Movimiento · Seleccioná una pieza';

    // ---------- Context ----------
    const contextValue = {
        players,
        currentPlayerIndex,
        scores: {},
        gameStatus: gameState,
        gameTitle: 'Tatetí Móvil',
        rules: MOBILE_TATETI_RULES,
        competitiveMode,
        turnTime,
        onTimeOut: competitiveMode ? handleTimeOut : null,
    };

    if (setupMode) {
        return (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
                <PlayerSetup
                    title="Tatetí Móvil"
                    onComplete={handleSetupComplete}
                    onBack={onExit}
                    initialPlayers={players.length ? { P1: players[0], P2: players[1] } : null}
                    initialCompetitiveMode={competitiveMode}
                    initialTurnTime={turnTime}
                />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <GameProvider value={contextValue}>
                <GameLayout
                    onExit={onExit}
                    onReset={resetGame}
                    onConfig={() => setSetupMode(true)}
                    tacticalHint={tacticalHint}
                >
                    {gameState !== 'finished' ? (
                        <MobileTaTeTiBoard
                            board={board}
                            phase={phase}
                            selectedIdx={selectedIdx}
                            validTargets={validTargets}
                            players={players}
                            currentPlayerIndex={currentPlayerIndex}
                            onCellClick={handleCellClick}
                            winningLine={winningLine}
                        />
                    ) : (
                        <GameResult
                            winners={winner ? [winner] : []}
                            isDraw={false}
                            onReplay={resetGame}
                            onSetup={() => { resetGame(); setSetupMode(true); }}
                        />
                    )}
                </GameLayout>
            </GameProvider>
        </div>
    );
};

export default MobileTaTeTi;
