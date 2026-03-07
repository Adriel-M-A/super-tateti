# GamesHub

Una colección de juegos de mesa y estrategia construida con **React + Vite + Tailwind CSS v4**.

## Descripción

**GamesHub** es una aplicación web que agrupa 5 juegos clásicos en una sola interfaz. Cada juego tiene su propia pantalla de configuración donde se pueden personalizar jugadores, tablero y reglas. Todos los juegos comparten una capa de ui común (temporizador, estado de jugadores, historial de jugadas), y soportan el **Modo Competitivo** con cuenta regresiva.

---

## Juegos Disponibles

### 🟩 Ta-Te-Ti Clásico
El juego original de 3x3 para dos jugadores.

- Tablero de 3×3. Los jugadores (X y O) se turnan para marcar una casilla vacía.
- Gana quien alinee **3 símbolos** en horizontal, vertical o diagonal.
- Si se llenan todas las casillas sin ganador: **empate**.

---

### 🔵 Super Ta-Te-Ti *(Ultimate Tic-Tac-Toe)*
Estrategia recursiva en 9 dimensiones.

- El tablero es una grilla 3×3 donde **cada celda contiene un sub-tablero** de 3×3.
- **Regla de Oro:** tu movimiento dentro de un sub-tablero determina en qué sub-tablero debe jugar tu rival a continuación.
- Si te envían a un sub-tablero ya terminado o lleno, tenés **libertad de movimiento** en cualquier celda libre del tablero global.
- Ganar un sub-tablero equivale a reclamar esa celda en el tablero principal.
- Gana quien alinee **3 sub-tableros ganados** en el tablero global.
- Los empates en sub-tableros actúan como **comodín**: cuentan para completar una línea de cualquier jugador.

---

### 🟣 Puntos y Cajas *(Dots and Boxes)*
Captura territorio en una grilla táctica. Soporta hasta **5 jugadores**.

- El tablero es una grilla de puntos. En cada turno trazás una **línea horizontal o vertical** entre dos puntos adyacentes.
- Al cerrar los **4 lados** de un cuadrado, ganás el cuadrado y **conservás el turno**.
- El juego termina cuando ya no quedan líneas por trazar.
- Gana el jugador con **más cuadrados capturados**.
- Tamaño de tablero configurable (3×3 a 7×7).

---

### 🩷 Ta-Te-Ti Extendido
Tableros grandes con puntuación acumulativa. Soporta hasta **5 jugadores**.

- Tablero de tamaño personalizado (configurable en filas, columnas y condición de victoria: 3, 4 o 5 en línea).
- Cada línea completada otorga **1 punto**. Una celda puede formar parte de varias líneas simultáneamente.
- La partida **no termina** al formar una línea; se juega hasta que el tablero esté completo.
- Gana el jugador con la **puntuación más alta** al agotarse las celdas.

---

### 🟡 Conecta 4
Duelo vertical de estrategia para dos jugadores.

- Tablero vertical de **7 columnas × 6 filas**. Las fichas caen hasta la posición libre más baja de la columna elegida (gravedad).
- Solo se puede elegir columnas que **no estén completamente llenas**.
- Gana el primero en alinear **4 fichas** en horizontal, vertical o diagonal.

---

### 🩵 Gobblet
Estrategia de piezas jerarquizadas para dos jugadores.

- El tablero es cuadrado y configurable: **3×3**, **4×4** (versión original) o **5×5**. El objetivo es alinear N piezas visibles propias (igual al tamaño del tablero) en horizontal, vertical o diagonal.
- Cada jugador tiene piezas de **distintos tamaños** (S, M, L en 3×3/4×4; XS, S, M, L en 5×5) organizadas en **pilas externas**. Solo está disponible la pieza de la cima de cada pila.
- Una pieza puede **cubrir a otra más pequeña** (propia o del rival), ocultándola bajo la pila. Solo las piezas **visibles** (tope de cada celda) cuentan para ganar.
- En cada turno se puede: colocar una pieza nueva desde las pilas externas, o mover una pieza ya visible en el tablero hacia otra celda válida.
- Al mover una pieza, la que estaba debajo **vuelve a ser visible**, lo que puede revelar sorpresas estratégicas inesperadas.

