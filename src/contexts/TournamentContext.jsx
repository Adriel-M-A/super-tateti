import { createContext, useContext, useReducer, useCallback } from 'react';

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

/** Genera los matches de una ronda de eliminación directa. Los impares reciben bye. */
function generateEliminationRound(players, roundIdx) {
    const matches = [];
    for (let i = 0; i < players.length; i += 2) {
        if (i + 1 < players.length) {
            matches.push({ id: `r${roundIdx}-m${Math.floor(i / 2)}`, p1: players[i], p2: players[i + 1], winner: null, isDraw: false, isBye: false, round: roundIdx });
        } else {
            // Último jugador impar → bye (avanza automáticamente)
            matches.push({ id: `r${roundIdx}-bye-${i}`, p1: players[i], p2: null, winner: players[i], isDraw: false, isBye: true, round: roundIdx });
        }
    }
    return matches;
}

/** Genera todos los pares C(N,2) para round-robin. */
function generateRoundRobin(players) {
    const matches = [];
    let idx = 0;
    for (let i = 0; i < players.length; i++)
        for (let j = i + 1; j < players.length; j++)
            matches.push({ id: `rr-${idx++}`, p1: players[i], p2: players[j], winner: null, isDraw: false, isBye: false, round: 0 });
    return matches;
}

/**
 * Calcula síncrona y deterministicamente los jugadores del primer match de un torneo.
 * Útil para asignarlos antes de que el dispatch de startTournament haya actualizado el estado.
 */
export function getFirstTournamentMatch(config) {
    const { format, allPlayers } = config;
    if (!allPlayers || allPlayers.length < 2) return null;
    if (format === 'best-of-3' || format === 'best-of-5') {
        return { p1: allPlayers[0], p2: allPlayers[1] };
    }
    if (format === 'elimination') {
        // La semilla de shuffle está determinada por el reducer (Math.random), así que aquí
        // usamos el orden que ya tiene allPlayers (que viene de TournamentSection post-shuffle).
        // El primer match real es el primer par no-bye.
        for (let i = 0; i < allPlayers.length; i += 2) {
            if (i + 1 < allPlayers.length) return { p1: allPlayers[i], p2: allPlayers[i + 1] };
        }
    }
    if (format === 'round-robin') {
        return { p1: allPlayers[0], p2: allPlayers[1] };
    }
    return null;
}

// ────────────────────────────────────────────────
// Reducer
// ────────────────────────────────────────────────

