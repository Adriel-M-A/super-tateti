import { useState, useCallback, useEffect } from 'react';
import GobbletSetup from '../../components/setup/GobbletSetup';
import GobbletBoard from '../../components/game/GobbletBoard';
import GobbletExternalPiles from '../../components/game/GobbletExternalPiles';
import GameLayout from '../../components/layout/GameLayout';
import GameResult from '../../components/game/GameResult';
import TournamentBracket from '../../components/tournament/TournamentBracket';
import { GOBBLET_RULES } from '../../constants/gameRules';
import { GameProvider } from '../../contexts/GameContext';
import { useTournament, getFirstTournamentMatch } from '../../contexts/TournamentContext';

// Configuración de piezas según tamaño de tablero
const BOARD_CONFIGS = {
    3: { sizes: [2, 3, 4], piecesPerSize: 3 },
    4: { sizes: [2, 3, 4], piecesPerSize: 4 },
    5: { sizes: [1, 2, 3, 4], piecesPerSize: 5 }
};

const buildExternalPiles = (players, boardSize) => {
    const { sizes, piecesPerSize } = BOARD_CONFIGS[boardSize];
    const piles = {};
    players.forEach(player => {
        piles[player.id] = [...sizes].reverse().map(size =>
            Array.from({ length: piecesPerSize }, () => ({ playerId: player.id, size }))
        );
    });
    return piles;
};

const buildBoard = (size) =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => []));

const checkVictory = (board, size, playerId) => {
    const top = (r, c) => { const s = board[r][c]; return s.length ? s[s.length - 1] : null; };
    const ok = (r, c) => { const t = top(r, c); return t && t.playerId === playerId; };
    const line = (cells) => cells.every(([r, c]) => ok(r, c));
    const range = Array.from({ length: size }, (_, i) => i);
    return (
        range.some(r => line(range.map(c => [r, c]))) ||
        range.some(c => line(range.map(r => [r, c]))) ||
        line(range.map(i => [i, i])) ||
        line(range.map(i => [i, size - 1 - i]))
    );
};

