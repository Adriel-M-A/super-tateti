import { useState, useCallback } from 'react';
import { COLOR_OPTIONS, ICON_OPTIONS, DEFAULT_PLAYERS } from '../constants/playerConfig';

// Re-exportar para compatibilidad con imports existentes
export { COLOR_OPTIONS, ICON_OPTIONS };

const usePlayerSetup = (initialPlayersCount = 2, maxPlayers = 5, initialPlayers = null) => {
    const [players, setPlayers] = useState(() => {
        if (initialPlayers) {
            // Si vienen como objeto (P1, P2) los convertimos a array, si no los usamos tal cual
            const baseArray = Array.isArray(initialPlayers) ? initialPlayers : Object.values(initialPlayers);

            return Array.from({ length: maxPlayers }, (_, i) => {
                if (baseArray[i]) return baseArray[i];
                return DEFAULT_PLAYERS[i] ?? {
                    id: `P${i + 1}`,
                    name: `Jugador ${i + 1}`,
                    icon: ICON_OPTIONS[i % ICON_OPTIONS.length].id,
                    color: COLOR_OPTIONS[i % COLOR_OPTIONS.length].hex
                };
            });
        }

        return Array.from({ length: maxPlayers }, (_, i) => DEFAULT_PLAYERS[i] ?? {
            id: `P${i + 1}`,
            name: `Jugador ${i + 1}`,
            icon: ICON_OPTIONS[i % ICON_OPTIONS.length].id,
            color: COLOR_OPTIONS[i % COLOR_OPTIONS.length].hex
        });
    });

    const updatePlayer = useCallback((index, updates) => {
        setPlayers(prev => {
            const next = [...prev];
            next[index] = { ...next[index], ...updates };
            return next;
        });
    }, []);

    return {
        players,
        setPlayers,
        updatePlayer,
        // Helper para obtener solo los jugadores activos según el juego
        getVisiblePlayers: (count) => players.slice(0, count),
        // Helper para obtener iconos/colores tomados entre un grupo de jugadores
        getTakenResources: (activePlayers) => ({
            takenIcons: activePlayers.map(p => p.icon),
            takenColors: activePlayers.map(p => p.color)
        })
    };
};

export default usePlayerSetup;
