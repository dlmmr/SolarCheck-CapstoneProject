import type {UserResponseDTO} from "../dto/UserResponseDTO";
import "../app.css";

interface Props {
    readonly user: UserResponseDTO | undefined;
    readonly goBack: () => void;
}

interface ResultItem {
    label: string;
    value: string;
    highlight?: boolean;
    tooltip?: string;
    subtitle?: string;
    showProgress?: boolean;
    progressValue?: number;
}

interface ResultGroup {
    title: string;
    icon: string;
    color: string;
    results: ResultItem[];
}

export default function ResultAsset({user, goBack}: Props) {
    if (!user?.userResult) {
        return (
            <div className="FormAndResultContainer">
                <h2>Ergebnis</h2>
                <p className="FormAndResultError">Keine Berechnung vorhanden.</p>
                <button className="FormAndResultButton" onClick={goBack}>Zurück</button>
            </div>
        );
    }

    const {
        userPossibleElectricityGeneration,
        userAmountOfPossibleSavings,
        userAmortisationTime,
        userCo2SavingsKgPerYear,
        userSelfConsumptionRate,
        userAutarkyRate,
        userHomeofficeCoverageRate,
        userDailyEBikeRangeKm,
        userDailyECarRangeKm
    } = user.userResult;

    const renderCard = (result: ResultItem, color: string) => (
        <div className={`ResultCardCompact ResultCard--${color}`} key={result.label}>
            <div className="ResultCardHeaderCompact">
                <div className="ResultCardLabelCompact">{result.label}</div>
                {result.tooltip && (
                    <span
                        className="ResultCardTooltipCompact"
                        title={result.tooltip}
                    >
        ℹ️
    </span>
                )}
            </div>
            <div className="ResultCardValueCompact">{result.value}</div>
            {result.subtitle ? (
                <div className="ResultCardSubtitleCompact">{result.subtitle}</div>
            ) : (
                <div className="ResultCardSubtitleCompact" style={{opacity: 0}} aria-hidden="true">Platzhalter</div>
            )}
            {result.showProgress && result.progressValue !== undefined && (
                <progress
                    className="ResultCardProgressBarCompact"
                    value={Math.min(result.progressValue * 100, 100)}
                    max={100}
                />
            )}
        </div>
    );

    const resultGroups: ResultGroup[] = [
        {
            title: "Strom & Autarkie",
            icon: "⚡🔌",
            color: "technical",
            results: [
                {
                    label: "Jährliche Stromerzeugung",
                    value: userPossibleElectricityGeneration >= 1000
                        ? `${(userPossibleElectricityGeneration / 1000).toFixed(2)} MWh`
                        : `${userPossibleElectricityGeneration.toFixed(0)} kWh`,
                    tooltip: "Erwartete jährliche Produktion",
                    subtitle: `≈ ${(userPossibleElectricityGeneration / 365).toFixed(0)} kWh/Tag`
                },
                {
                    label: "Eigenverbrauch",
                    value: `${(userSelfConsumptionRate * 100).toFixed(0)} %`,
                    showProgress: true,
                    progressValue: userSelfConsumptionRate,
                    tooltip: "Anteil selbst verbrauchter Solarstrom",
                    subtitle: userSelfConsumptionRate >= 0.7
                        ? "✓ Sehr effizienter Verbrauch"
                        : "Optimierungspotential vorhanden"
                },
                {
                    label: "Autarkiegrad",
                    value: `${(userAutarkyRate * 100).toFixed(0)} %`,
                    showProgress: true,
                    progressValue: userAutarkyRate,
                    tooltip: "Anteil Solar am Strombedarf",
                    subtitle: userAutarkyRate >= 0.7
                        ? "✓ Hohe Unabhängigkeit"
                        : "Teilweise vom Netz abhängig"
                }
            ]
        },
        {
            title: "Alltag & Umwelt",
            icon: "🌱🔋",
            color: "daily",
            results: [
                {
                    label: "CO₂-Einsparung/Jahr",
                    value: `${userCo2SavingsKgPerYear.toFixed(0)} kg`,
                    subtitle: `≈ ${(userCo2SavingsKgPerYear / 11).toFixed(0)} Bäume`,
                    tooltip: "CO₂-Reduktion vs. Netzstrom"
                },
                {
                    label: "Homeoffice-Abdeckung",
                    value: `${userHomeofficeCoverageRate.toFixed(0)} %`,  // ✅ Direkt anzeigen: 80 → 80%
                    showProgress: true,
                    progressValue: userHomeofficeCoverageRate / 100,  // ✅ Für Progress Bar: 80 → 0.8
                    tooltip: "Anteil des Homeoffice-Bedarfs (≈3 kWh/Tag), der durch PV gedeckt werden kann",
                    subtitle: userHomeofficeCoverageRate >= 100
                        ? "✓ Vollständig gedeckt"
                        : `${(3 * userHomeofficeCoverageRate / 100).toFixed(1)} von 3 kWh`  // ✅ Korrekt umrechnen
                },
                {
                    label: "E-Bike Reichweite/Tag",
                    value: `${userDailyEBikeRangeKm.toFixed(0)} km`,
                    tooltip: "Tägliche E-Bike-Reichweite bei 15 Wh/km Verbrauch",
                    subtitle: userDailyEBikeRangeKm >= 50
                        ? "✓ Mehr als genug für Pendler"
                        : `Für kurze Strecken geeignet`
                },
                {
                    label: "E-Auto Reichweite/Tag",
                    value: `${userDailyECarRangeKm.toFixed(0)} km`,
                    tooltip: "Tägliche E-Auto-Reichweite bei 17 kWh/100km Verbrauch",
                    subtitle: userDailyECarRangeKm >= 40
                        ? "✓ Gut für tägliche Fahrten"
                        : `Für Kurzstrecken nutzbar`
                }
            ]
        },
        {
            title: "Wirtschaft",
            icon: "💰📈",
            color: "economic",
            results: [
                {
                    label: "Jährliche Kostenersparnis",
                    value: `${userAmountOfPossibleSavings.toFixed(0)} €`,
                    tooltip: "Ihre geschätzte jährliche Ersparnis",
                    subtitle: `≈ ${(userAmountOfPossibleSavings / 12).toFixed(0)} €/Monat`
                },
                {
                    label: "Amortisationsdauer",
                    value: `${userAmortisationTime.toFixed(0)} Jahre`,
                    tooltip: "Zeit bis zur Amortisation",
                    subtitle: userAmortisationTime <= 10
                        ? "✓ Schnelle Refinanzierung"
                        : "Langfristige Investition"
                }
            ]
        }
    ];

    return (
        <div className="ResultContainerCompact">
            {/* Cards Grid - Max 4 Reihen */}
            <div className="ResultMainGrid">
                {resultGroups.map(group => (
                    <div key={group.title} className="ResultGroupCompact">
                        <div className="ResultGroupHeaderCompact">
                            <span className="ResultGroupIconCompact">{group.icon}</span>
                            <h3 className="ResultGroupTitleCompact">{group.title}</h3>
                        </div>
                        <div className="ResultCardsCompact">
                            {group.results.map(result => renderCard(result, group.color))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="ResultActionsCompact">
                <button className="FormAndResultButton" onClick={goBack}>
                    Zurück zur Berechnung
                </button>
            </div>
        </div>
    );
}
