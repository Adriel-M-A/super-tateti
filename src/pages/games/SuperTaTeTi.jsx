import { useState, useCallback, useEffect } from 'react';
import Board from '../../components/game/Board';
import PlayerSetup from '../../components/setup/PlayerSetup';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import TournamentBracket from '../../components/tournament/TournamentBracket';
import { CLASSIC_RULES, SUPER_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';
import { DEFAULT_PLAYERS } from '../../constants/playerConfig';
import { useTournament, getFirstTournamentMatch } from '../../contexts/TournamentContext';

const SuperTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({ P1: DEFAULT_PLAYERS[0], P2: DEFAULT_PLAYERS[1] });
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);
    const [showBracket, setShowBracket] = useState(false);

    const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
    const [isXNext, setIsXNext] = useState(true);
    const [activeSubBoard, setActiveSubBoard] = useState(null);
    const [subBoardWinners, setSubBoardWinners] = useState(Array(9).fill(null));
    const [globalWinner, setGlobalWinner] = useState(null);

    const { tournament, startTournament, recordTournamentResult, endTournament, getCurrentMatch } = useTournament();

    const resetGame = () => {
        setBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
        setIsXNext(true);
        setActiveSubBoard(null);
        setSubBoardWinners(Array(9).fill(null));
        setGlobalWinner(null);
    };

    useEffect(() => {
        if (!tournament?.isActive || tournament?.isComplete) return;
        const match = getCurrentMatch();
        if (!match || match.isBye) return;
        setPlayers({ P1: match.p1, P2: match.p2 });
        resetGame();
    }, [tournament?.currentRound, tournament?.currentMatchInRound]);

    const handleSetupComplete = (setupData) => {
        if (setupData.tournament) {
            const firstMatch = getFirstTournamentMatch(setupData.tournament);
            if (firstMatch) setPlayers({ P1: firstMatch.p1, P2: firstMatch.p2 });
            startTournament(setupData.tournament);
        } else {
            setPlayers(setupData.players);
            setCompetitiveMode(setupData.competitiveMode);
            setTurnTime(setupData.turnTime);
        }
        resetGame();
        setSetupMode(false);
    };

    const checkWinner = (cells) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (const [a, b, c] of lines) {
            if (cells[a] && cells[a] !== 'DRAW' && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
            const xLine = [a, b, c].every(idx => cells[idx] === 'X' || cells[idx] === 'DRAW');
            const hasX = [a, b, c].some(idx => cells[idx] === 'X');
            if (xLine && hasX) return 'X';
            const oLine = [a, b, c].every(idx => cells[idx] === 'O' || cells[idx] === 'DRAW');
            const hasO = [a, b, c].some(idx => cells[idx] === 'O');
            if (oLine && hasO) return 'O';
        }
        return null;
    };

    const handleCellClick = (boardIndex, cellIndex) => {
        if (globalWinner || (activeSubBoard !== null && activeSubBoard !== boardIndex) || subBoardWinners[boardIndex] || board[boardIndex][cellIndex]) return;
        const newBoard = board.map((subBoard, bIdx) => {
            if (bIdx === boardIndex) { const ns = [...subBoard]; ns[cellIndex] = isXNext ? 'X' : 'O'; return ns; }
            return subBoard;
        });
        const newSubBoardWinners = [...subBoardWinners];
        const w = checkWinner(newBoard[boardIndex]);
        if (w) newSubBoardWinners[boardIndex] = w;
        else if (newBoard[boardIndex].every(cell => cell !== null)) newSubBoardWinners[boardIndex] = 'DRAW';
        const finalWinner = checkWinner(newSubBoardWinners);
        if (finalWinner) { setGlobalWinner(finalWinner); }
        else if (newSubBoardWinners.every(w => w !== null)) { setGlobalWinner('DRAW'); }
        let nextActiveSubBoard = cellIndex;
        if (newSubBoardWinners[nextActiveSubBoard]) nextActiveSubBoard = null;
        setBoard(newBoard);
        setSubBoardWinners(newSubBoardWinners);
        setIsXNext(!isXNext);
        setActiveSubBoard(nextActiveSubBoard);
    };

    const handleTimeOut = useCallback(() => {
        const validMoves = [];
        if (activeSubBoard !== null) {
            board[activeSubBoard].forEach((cell, cellIdx) => { if (cell === null) validMoves.push({ boardIdx: activeSubBoard, cellIdx }); });
        } else {
            board.forEach((subBoard, boardIdx) => {
                if (subBoardWinners[boardIdx]) return;
                subBoard.forEach((cell, cellIdx) => { if (cell === null) validMoves.push({ boardIdx, cellIdx }); });
            });
        }
        if (validMoves.length === 0) return;
        const { boardIdx, cellIdx } = validMoves[Math.floor(Math.random() * validMoves.length)];
        handleCellClick(boardIdx, cellIdx);
    }, [board, activeSubBoard, subBoardWinners, handleCellClick]);

    const handleNextMatch = () => {
        const isDraw = globalWinner === 'DRAW';
        recordTournamentResult(isDraw ? null : (globalWinner === 'X' ? players.P1 : players.P2), isDraw);
    };

    const playersList = [players.P1, players.P2];
    const currentPlayerIndex = isXNext ? 0 : 1;
    const isTournamentMatch = !!tournament?.isActive;
    const activeCompetitiveMode = isTournamentMatch ? (tournament?.competitiveMode ?? false) : competitiveMode;
    const activeTurnTime = isTournamentMatch ? (tournament?.turnTime ?? 0) : turnTime;

    const contextValue = {
        players: playersList, currentPlayerIndex, scores: { P1: 0, P2: 0 },
        gameStatus: globalWinner ? 'finished' : 'playing', gameTitle: "Super Ta-Te-Ti", rules: SUPER_RULES,
        competitiveMode: activeCompetitiveMode, turnTime: activeTurnTime,
        onTimeOut: activeCompetitiveMode ? handleTimeOut : null
    };

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {setupMode ? (
                <PlayerSetup title="Super Ta-Te-Ti" onComplete={handleSetupComplete}
                    onBack={() => { endTournament(); onExit(); }} initialPlayers={players}
                    initialCompetitiveMode={competitiveMode} initialTurnTime={turnTime} />
            ) : (
                <GameProvider value={contextValue}>
                    <GameLayout onExit={() => { endTournament(); onExit(); }} onReset={resetGame}
                        onConfig={() => { endTournament(); setSetupMode(true); }}
                        onShowTournament={isTournamentMatch ? () => setShowBracket(true) : null}
                        tacticalHint={activeSubBoard === null ? "Libertad de movimiento" : `Casilla Requerida: ${activeSubBoard + 1}`}>
                        {globalWinner ? (
                            <GameResult
                                winners={globalWinner === 'DRAW' ? [] : [globalWinner === 'X' ? players.P1 : players.P2]}
                                isDraw={globalWinner === 'DRAW'}
                                onReplay={resetGame} onSetup={() => { resetGame(); setSetupMode(true); }}
                                isTournamentMatch={isTournamentMatch}
                                onNextMatch={isTournamentMatch ? handleNextMatch : null}
                                onShowBracket={isTournamentMatch ? () => setShowBracket(true) : null}
                                tournament={tournament}
                            />
                        ) : (
                            <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
                                <Board cells={board} onCellClick={handleCellClick} activeSubBoard={activeSubBoard} subBoardWinners={subBoardWinners} />
                            </div>
                        )}
                    </GameLayout>
                    {showBracket && <TournamentBracket tournament={tournament} onClose={() => setShowBracket(false)} />}
                </GameProvider>
            )}
        </div>
    );
};

export default SuperTaTeTi;
