import { useState, useCallback, useEffect } from 'react';
import Connect4Setup from '../../components/setup/Connect4Setup';
import Connect4Board from '../../components/game/Connect4Board';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import TournamentBracket from '../../components/tournament/TournamentBracket';
import { CONNECT4_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';
import { useTournament, getFirstTournamentMatch } from '../../contexts/TournamentContext';

const ROWS = 6;
const COLS = 7;

const Connect4 = ({ onExit }) => {
    const [gameState, setGameState] = useState('setup');
    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => new Array(COLS).fill(null)));
    const [winner, setWinner] = useState(null);
    const [winningCells, setWinningCells] = useState([]);
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);
    const [showBracket, setShowBracket] = useState(false);

    const { tournament, startTournament, recordTournamentResult, endTournament, getCurrentMatch } = useTournament();

    const initializeGrid = () => {
        setGrid(Array.from({ length: ROWS }, () => new Array(COLS).fill(null)));
        setCurrentPlayerIndex(0);
        setWinner(null);
        setWinningCells([]);
        setGameState('playing');
    };

    useEffect(() => {
        if (!tournament?.isActive || tournament?.isComplete) return;
        const match = getCurrentMatch();
        if (!match || match.isBye) return;
        setPlayers([match.p1, match.p2]);
        initializeGrid();
    }, [tournament?.currentRound, tournament?.currentMatchInRound]);

    const handleSetupComplete = (setupData) => {
        if (setupData.tournament) {
            const firstMatch = getFirstTournamentMatch(setupData.tournament);
            if (firstMatch) setPlayers([firstMatch.p1, firstMatch.p2]);
            startTournament(setupData.tournament);
        } else {
            setPlayers(setupData.players);
            setCompetitiveMode(setupData.competitiveMode);
            setTurnTime(setupData.turnTime);
        }
        initializeGrid();
    };

    const checkVictory = (newGrid, r, c, playerIdx) => {
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (const [dr, dc] of directions) {
            let cells = [[r, c]];
            for (let i = 1; i < 4; i++) {
                const nr = r + dr * i, nc = c + dc * i;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc] === playerIdx) cells.push([nr, nc]); else break;
            }
            for (let i = 1; i < 4; i++) {
                const nr = r - dr * i, nc = c - dc * i;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc] === playerIdx) cells.push([nr, nc]); else break;
            }
            if (cells.length >= 4) return cells;
        }
        return null;
    };

    const handleColumnClick = useCallback((col) => {
        if (gameState !== 'playing') return;
        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) { if (grid[r][col] === null) { row = r; break; } }
        if (row === -1) return;
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = currentPlayerIndex;
        setGrid(newGrid);
        const winCells = checkVictory(newGrid, row, col, currentPlayerIndex);
        if (winCells) { setWinningCells(winCells); setWinner([players[currentPlayerIndex]]); setGameState('finished'); }
        else {
            const isBoardFull = newGrid.every(r => r.every(cell => cell !== null));
            if (isBoardFull) { setGameState('finished'); setWinner([]); }
            else setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }
    }, [grid, gameState, currentPlayerIndex, players]);

    const resetGame = () => initializeGrid();

    const handleTimeOut = useCallback(() => {
        const availableCols = [];
        for (let col = 0; col < COLS; col++) { if (grid[0][col] === null) availableCols.push(col); }
        if (availableCols.length === 0) return;
        handleColumnClick(availableCols[Math.floor(Math.random() * availableCols.length)]);
    }, [grid, handleColumnClick]);

    const handleNextMatch = () => {
        const isDraw = winner && winner.length === 0;
        recordTournamentResult(isDraw ? null : (winner?.[0] ?? null), isDraw);
    };

    const isTournamentMatch = !!tournament?.isActive;
    const activeCompetitiveMode = isTournamentMatch ? (tournament?.competitiveMode ?? false) : competitiveMode;
    const activeTurnTime = isTournamentMatch ? (tournament?.turnTime ?? 0) : turnTime;

    const contextValue = {
        players, currentPlayerIndex, scores: { P1: 0, P2: 0 }, gameStatus: gameState,
        gameTitle: "Conecta 4", rules: CONNECT4_RULES,
        competitiveMode: activeCompetitiveMode, turnTime: activeTurnTime,
        onTimeOut: activeCompetitiveMode ? handleTimeOut : null
    };

    return (
        <div className="w-full flex flex-col items-center">
            {gameState === 'setup' && (
                <Connect4Setup onComplete={handleSetupComplete} onBack={() => { endTournament(); onExit(); }}
                    initialPlayers={players.length ? players : null} initialCompetitiveMode={competitiveMode} initialTurnTime={turnTime} />
            )}
            {(gameState === 'playing' || gameState === 'finished') && (
                <GameProvider value={contextValue}>
                    <GameLayout onExit={() => { endTournament(); onExit(); }} onReset={resetGame}
                        onConfig={() => { endTournament(); setGameState('setup'); }}
                        onShowTournament={isTournamentMatch ? () => setShowBracket(true) : null}
                        tacticalHint="Objetivo: 4 en línea • Gravedad activa">
                        {gameState === 'playing' ? (
                            <Connect4Board grid={grid} onColumnClick={handleColumnClick} winningCells={winningCells} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <GameResult winners={winner} isDraw={winner && winner.length === 0}
                                    onReplay={resetGame} onSetup={() => setGameState('setup')}
                                    isTournamentMatch={isTournamentMatch}
                                    onNextMatch={isTournamentMatch ? handleNextMatch : null}
                                    onShowBracket={isTournamentMatch ? () => setShowBracket(true) : null}
                                    tournament={tournament} />
                            </div>
                        )}
                    </GameLayout>
                    {showBracket && <TournamentBracket tournament={tournament} onClose={() => setShowBracket(false)} />}
                </GameProvider>
            )}
        </div>
    );
};

export default Connect4;
