import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import { Users, LayoutGrid, Timer } from 'lucide-react';

const DotsAndBoxesSetup = ({
    onComplete,
    initialPlayers = null,
    initialBoardSize = 5,
    isGameInProgress = false,
    initialCompetitiveMode = false,
    initialTurnTime = 10
}) => {
    const [competitiveMode, setCompetitiveMode] = useState(initialCompetitiveMode);
    const [turnTime, setTurnTime] = useState(initialTurnTime);
    const [numPlayers, setNumPlayers] = useState(initialPlayers?.length || 2);
    const [boardSize, setBoardSize] = useState(initialBoardSize);
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 5, initialPlayers);

    const activePlayers = getVisiblePlayers(numPlayers);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

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
            onBack={() => window.location.reload()}
            onStart={handleStart}
            warning={isRestartRequired ? "¡Atención! Cambiar el tamaño o cantidad de jugadores reiniciará la partida" : null}
        >
            <div className="space-y-8 w-full max-w-4xl mx-auto pb-10">
                {/* Configuración de Partida */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SetupSelector
                        icon={Users}
                        title="Jugadores"
                        options={[2, 3, 4, 5]}
                        value={numPlayers}
                        onChange={setNumPlayers}
                    />

                    <SetupSelector
                        icon={LayoutGrid}
                        title="Tablero"
                        options={[5, 7, 9]}
                        value={boardSize}
                        onChange={setBoardSize}
                    />

                    <div className="md:col-span-2 lg:col-span-1">
                        <SetupSelector
                            icon={Timer}
                            title="Modo Competitivo"
                            options={["No", 5, 10, 20, 30]}
                            value={competitiveMode ? turnTime : "No"}
                            onChange={(val) => {
                                if (val === "No") {
                                    setCompetitiveMode(false);
                                } else {
                                    setCompetitiveMode(true);
                                    setTurnTime(val);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Filas de Jugadores */}
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