function tournamentReducer(state, action) {
    if (action.type === 'START') {
        const { gameType, format, drawResolution, allPlayers, competitiveMode = false, turnTime = 0 } = action.payload;

        // ── Mejor de N ──
        if (format === 'best-of-3' || format === 'best-of-5') {
            return {
                isActive: true, gameType, format, drawResolution: 'replay', allPlayers,
                competitiveMode, turnTime,
                targetWins: format === 'best-of-3' ? 2 : 3,
                winsP1: 0, winsP2: 0, matchHistory: [],
                rounds: [[{ id: 'bo-0', p1: allPlayers[0], p2: allPlayers[1], winner: null, isDraw: false, isBye: false, round: 0 }]],
                currentRound: 0, currentMatchInRound: 0, standings: {}, isComplete: false, champion: null,
            };
        }

        // ── Eliminación directa ──
        if (format === 'elimination') {
            // allPlayers ya viene shuffleado desde TournamentSection
            const round0 = generateEliminationRound(allPlayers, 0);
            const firstReal = round0.findIndex(m => !m.isBye);
            return {
                isActive: true, gameType, format, drawResolution, allPlayers,
                competitiveMode, turnTime,
                targetWins: null, winsP1: 0, winsP2: 0, matchHistory: [],
                rounds: [round0], currentRound: 0, currentMatchInRound: firstReal !== -1 ? firstReal : 0,
                standings: {}, isComplete: false, champion: null,
            };
        }

        // ── Round-Robin ──
        if (format === 'round-robin') {
            const allMatches = generateRoundRobin(allPlayers);
            const standings = {};
            allPlayers.forEach(p => { standings[p.id] = { wins: 0, draws: 0, losses: 0, points: 0 }; });
            return {
                isActive: true, gameType, format, drawResolution: 'replay', allPlayers,
                competitiveMode, turnTime,
                targetWins: null, winsP1: 0, winsP2: 0, matchHistory: [],
                rounds: [allMatches], currentRound: 0, currentMatchInRound: 0,
                standings, isComplete: false, champion: null,
            };
        }
        return state;
    }

    if (action.type === 'RECORD_RESULT') {
        const { winner, isDraw } = action.payload;
        const { format, currentRound, currentMatchInRound, rounds } = state;

        // ── Mejor de N ──
        if (format === 'best-of-3' || format === 'best-of-5') {
            const newHistory = [...state.matchHistory, { winner, isDraw }];
            if (isDraw) return { ...state, matchHistory: newHistory }; // re-jugar
            const newWinsP1 = state.winsP1 + (winner?.id === state.allPlayers[0].id ? 1 : 0);
            const newWinsP2 = state.winsP2 + (winner?.id === state.allPlayers[1].id ? 1 : 0);
            if (newWinsP1 >= state.targetWins)
                return { ...state, winsP1: newWinsP1, winsP2: newWinsP2, matchHistory: newHistory, isComplete: true, champion: state.allPlayers[0] };
            if (newWinsP2 >= state.targetWins)
                return { ...state, winsP1: newWinsP1, winsP2: newWinsP2, matchHistory: newHistory, isComplete: true, champion: state.allPlayers[1] };
            return { ...state, winsP1: newWinsP1, winsP2: newWinsP2, matchHistory: newHistory };
        }

        // ── Eliminación directa ──
        if (format === 'elimination') {
            const currentMatch = rounds[currentRound][currentMatchInRound];
            if (isDraw) {
                if (state.drawResolution === 'replay')
                    return { ...state, matchHistory: [...state.matchHistory, { winner: null, isDraw: true }] };
                // Aleatorio
                const rnd = Math.random() < 0.5 ? currentMatch.p1 : currentMatch.p2;
                return tournamentReducer(state, { type: 'RECORD_RESULT', payload: { winner: rnd, isDraw: false } });
            }
            const updatedRounds = rounds.map((round, ri) =>
                ri === currentRound ? round.map((m, mi) => mi === currentMatchInRound ? { ...m, winner } : m) : round
            );
            const nextInRound = rounds[currentRound].findIndex((m, mi) => mi > currentMatchInRound && !m.isBye);
            if (nextInRound !== -1)
                return { ...state, rounds: updatedRounds, currentMatchInRound: nextInRound, matchHistory: [...state.matchHistory, { winner, isDraw: false }] };

            // Ronda terminada — recopilar ganadores
            const roundWinners = updatedRounds[currentRound].map(m => m.winner).filter(Boolean);
            if (roundWinners.length === 1)
                return { ...state, rounds: updatedRounds, isComplete: true, champion: roundWinners[0], matchHistory: [...state.matchHistory, { winner, isDraw: false }] };

            const nextRound = generateEliminationRound(roundWinners, currentRound + 1);
            const firstReal = nextRound.findIndex(m => !m.isBye);
            return {
                ...state, rounds: [...updatedRounds, nextRound],
                currentRound: currentRound + 1, currentMatchInRound: firstReal !== -1 ? firstReal : 0,
                matchHistory: [...state.matchHistory, { winner, isDraw: false }],
            };
        }

        // ── Round-Robin ──
        if (format === 'round-robin') {
            const currentMatch = rounds[0][currentMatchInRound];
            const newStandings = JSON.parse(JSON.stringify(state.standings));
            if (isDraw) {
                newStandings[currentMatch.p1.id].draws++;
                newStandings[currentMatch.p1.id].points++;
                newStandings[currentMatch.p2.id].draws++;
                newStandings[currentMatch.p2.id].points++;
            } else {
                const loser = currentMatch.p1.id === winner.id ? currentMatch.p2 : currentMatch.p1;
                newStandings[winner.id].wins++;
                newStandings[winner.id].points += 3;
                newStandings[loser.id].losses++;
            }
            const updatedRounds = [rounds[0].map((m, mi) => mi === currentMatchInRound ? { ...m, winner: isDraw ? null : winner, isDraw } : m)];
            const nextIdx = currentMatchInRound + 1;
            if (nextIdx >= rounds[0].length) {
                const champion = state.allPlayers.reduce((best, p) =>
                    newStandings[p.id].points > newStandings[best.id].points ? p : best
                );
                return { ...state, rounds: updatedRounds, standings: newStandings, currentMatchInRound: nextIdx, isComplete: true, champion, matchHistory: [...state.matchHistory, { winner: isDraw ? null : winner, isDraw }] };
            }
            return { ...state, rounds: updatedRounds, standings: newStandings, currentMatchInRound: nextIdx, matchHistory: [...state.matchHistory, { winner: isDraw ? null : winner, isDraw }] };
        }
    }

    if (action.type === 'END') return null;
    return state;
}

// ────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────

const TournamentContext = createContext(null);

export function TournamentProvider({ children }) {
    const [tournament, dispatch] = useReducer(tournamentReducer, null);

    const startTournament = useCallback((config) => {
        dispatch({ type: 'START', payload: config });
    }, []);

    const recordTournamentResult = useCallback((winner, isDraw) => {
        dispatch({ type: 'RECORD_RESULT', payload: { winner, isDraw } });
    }, []);

    const endTournament = useCallback(() => {
        dispatch({ type: 'END' });
    }, []);

    /** Retorna el match {p1, p2} actual, o null si no hay torneo activo. */
    const getCurrentMatch = useCallback(() => {
        if (!tournament?.isActive) return null;
        return tournament.rounds[tournament.currentRound]?.[tournament.currentMatchInRound] ?? null;
    }, [tournament]);

    return (
        <TournamentContext.Provider value={{ tournament, startTournament, recordTournamentResult, endTournament, getCurrentMatch }}>
            {children}
        </TournamentContext.Provider>
    );
}

export function useTournament() {
    return useContext(TournamentContext) ?? {
        tournament: null,
        startTournament: () => { },
        recordTournamentResult: () => { },
        endTournament: () => { },
        getCurrentMatch: () => null,
    };
}
