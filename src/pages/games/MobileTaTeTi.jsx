import { useState, useCallback, useEffect } from 'react';
import PlayerSetup from '../../components/setup/PlayerSetup';
import MobileTaTeTiBoard from '../../components/game/MobileTaTeTiBoard';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import TournamentBracket from '../../components/tournament/TournamentBracket';
import { GameProvider } from '../../contexts/GameContext';
import { MOBILE_TATETI_RULES } from '../../constants/gameRules';
import { useTournament, getFirstTournamentMatch } from '../../contexts/TournamentContext';

const WIN_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const checkVictory = (board, playerIdx) => WIN_LINES.find(line => line.every(i => board[i] === playerIdx)) ?? null;
const getAdjacent = (idx) => {
    const r = Math.floor(idx / 3), c = idx % 3;
    const adj = [];
    for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) adj.push(nr * 3 + nc);
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
    const [showBracket, setShowBracket] = useState(false);

    const [board, setBoard] = useState(Array(9).fill(null));
    const [phase, setPhase] = useState('placement');
    const [piecesPlaced, setPiecesPlaced] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState(null);
    const [gameState, setGameState] = useState('setup');

    const { tournament, startTournament, recordTournamentResult, endTournament, getCurrentMatch } = useTournament();

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setPhase('placement');
        setPiecesPlaced(0);
        setSelectedIdx(null);
        setCurrentPlayerIndex(0);
        setWinner(null);
        setWinningLine(null);
        setGameState('playing');
    };

    useEffect(() => {
        if (!tournament?.isActive || tournament?.isComplete) return;
        const match = getCurrentMatch();
        if (!match || match.isBye) return;
        setPlayers([match.p1, match.p2]);
        resetGame();
    }, [tournament?.currentRound, tournament?.currentMatchInRound]);

    const handleSetupComplete = ({ players: playersObj, competitiveMode: cm, turnTime: tt, tournament: tournamentCfg }) => {
        if (tournamentCfg) {
            const firstMatch = getFirstTournamentMatch(tournamentCfg);
            if (firstMatch) setPlayers([firstMatch.p1, firstMatch.p2]);
            startTournament(tournamentCfg);
        } else {
            setPlayers([playersObj.P1, playersObj.P2]);
            setCompetitiveMode(cm ?? false);
            setTurnTime(tt ?? 0);
        }
        resetGame();
        setSetupMode(false);
    };

    const handleCellClick = useCallback((idx) => {
        if (gameState !== 'playing') return;
        if (phase === 'placement') {
            if (board[idx] !== null) return;
            const newBoard = [...board]; newBoard[idx] = currentPlayerIndex;
            const newPiecesPlaced = piecesPlaced + 1;
            const line = checkVictory(newBoard, currentPlayerIndex);
            if (line) { setBoard(newBoard); setWinningLine(line); setWinner(players[currentPlayerIndex]); setGameState('finished'); return; }
            setBoard(newBoard); setPiecesPlaced(newPiecesPlaced);
            if (newPiecesPlaced >= TOTAL_PIECES) setPhase('movement');
            setCurrentPlayerIndex(1 - currentPlayerIndex);
        } else {
            if (selectedIdx === null) {
                if (board[idx] === currentPlayerIndex) setSelectedIdx(idx);
            } else {
                if (idx === selectedIdx) { setSelectedIdx(null); }
                else if (board[idx] === null && getAdjacent(selectedIdx).includes(idx)) {
                    const newBoard = [...board]; newBoard[idx] = newBoard[selectedIdx]; newBoard[selectedIdx] = null; setSelectedIdx(null);
                    const line = checkVictory(newBoard, currentPlayerIndex);
                    if (line) { setBoard(newBoard); setWinningLine(line); setWinner(players[currentPlayerIndex]); setGameState('finished'); return; }
                    setBoard(newBoard); setCurrentPlayerIndex(1 - currentPlayerIndex);
                } else if (board[idx] === currentPlayerIndex) { setSelectedIdx(idx); }
            }
        }
    }, [board, phase, piecesPlaced, selectedIdx, currentPlayerIndex, players, gameState]);

    const handleTimeOut = useCallback(() => {
        if (phase === 'placement') {
            const empties = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
            if (empties.length === 0) return;
            handleCellClick(empties[Math.floor(Math.random() * empties.length)]);
        } else {
            const moves = [];
            board.forEach((v, from) => { if (v !== currentPlayerIndex) return; getAdjacent(from).forEach(to => { if (board[to] === null) moves.push([from, to]); }); });
            if (moves.length === 0) return;
            const [from, to] = moves[Math.floor(Math.random() * moves.length)];
            const newBoard = [...board]; newBoard[to] = newBoard[from]; newBoard[from] = null;
            const line = checkVictory(newBoard, currentPlayerIndex);
            setBoard(newBoard); setSelectedIdx(null);
            if (line) { setWinningLine(line); setWinner(players[currentPlayerIndex]); setGameState('finished'); }
            else setCurrentPlayerIndex(1 - currentPlayerIndex);
        }
    }, [board, phase, currentPlayerIndex, players, handleCellClick]);

    const handleNextMatch = () => { recordTournamentResult(winner, false); };

    const validTargets = selectedIdx !== null ? getAdjacent(selectedIdx).filter(i => board[i] === null) : [];
    const tacticalHint = phase === 'placement' ? `Colocación · ${piecesPlaced}/${TOTAL_PIECES} piezas` : 'Fase de Movimiento · Seleccioná una pieza';

    const isTournamentMatch = !!tournament?.isActive;
    const activeCompetitiveMode = isTournamentMatch ? (tournament?.competitiveMode ?? false) : competitiveMode;
    const activeTurnTime = isTournamentMatch ? (tournament?.turnTime ?? 0) : turnTime;

    const contextValue = {
        players, currentPlayerIndex, scores: {}, gameStatus: gameState,
        gameTitle: 'Tatetí Móvil', rules: MOBILE_TATETI_RULES,
        competitiveMode: activeCompetitiveMode, turnTime: activeTurnTime,
        onTimeOut: activeCompetitiveMode ? handleTimeOut : null,
    };

    if (setupMode) return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <PlayerSetup title="Tatetí Móvil" onComplete={handleSetupComplete}
                onBack={() => { endTournament(); onExit(); }}
                initialPlayers={players.length ? { P1: players[0], P2: players[1] } : null}
                initialCompetitiveMode={competitiveMode} initialTurnTime={turnTime} />
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <GameProvider value={contextValue}>
                <GameLayout onExit={() => { endTournament(); onExit(); }} onReset={resetGame}
                    onConfig={() => { endTournament(); setSetupMode(true); }}
                    onShowTournament={isTournamentMatch ? () => setShowBracket(true) : null} tacticalHint={tacticalHint}>
                    {gameState !== 'finished' ? (
                        <MobileTaTeTiBoard board={board} phase={phase} selectedIdx={selectedIdx} validTargets={validTargets}
                            players={players} currentPlayerIndex={currentPlayerIndex} onCellClick={handleCellClick} winningLine={winningLine} />
                    ) : (
                        <GameResult winners={winner ? [winner] : []} isDraw={false}
                            onReplay={resetGame} onSetup={() => { resetGame(); setSetupMode(true); }}
                            isTournamentMatch={isTournamentMatch}
                            onNextMatch={isTournamentMatch ? handleNextMatch : null}
                            onShowBracket={isTournamentMatch ? () => setShowBracket(true) : null}
                            tournament={tournament} />
                    )}
                </GameLayout>
                {showBracket && <TournamentBracket tournament={tournament} onClose={() => setShowBracket(false)} />}
            </GameProvider>
        </div>
    );
};

export default MobileTaTeTi;