---

## Modo Competitivo

Todos los juegos incluyen **Modo Competitivo** activable desde la pantalla de configuración.

- Tiempo por turno configurable: **5 / 10 / 20 / 30 segundos**.
- El temporizador se muestra en la columna lateral durante la partida con una barra de progreso fluida.
- Si el tiempo expira, se realiza automáticamente un **movimiento aleatorio válido** respetando las reglas de cada juego:
  - *Clásico / Extendido*: selecciona una celda vacía al azar.
  - *Super TaTeTi*: respeta la regla de movimiento forzado/libre (`activeSubBoard`).
  - *Conecta 4*: elige una columna no llena al azar (la ficha cae por gravedad).
  - *Puntos y Cajas*: elige una línea disponible al azar. Si completa una caja, el timer se reinicia (el jugador conserva el turno).
  - *Gobblet*: elige un movimiento válido al azar respetando la jerarquía de tamaños (nueva pieza externa o movimiento de pieza visible en el tablero).

---

## Configuración de Jugadores

Cada juego permite personalizar a los jugadores antes de comenzar:

- **Nombre** editable.
- **Ícono** (símbolo visual único): X, O, triángulo, estrella, etc.
- **Color** personalizado con un selector visual.
- Número de jugadores configurable según el juego (2 fijos en Clásico, Super, Conecta 4 y Gobblet; 2–5 en Extendido y Puntos y Cajas).

La configuración **persiste al volver al menú de setup** sin reiniciar la partida si no cambiaron los parámetros estructurales (tamaño de tablero, cantidad de jugadores).

---

## Características Generales

- 🌙 **Modo oscuro / claro** con toggle global.
- 📊 **Panel lateral** durante el juego: turno actual, puntuaciones y temporizador.
- 🔄 **Reinicio** y **regreso al setup** accesibles en cualquier momento desde el header del juego.
- 🏆 **Pantalla de resultado** al finalizar: muestra ganador/es o empate con opción de revancha.
- 📜 **Reglas del juego** accesibles desde el panel lateral durante la partida.

---

## Stack Tecnológico

| Tecnología | Rol |
|---|---|
| **React 19** | Biblioteca de UI y manejo de estado |
| **Vite** | Bundler y servidor de desarrollo |
| **Tailwind CSS v4** | Estilos utilitarios, temas y animaciones |
| **Lucide React** | Iconografía |
| **Context API** | Estado compartido entre layout y juego |

### Estructura del Proyecto

```
src/
├── pages/
│   ├── Home.jsx                  # Pantalla principal con selección de juegos
│   └── games/
│       ├── ClassicTaTeTi.jsx
│       ├── SuperTaTeTi.jsx
│       ├── DotsAndBoxes.jsx
│       ├── ExtendedTaTeTi.jsx
│       ├── Connect4.jsx
│       └── Gobblet.jsx
├── components/
│   ├── layout/                   # GameLayout, GameHeader, SetupLayout, GameTimer...
│   ├── game/                     # Board, Connect4Board, GobbletBoard, GobbletExternalPiles...
│   └── setup/                    # PlayerSetup, Connect4Setup, GobbletSetup...
├── contexts/
│   └── GameContext.jsx           # Estado global compartido durante una partida
├── hooks/
│   ├── usePlayerSetup.js         # Lógica de configuración de jugadores
│   └── useCompetitiveSetup.js    # Lógica del selector de Modo Competitivo
└── constants/
    ├── gameRules.js              # Reglas de cada juego (usadas en el panel lateral)
    └── gameConfig.js             # Opciones compartidas (tiempos del modo competitivo)
```

---

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

---

*GamesHub v1.0.0*
