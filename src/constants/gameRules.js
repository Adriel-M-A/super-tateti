export const CLASSIC_RULES = [
    "Grilla 3×3 para dos jugadores.",
    "Alternarse para marcar una casilla vacía.",
    "Gana quien alinee 3 en horizontal, vertical o diagonal.",
    "Si se completa el tablero sin ganador, es empate.",
    "Bloqueá al rival mientras buscás tu propia línea."
];

export const SUPER_RULES = [
    "Tablero de 9 sub-tableros de 3×3.",
    "Tu jugada determina el sub-tablero donde juega el rival.",
    "Ganar un sub-tablero lo marca en el tablero global.",
    "Gana quien alinee 3 sub-tableros ganados.",
    "Si el sub-tablero asignado está cerrado, podés jugar en cualquier celda libre."
];

export const DOTS_AND_BOXES_RULES = [
    "Conectá dos puntos adyacentes trazando una línea.",
    "Al cerrar los 4 lados de un cuadrado, ganás 1 punto y seguís jugando.",
    "El juego termina cuando no quedan líneas disponibles.",
    "Gana el jugador con más cuadrados capturados."
];

export const EXTENDED_TATETI_RULES = [
    "Tablero personalizado con múltiples jugadores.",
    "Formá líneas de N símbolos según la configuración elegida.",
    "Cada línea otorga 1 punto; una celda puede ser parte de varias.",
    "La partida NO termina al completar una línea.",
    "Gana quien tenga más puntos al llenarse el tablero."
];

export const GOBBLET_RULES = [
    "Alineá N piezas visibles en línea (N = tamaño del tablero).",
    "Solo cuenta la pieza en la cima de cada pila.",
    "Una pieza puede cubrir a otra más pequeña.",
    "Colocá una pieza nueva o mové una del tablero.",
    "Al mover, la pieza de abajo queda visible nuevamente."
];

export const MOBILE_TATETI_RULES = [
    "Tablero 3×3, dos jugadores con 3 piezas cada uno.",
    "Fase 1: colocá tus 3 piezas en celdas vacías.",
    "Fase 2: mové una pieza a una celda adyacente vacía.",
    "Gana quien alinee sus 3 piezas (fila, columna o diagonal).",
    "Sin empate: el juego continúa hasta que alguien gana."
];

export const CONNECT4_RULES = [
    "Tablero de 7 columnas y 6 filas.",
    "Las fichas caen hasta la posición libre más baja.",
    "Gana quien alinee 4 fichas en horizontal, vertical o diagonal.",
    "No podés jugar en columnas completamente llenas.",
    "Anticipá la caída de fichas y bloqueá al oponente."
];

