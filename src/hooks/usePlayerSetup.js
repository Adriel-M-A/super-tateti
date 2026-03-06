import { useState, useCallback } from 'react';

export const COLOR_OPTIONS = [
    { id: 'blue', hex: '#3b82f6', label: 'Azul', bg: 'bg-blue-500' },
    { id: 'red', hex: '#ef4444', label: 'Rojo', bg: 'bg-red-500' },
    { id: 'green', hex: '#22c55e', label: 'Verde', bg: 'bg-green-500' },
    { id: 'yellow', hex: '#eab308', label: 'Amarillo', bg: 'bg-yellow-500' },
    { id: 'orange', hex: '#f97316', label: 'Naranja', bg: 'bg-orange-500' },
    { id: 'purple', hex: '#a855f7', label: 'Púrpura', bg: 'bg-purple-500' },
    { id: 'pink', hex: '#ec4899', label: 'Rosa', bg: 'bg-pink-500' },
];

export const ICON_OPTIONS = [
    { id: 'X', label: 'Cruz' },
    { id: 'Circle', label: 'Círculo' },
    { id: 'Triangle', label: 'Triángulo' },
    { id: 'Square', label: 'Cuadrado' },
    { id: 'Hexagon', label: 'Hexágono' },
];

const usePlayerSetup = (initialPlayersCount = 2, maxPlayers = 5) => {
    const [players, setPlayers] = useState(() => {
        return Array.from({ length: maxPlayers }, (_, i) => ({
            id: `P${i + 1}`,
            name: `Jugador ${i + 1}`,
            icon: ICON_OPTIONS[i % ICON_OPTIONS.length].id,
            color: COLOR_OPTIONS[i % COLOR_OPTIONS.length].hex
        }));
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
