# Super Ta-Te-Ti

¡Bienvenido al **Super Ta-Te-Ti** (también conocido como Ultimate Tic-Tac-Toe)! Esta es una versión estratégica y avanzada del clásico juego de tres en raya, construida con **React, Vite y Tailwind CSS v4**.

## ¿De qué trata el proyecto?

A diferencia del Ta-Te-Ti tradicional, el **Super Ta-Te-Ti** es un tablero de 3x3 donde cada una de sus 9 celdas contiene, a su vez, otro tablero completo de Ta-Te-Ti (un "sub-tateti").

El objetivo principal es ganar el **tablero grande** consiguiendo tres celdas en línea (horizontal, vertical o diagonal). Para ganar una celda del tablero grande, debes ganar el sub-tateti que se encuentra dentro de ella.

## Reglas del Juego

### 1. Movimiento Forzado (La Regla de Oro)
La posición de tu jugada en un sub-tateti determina en qué sub-tateti debe jugar tu oponente a continuación:
- Si el Jugador 1 marca la celda **central** de cualquier sub-tateti, el Jugador 2 está obligado a realizar su próximo movimiento en el sub-tateti que ocupa la posición **central** del tablero grande.
- Si un jugador marca una celda en la esquina superior derecha de un sub-tateti, el siguiente jugador debe jugar en el sub-tateti de la esquina superior derecha del tablero grande.

### 2. Ganar Celdas y Turnos
- Cuando un jugador consigue tres en raya en un sub-tateti, gana esa celda del tablero grande.
- Tras ganar un sub-tateti, el turno pasa al oponente. Si el movimiento ganador obligaba al oponente a ir a un sub-tateti que ya ha sido ganado o está empatado (terminado), el oponente puede elegir **libremente** en qué sub-tateti disponible jugar (Movimiento Libre).

### 3. Movimiento Libre
- Si un jugador es enviado a un sub-tateti que ya está terminado (alguien ya lo ganó o hay un empate), ese jugador puede jugar en **cualquier otro sub-tateti disponible** del tablero.

### 4. Fin del Juego
- El juego termina cuando un jugador consigue ganar el tablero principal (tres celdas grandes en línea) o cuando todos los sub-tatetis están terminados.

## Tecnologías Utilizadas

- **React**: Biblioteca para la interfaz de usuario.
- **Vite**: Herramienta de construcción ultrarrápida.
- **Tailwind CSS v4**: Motor CSS de última generación para un diseño moderno y fluido.
- **JavaScript**: Lógica del juego.

---
*Desarrollado con pasión para llevar el Ta-Te-Ti al siguiente nivel.*
