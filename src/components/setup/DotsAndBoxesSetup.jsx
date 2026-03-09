import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import { Users, LayoutGrid } from 'lucide-react';
import useCompetitiveSetup from '../../hooks/useCompetitiveSetup';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../../constants/playerConfig';

const DotsAndBoxesSetup = ({
    onComplete,
    onBack,
    initialPlayers = null,
    initialBoardSize = 5,
    isGameInProgress = false,
    initialCompetitiveMode = false,
    initialTurnTime = 0
}) => {
    const { competitiveMode, turnTime, competitiveSelectorProps } = useCompetitiveSetup(initialCompetitiveMode, initialTurnTime);
    const [numPlayers, setNumPlayers] = useState(initialPlayers?.length || 2);
    const [boardSize, setBoardSize] = useState(initialBoardSize);
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 5, initialPlayers);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    // Al agregar un jugador nuevo, garantizar que no comparta icono ni color
    const handleNumPlayersChange = (n) => {
        if (n > numPlayers) {
            const currentActive = getVisiblePlayers(numPlayers);
            const taken = getTakenResources(currentActive);
            const newPlayer = players[n - 1];
            const updates = {};
            if (taken.takenIcons.includes(newPlayer.icon)) {
                const free = ICON_OPTIONS.find(o => !taken.takenIcons.includes(o.id));
                if (free) updates.icon = free.id;
            }
            if (taken.takenColors.includes(newPlayer.color)) {
                const free = COLOR_OPTIONS.find(o => !taken.takenColors.includes(o.hex));
                if (free) updates.color = free.hex;
            }
            if (Object.keys(updates).length > 0) updatePlayer(n - 1, updates);
        }
        setNumPlayers(n);
    };

    // Detección de cambios que Borran Partida
    const isRestartRequired = isGameInProgress && (
        numPlayers !== initialPlayers?.length ||
        boardSize !== initialBoardSize
    );

    const handleStart = () => {
        onComplete({
            players: activePlayers,
            boardSize,
            competitiveMode,
            turnTime: competitiveMode ? turnTime : 0
        });
    };

    return (
        <SetupLayout
            gameTitle="Puntos y Cajas"
            onBack={onBack ?? (() => window.location.reload())}
            onStart={handleStart}
            warning={isRestartRequired ? "¡Atención! Cambiar el tamaño o cantidad de jugadores reiniciará la partida" : null}
        >
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full">
                {/* Configuración de Partida */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
                    <SetupSelector
                        icon={Users}
                        title="Jugadores"
                        options={[2, 3, 4, 5]}
                        value={numPlayers}
                        onChange={handleNumPlayersChange}
                    />

                    <SetupSelector
                        icon={LayoutGrid}
                        title="Tablero"
                        options={[5, 7, 9]}
                        value={boardSize}
                        onChange={setBoardSize}
                    />

                    <div className="md:col-span-2 lg:col-span-1">
                        <SetupSelector {...competitiveSelectorProps} />
                    </div>
                </div>

                {/* Filas de Jugadores — con scroll propio */}
                <div className="flex flex-col gap-4 overflow-y-auto min-h-0 pr-1">
                    {activePlayers.map((player, idx) => (
                        <PlayerConfigRow
                            key={player.id}
                            index={idx}
                            player={player}
                            onUpdate={(updates) => updatePlayer(idx, updates)}
                            takenIcons={takenIcons}
                            takenColors={takenColors}
                        />
                    ))}
                </div>
            </div>
        </SetupLayout>
    );
};

export default DotsAndBoxesSetup;