const Gobblet = ({ onExit }) => {
    const [gameState, setGameState] = useState('setup');
    const [players, setPlayers] = useState([]);
    const [boardSize, setBoardSize] = useState(4);
    const [board, setBoard] = useState([]);
    const [externalPiles, setExternalPiles] = useState({});
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [winner, setWinner] = useState(null);
    const [competitiveMode, setCompetitiveMode] = useState(false);
    const [turnTime, setTurnTime] = useState(0);
    const [showBracket, setShowBracket] = useState(false);

    const { tournament, startTournament, recordTournamentResult, endTournament, getCurrentMatch } = useTournament();

    const resetBoard = (ps, sz) => {
        const safePs = ps || players;
        const safeSz = sz || boardSize;
        setBoard(buildBoard(safeSz));
        setExternalPiles(buildExternalPiles(safePs, safeSz));
        setCurrentPlayerIndex(0);
        setSelected(null);
        setWinner(null);
        setGameState('playing');
    };

    // Al avanzar de match, actualizar jugadores y resetear el tablero
    useEffect(() => {
        if (!tournament?.isActive || tournament?.isComplete) return;
        const match = getCurrentMatch();
        if (!match || match.isBye) return;
        const newPlayers = [match.p1, match.p2];
        setPlayers(newPlayers);
        resetBoard(newPlayers, boardSize);
    }, [tournament?.currentRound, tournament?.currentMatchInRound]);

    const initializeGame = (setupData) => {
        const { players: ps, boardSize: size, competitiveMode: cm, turnTime: tt, tournament: tournamentCfg } = setupData;
        const sz = size ?? boardSize;
        if (tournamentCfg) {
            const firstMatch = getFirstTournamentMatch(tournamentCfg);
            const initialPlayers = firstMatch ? [firstMatch.p1, firstMatch.p2] : ps;
            setPlayers(initialPlayers);
            setBoardSize(sz);
            startTournament(tournamentCfg);
            resetBoard(initialPlayers, sz);
        } else {
            setCompetitiveMode(cm ?? false);
            setTurnTime(tt ?? 0);
            setPlayers(ps);
            setBoardSize(sz);
            resetBoard(ps, sz);
        }
    };

    const resetGame = () => resetBoard(players, boardSize);

    const isValidTarget = useCallback((r, c) => {
        if (!selected) return false;
        if (selected.source === 'board' && selected.r === r && selected.c === c) return false;
        const stack = board[r][c];
        return stack.length === 0 || selected.piece.size > stack[stack.length - 1].size;
    }, [selected, board]);

    const applyMove = (sel, r, c, brd, piles) => {
        const newBoard = brd.map(row => row.map(s => [...s]));
        let newPiles = piles;
        if (sel.source === 'external') {
            newPiles = { ...piles, [sel.playerId]: piles[sel.playerId].map((pile, idx) => idx === sel.pileIdx ? pile.slice(0, -1) : pile) };
        } else {
            newBoard[sel.r][sel.c] = newBoard[sel.r][sel.c].slice(0, -1);
        }
        newBoard[r][c] = [...newBoard[r][c], sel.piece];
        return { newBoard, newPiles };
    };

    const commitMove = (sel, r, c) => {
        const { newBoard, newPiles } = applyMove(sel, r, c, board, externalPiles);
        setBoard(newBoard);
        setExternalPiles(newPiles);
        setSelected(null);
        if (checkVictory(newBoard, boardSize, sel.piece.playerId)) {
            setWinner(players.find(p => p.id === sel.piece.playerId));
            setGameState('finished');
        } else {
            setCurrentPlayerIndex(1 - currentPlayerIndex);
        }
    };

    const handleCellClick = (r, c) => {
        if (gameState !== 'playing') return;
        const stack = board[r][c];
        const topPiece = stack.length ? stack[stack.length - 1] : null;
        const currentPlayerId = players[currentPlayerIndex].id;
        if (!selected) {
            if (topPiece?.playerId === currentPlayerId) setSelected({ source: 'board', r, c, piece: topPiece, playerId: currentPlayerId });
            return;
        }
        if (selected.source === 'board' && selected.r === r && selected.c === c) { setSelected(null); return; }
        if (isValidTarget(r, c)) { commitMove(selected, r, c); return; }
        if (topPiece?.playerId === currentPlayerId) setSelected({ source: 'board', r, c, piece: topPiece, playerId: currentPlayerId });
    };

    const handleSelectExternal = (playerId, pileIdx) => {
        if (playerId !== players[currentPlayerIndex].id) return;
        const pile = externalPiles[playerId]?.[pileIdx] ?? [];
        if (!pile.length) return;
        if (selected?.source === 'external' && selected.pileIdx === pileIdx && selected.playerId === playerId) { setSelected(null); return; }
        setSelected({ source: 'external', playerId, pileIdx, piece: pile[pile.length - 1] });
    };

    const handleTimeOut = useCallback(() => {
        const currentPlayerId = players[currentPlayerIndex].id;
        const canPlace = (piece, r, c) => { const s = board[r][c]; return s.length === 0 || piece.size > s[s.length - 1].size; };
        const moves = [];
        (externalPiles[currentPlayerId] ?? []).forEach((pile, pileIdx) => {
            if (!pile.length) return;
            const piece = pile[pile.length - 1];
            for (let r = 0; r < boardSize; r++)
                for (let c = 0; c < boardSize; c++)
                    if (canPlace(piece, r, c)) moves.push({ source: 'external', playerId: currentPlayerId, pileIdx, piece, r, c });
        });
        for (let fr = 0; fr < boardSize; fr++)
            for (let fc = 0; fc < boardSize; fc++) {
                const s = board[fr][fc];
                if (!s.length || s[s.length - 1].playerId !== currentPlayerId) continue;
                const piece = s[s.length - 1];
                for (let r = 0; r < boardSize; r++)
                    for (let c = 0; c < boardSize; c++)
                        if ((fr !== r || fc !== c) && canPlace(piece, r, c)) moves.push({ source: 'board', r: fr, c: fc, piece, destR: r, destC: c });
            }
        if (!moves.length) return;
        const mv = moves[Math.floor(Math.random() * moves.length)];
        const sel = mv.source === 'external' ? { source: 'external', playerId: mv.playerId, pileIdx: mv.pileIdx, piece: mv.piece } : { source: 'board', r: mv.r, c: mv.c, piece: mv.piece };
        const destR = mv.source === 'external' ? mv.r : mv.destR;
        const destC = mv.source === 'external' ? mv.c : mv.destC;
        const { newBoard, newPiles } = applyMove(sel, destR, destC, board, externalPiles);
        setBoard(newBoard);
        setExternalPiles(newPiles);
        setSelected(null);
        if (checkVictory(newBoard, boardSize, currentPlayerId)) { setWinner(players.find(p => p.id === currentPlayerId)); setGameState('finished'); }
        else setCurrentPlayerIndex(1 - currentPlayerIndex);
    }, [board, externalPiles, players, currentPlayerIndex, boardSize]);

    // Sin resetGame() — lo maneja el useEffect al detectar cambio de match
    const handleNextMatch = () => {
        recordTournamentResult(winner, false);
    };
    const isTournamentMatch = !!tournament?.isActive;
    const activeCompetitiveMode = isTournamentMatch ? (tournament?.competitiveMode ?? false) : competitiveMode;
    const activeTurnTime = isTournamentMatch ? (tournament?.turnTime ?? 0) : turnTime;

    const contextValue = {
        players,
        currentPlayerIndex,
        scores: {},
        gameStatus: gameState,
        gameTitle: "Gobblet",
        rules: GOBBLET_RULES,
        competitiveMode: activeCompetitiveMode,
        turnTime: activeTurnTime,
        onTimeOut: activeCompetitiveMode ? handleTimeOut : null
    };

    const getExternalSelected = (playerId) =>
        selected?.source === 'external' && selected.playerId === playerId ? selected : null;

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {gameState === 'setup' && (
                <GobbletSetup
                    onComplete={initializeGame}
                    onBack={() => { endTournament(); onExit(); }}
                    initialPlayers={players.length ? players : null}
                    initialBoardSize={boardSize}
                    initialCompetitiveMode={competitiveMode}
                    initialTurnTime={turnTime}
                />
            )}

            {(gameState === 'playing' || gameState === 'finished') && players.length >= 2 && (
                <GameProvider value={contextValue}>
                    <GameLayout
                        onExit={() => { endTournament(); onExit(); }}
                        onReset={resetGame}
                        onConfig={() => { endTournament(); setSelected(null); setGameState('setup'); }}
                        onShowTournament={isTournamentMatch ? () => setShowBracket(true) : null}
                        tacticalHint={`Gobblet ${boardSize}×${boardSize} • Cubre piezas más pequeñas`}
                    >
                        {gameState === 'playing' ? (
                            <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-3">
                                <GobbletBoard board={board} boardSize={boardSize} selected={selected} players={players} currentPlayerIndex={currentPlayerIndex} onCellClick={handleCellClick} isValidTarget={isValidTarget} />
                                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border w-full bg-page-text/5 border-page-text/10">
                                    <div className={`flex-1 flex justify-center transition-opacity duration-300 ${currentPlayerIndex === 0 ? 'opacity-100' : 'opacity-40'}`}>
                                        <GobbletExternalPiles piles={externalPiles[players[0]?.id] ?? []} player={players[0]} isCurrentPlayer={currentPlayerIndex === 0} selected={getExternalSelected(players[0]?.id)} onSelectPile={(pileIdx) => handleSelectExternal(players[0].id, pileIdx)} compact={boardSize === 5} />
                                    </div>
                                    <div className="w-px self-stretch bg-page-text/15 shrink-0" />
                                    <div className={`flex-1 flex justify-center transition-opacity duration-300 ${currentPlayerIndex === 1 ? 'opacity-100' : 'opacity-40'}`}>
                                        <GobbletExternalPiles piles={externalPiles[players[1]?.id] ?? []} player={players[1]} isCurrentPlayer={currentPlayerIndex === 1} selected={getExternalSelected(players[1]?.id)} onSelectPile={(pileIdx) => handleSelectExternal(players[1].id, pileIdx)} compact={boardSize === 5} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <GameResult
                                winners={winner ? [winner] : []}
                                isDraw={false}
                                onReplay={resetGame}
                                onSetup={() => { endTournament(); resetGame(); setGameState('setup'); }}
                                isTournamentMatch={isTournamentMatch}
                                onNextMatch={isTournamentMatch ? handleNextMatch : null}
                                onShowBracket={isTournamentMatch ? () => setShowBracket(true) : null}
                                tournament={tournament}
                            />
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

export default Gobblet;
