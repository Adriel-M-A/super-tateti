/**
 * Fuente de verdad única para iconos, colores y configuración base de jugadores.
 * Cualquier cambio en estas listas se propaga automáticamente a todos los juegos y setups.
 */

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
    { id: 'Star', label: 'Estrella' },
];

/** Configuración por defecto de hasta 5 jugadores. */
export const DEFAULT_PLAYERS = Array.from({ length: 5 }, (_, i) => ({
    id: `P${i + 1}`,
    name: `Jugador ${i + 1}`,
    icon: ICON_OPTIONS[i % ICON_OPTIONS.length].id,
    color: COLOR_OPTIONS[i % COLOR_OPTIONS.length].hex,
}));
