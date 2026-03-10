import { useState } from 'react';
import SetupLayout from '../layout/SetupLayout';
import PlayerConfigRow from './PlayerConfigRow';
import SetupSelector from './SetupSelector';
import usePlayerSetup from '../../hooks/usePlayerSetup';
import { LayoutGrid } from 'lucide-react';
import useCompetitiveSetup from '../../hooks/useCompetitiveSetup';
import TournamentSection from '../tournament/TournamentSection';

const GobbletSetup = ({
    onComplete,
    onBack,
    initialPlayers = null,
    initialBoardSize = 4,
    initialCompetitiveMode = false,
    initialTurnTime = 0
}) => {
    const { competitiveMode, turnTime, competitiveSelectorProps } = useCompetitiveSetup(initialCompetitiveMode, initialTurnTime);
    const [boardSize, setBoardSize] = useState(initialBoardSize);
    const { players, updatePlayer, getVisiblePlayers, getTakenResources } = usePlayerSetup(2, 2, initialPlayers);
    // Estado de configuración del torneo (null = desactivado)
    const [tournamentConfig, setTournamentConfig] = useState(null);

    const activePlayers = getVisiblePlayers(2);
    const { takenIcons, takenColors } = getTakenResources(activePlayers);

    const handleStart = () => {
        onComplete({
            players: activePlayers,
            boardSize,
            competitiveMode,
            turnTime,
            tournament: tournamentConfig
        });
    };

    return (
        <SetupLayout
            gameTitle="Gobblet"
            onBack={onBack ?? (() => window.location.reload())}
            onStart={handleStart}
            startLabel={tournamentConfig ? 'Comenzar Torneo' : 'Comenzar Batalla'}
        >
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full">
                {/* Tamaño de Tablero y Modo Competitivo — solo si no hay torneo activo */}
                {!tournamentConfig && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                        <SetupSelector
                            icon={LayoutGrid}
                            title="Tamaño de Tablero"
                            options={[3, 4, 5]}
                            value={boardSize}
                            onChange={setBoardSize}
                        />
                        <SetupSelector {...competitiveSelectorProps} />
                    </div>
                )}

                {/* Modo Torneo */}
                <div className="shrink-0">
                    <TournamentSection
                        gameType="gobblet"
                        onTournamentChange={setTournamentConfig}
                    />
                </div>

                {/* Siempre 2 jugadores — solo si no hay torneo activo */}
                {!tournamentConfig && (
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
                )}
            </div>
        </SetupLayout>
    );
};

export default GobbletSetup;
