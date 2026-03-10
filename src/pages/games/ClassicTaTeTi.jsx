import { useState, useCallback, useEffect } from 'react';
import Board from '../../components/game/Board';
import PlayerSetup from '../../components/setup/PlayerSetup';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import TournamentBracket from '../../components/tournament/TournamentBracket';
import { CLASSIC_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';
import { DEFAULT_PLAYERS } from '../../constants/playerConfig';
import { useTournament, getFirstTournamentMatch } from '../../contexts/TournamentContext';

const ClassicTaTeTi = ({ onExit }) => {
    const [setupMode, setSetupMode] = useState(true);
    const [players, setPlayers] = useState({
        P1: DEFAULT_PLAYERS[0],
        P2: DEFAULT_PLAYERS[1]
    });
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);
    const [showBracket, setShowBracket] = useState(false);

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const { tournament, startTournament, recordTournamentResult, endTournament, getCurrentMatch } = useTournament();

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    // Al avanzar de match (currentRound/currentMatchInRound cambian), actualizar jugadores y tablero
    // NOTA: también se dispara al iniciar el torneo (undefined→0) pero setPlayers y resetGame son idempotentes
    useEffect(() => {
        if (!tournament?.isActive || tournament?.isComplete) return;
        const match = getCurrentMatch();
        if (!match || match.isBye) return;
        setPlayers({ P1: match.p1, P2: match.p2 });
        resetGame();
    }, [tournament?.currentRound, tournament?.currentMatchInRound]);

    const handleSetupComplete = (setupData) => {
        if (setupData.tournament) {
            // Asignar jugadores del primer match síncronamente (el dispatch es asíncrono)
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
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
        }
        if (cells.every(cell => cell !== null)) return 'DRAW';
        return null;
    };

    const handleCellClick = (index) => {
        if (winner || board[index]) return;
        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        const win = checkWinner(newBoard);
        if (win) setWinner(win);
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const handleTimeOut = useCallback(() => {
        const emptyCells = board.reduce((acc, cell, idx) => { if (cell === null) acc.push(idx); return acc; }, []);
        if (emptyCells.length === 0) return;
        handleCellClick(emptyCells[Math.floor(Math.random() * emptyCells.length)]);
    }, [board, handleCellClick]);

    // Registra el resultado — el useEffect se encarga del reset al avanzar;
    // si es el último match, el winner local queda para mostrar el campeón en GameResult
    const handleNextMatch = () => {
        const isDraw = winner === 'DRAW';
        const winnerPlayer = isDraw ? null : (winner === 'X' ? players.P1 : players.P2);
        recordTournamentResult(winnerPlayer, isDraw);
    };

    const playersList = [players.P1, players.P2];
    const currentPlayerIndex = isXNext ? 0 : 1;
    const isTournamentMatch = !!tournament?.isActive;
    const activeCompetitiveMode = isTournamentMatch ? (tournament?.competitiveMode ?? false) : competitiveMode;
    const activeTurnTime = isTournamentMatch ? (tournament?.turnTime ?? 0) : turnTime;

    const contextValue = {
        players: playersList,
        currentPlayerIndex,
        scores: { P1: 0, P2: 0 },
        gameStatus: winner ? 'finished' : 'playing',
        gameTitle: "Ta-Te-Ti Clásico",
        rules: CLASSIC_RULES,
        competitiveMode: activeCompetitiveMode,
        turnTime: activeTurnTime,
        onTimeOut: activeCompetitiveMode ? handleTimeOut : null
    };

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {setupMode ? (
                <PlayerSetup
                    title="Ta-Te-Ti Clásico"
                    onComplete={handleSetupComplete}
                    onBack={() => { endTournament(); onExit(); }}
                    initialPlayers={players}
                    initialCompetitiveMode={competitiveMode}
                    initialTurnTime={turnTime}
                />
            ) : (
                <GameProvider value={contextValue}>
                    <GameLayout
                        onExit={() => { endTournament(); onExit(); }}
                        onReset={resetGame}
                        onConfig={() => { endTournament(); setSetupMode(true); }}
                        onShowTournament={isTournamentMatch ? () => setShowBracket(true) : null}
                        tacticalHint="Objetivo: 3 en línea"
                    >
                        {winner ? (
                            <GameResult
                                winners={winner === 'DRAW' ? playersList : [winner === 'X' ? players.P1 : players.P2]}
                                isDraw={winner === 'DRAW'}
                                onReplay={resetGame}
                                onSetup={() => { resetGame(); setSetupMode(true); }}
                                isTournamentMatch={isTournamentMatch}
                                onNextMatch={isTournamentMatch ? handleNextMatch : null}
                                onShowBracket={isTournamentMatch ? () => setShowBracket(true) : null}
                                tournament={tournament}
                            />
                        ) : (
                            <div className="w-full aspect-square max-w-md mx-auto">
                                <Board cells={board} onCellClick={handleCellClick} level="super" isSelectable={!winner} />
                            </div>
                        )}
                    </GameLayout>

                    {/* Modal de bracket del torneo */}
                    {showBracket && (
                        <TournamentBracket tournament={tournament} onClose={() => setShowBracket(false)} />
                    )}
                </GameProvider>
            )}
        </div>
    );
};

export default ClassicTaTeTi;
