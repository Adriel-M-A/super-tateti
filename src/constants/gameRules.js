export const CLASSIC_RULES = [
    "El juego se desarrolla en un tablero de 3x3.",
    "Dos jugadores (X y O) se turnan para marcar una casilla vacía.",
    "El primer jugador en lograr 3 marcas en línea (horizontal, vertical o diagonal) gana.",
    "Si todas las casillas se llenan sin un ganador, el resultado es empate.",
    "La estrategia consiste en bloquear al oponente mientras creas tu propia línea."
];

export const SUPER_RULES = [
    "Juego de Ta-Te-Ti dentro de otro Ta-Te-Ti.",
    "Tu movimiento determina en qué sub-tablero debe jugar el siguiente jugador.",
    "Gana un sub-tablero alineando 3 piezas en él.",
    "Gana el juego global alineando 3 sub-tableros ganados.",
    "Si te envían a un sub-tablero ya completado, tienes libertad de movimiento."
];

export const DOTS_AND_BOXES_RULES = [
    "El objetivo es completar la mayor cantidad de cuadrados posibles.",
    "En cada turno, un jugador conecta dos puntos adyacentes con una línea.",
    "Si un jugador completa el cuarto lado de un cuadrado, gana un punto y repite turno.",
    "El juego termina cuando se han trazado todas las líneas posibles.",
    "El ganador es el jugador con más cuadrados capturados al final."
];

export const EXTENDED_TATETI_RULES = [
    "Objetivo: Formar la mayor cantidad de líneas posibles (3, 4 o 5 según configuración).",
    "Cada línea formada otorga 1 punto al jugador.",
    "La partida no se detiene al formar una línea; continúa hasta llenar todo el tablero.",
    "Las celdas pueden ser parte de múltiples líneas simultáneamente.",
    "Gana quien acumule más puntos al completar todas las celdas."
];
