export const CLASSIC_RULES = [
    "Grilla clásica de 3x3 para dos jugadores.",
    "Los jugadores (X y O) se turnan para marcar una casilla vacía.",
    "Gana el primero en alinear 3 símbolos (horizontal, vertical o diagonal).",
    "Si se llenan todas las casillas sin ganador, el resultado es empate.",
    "Estrategia: Bloquea al oponente mientras buscas tu propia línea de tres."
];

export const SUPER_RULES = [
    "El tablero se compone de 9 sub-tableros de 3x3.",
    "Tu movimiento en un sub-tablero determina dónde debe jugar el rival.",
    "Ganar 3 sub-tableros en línea suma un punto en el tablero global.",
    "Gana el juego global quien logre alinear 3 sub-tableros ganados.",
    "Si te envían a un sub-tablero ya terminado o lleno, tienes 'libertad de movimiento' en cualquier celda libre."
];

export const DOTS_AND_BOXES_RULES = [
    "El tablero es una grilla de puntos adyacentes.",
    "En tu turno, traza una línea (horizontal o vertical) conectando dos puntos.",
    "Al cerrar los 4 lados de un cuadrado, obtienes 1 punto y mantienes tu turno.",
    "El juego finaliza cuando ya no quedan líneas posibles por trazar.",
    "Ganador: El jugador con mayor cantidad de cuadrados capturados."
];

export const EXTENDED_TATETI_RULES = [
    "Tablero de tamaño personalizado con múltiples jugadores.",
    "Objetivo: Formar líneas de 3, 4 o 5 símbolos según la configuración elegida.",
    "Cada línea terminada otorga 1 punto. Una celda puede ser parte de varias líneas.",
    "La partida NO termina al formar una línea; se juega hasta completar todo el tablero.",
    "Gana el jugador con la puntuación más alta al agotarse las celdas vacías."
];

export const CONNECT4_RULES = [
    "Tablero vertical de 7 columnas y 6 filas.",
    "Las fichas caen hasta la posición libre más baja de la columna elegida.",
    "Gana el primero en alinear 4 fichas (horizontal, vertical o diagonal).",
    "Solo se puede jugar en columnas que no estén completamente llenas.",
    "Estrategia: Anticipa la caída de fichas y bloquea las líneas del oponente."
];
