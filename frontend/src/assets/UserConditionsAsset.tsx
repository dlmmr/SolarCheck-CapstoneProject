import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Direction } from "../dto/Direction";
import type { UserPvConfig } from "../dto/UserPvConfig";
import "../app.css";
import cheapIconR from "./icons/cheapIcon.png";
import mediumIcon from "./icons/mediumIcon.png";
import premiumIcon from "./icons/premiumIcon.png";


export interface UserConditionsFormData {
    userPvConfig: UserPvConfig | "";
    montageAngle: number | "";
    montageDirection: Direction | "";
    montageShadeFactor: number | "";
}

interface UserConditionsAssetProps {
    readonly formData: UserConditionsFormData;
    readonly onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    readonly onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    readonly onBack: () => void;
    readonly isLoading?: boolean;
}

const DIRECTION_LABELS: Record<Direction, string> = {
    NORTH: "Norden",
    NORTHEAST: "Nordosten",
    EAST: "Osten",
    SOUTHEAST: "Südosten",
    SOUTH: "Süden",
    SOUTHWEST: "Südwesten",
    WEST: "Westen",
    NORTHWEST: "Nordwesten",
};

const PV_CARDS: Array<{
    key: UserPvConfig;
    title: string;
    desc: string;
    icon: string;
    details: string;
    specs: string;
}> = [
    {
        key: "CHEAP_PV_COMBI",
        title: "kleines Balkonkraftwerk",
        desc: "800W • 4m² • 450€",
        icon: cheapIconR,
        details: "2 Module á 400W / Modul • 4m² ",
        specs: "800W Wechselrichter, Clipping Faktor: 1.0"
    },
    {
        key: "MEDIUM_PV_COMBI",
        title: "mittleres Balkonkraftwerk",
        desc: "1200W • 6m² • 600€",
        icon: mediumIcon,
        details: "3 Module á 400W / Modul • 6m²",
        specs: "800W Wechselrichter, Clipping Faktor: 1.5"
    },
    {
        key: "PREMIUM_PV_COMBI",
        title: "großes Balkonkraftwerk",
        desc: "1600W • 8m² • 750€",
        icon: premiumIcon,
        details: "4 Module á 400W / Modul • 8m²",
        specs: "800W Wechselrichter, Clipping Faktor: 2.0"
    },
];

const TOOLTIPS = {
    pvConfig: "Wähle die Größe des PV-Sets, das zu deinem Stromverbrauch passt. Die Sets unterscheiden sich nur in der Anzahl der Module und Gesamtkosten.",
    angle: "Gib den Neigungswinkel der Module ein. In Deutschland liegen die optimalen Winkel meist zwischen 30° und 35°. Flachdächer: 10–15°, Steildächer: 30–45°.",
    direction: "Wähle die Himmelsrichtung, in die die Module zeigen. Südausrichtung liefert die höchste Stromproduktion, Ost-West-Dächer verändern die Ertragsverteilung.",
    shade: "Trage den Verschattungsfaktor der Module ein: 0 = keine Verschattung, 1 = volle Verschattung über den Tagesverlauf."

};


export default function UserConditionsAsset({
                                                formData,
                                                onChange,
                                                onSubmit,
                                                onBack,
                                                isLoading = false,
                                            }: UserConditionsAssetProps) {
    const [submitted, setSubmitted] = useState(false);
    const { userPvConfig, montageAngle, montageDirection, montageShadeFactor } = formData;

    const valid = {
        config: userPvConfig !== "",
        angle: montageAngle !== "" && montageAngle >= 0 && montageAngle <= 90,
        direction: montageDirection !== "",
        shade: montageShadeFactor !== "" && montageShadeFactor >= 0 && montageShadeFactor <= 1,
    };

    const isValid = Object.values(valid).every(Boolean);
    const inputClass = (ok: boolean) =>
        !submitted || ok ? "FormAndResultInput" : "FormAndResultInput FormAndResultInputError";

    const handleSubmitLocal = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        if (isValid) onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmitLocal} className="FormAndResultContainer">

            <div>
                <fieldset className="PvCardGrid">
                    <legend className="FormAndResultLabel">
                        Wähle ein Balkonkraftwerk
                        <span
                            className="TooltipIcon"
                            title={TOOLTIPS.pvConfig}
                        >
                            ℹ️
                        </span>
                    </legend>
                    {PV_CARDS.map(card => (
                        <label
                            key={card.key}
                            className={`PvCard ${userPvConfig === card.key ? "PvCardSelected" : ""}`}
                            title={`${card.details} - ${card.specs}`}
                        >
                            <input
                                type="radio"
                                name="userPvConfig"
                                value={card.key}
                                checked={userPvConfig === card.key}
                                onChange={onChange}
                                className="PvCardInput"
                                aria-label={`${card.title}: ${card.desc}`}
                            />
                            <div className="PvCardIcon">
                                <img src={card.icon} alt={card.title} />
                            </div>
                            <div className="PvCardTitle">{card.title}</div>
                            <div className="PvCardDesc">{card.desc}</div>
                            {userPvConfig === card.key && (
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-primary)',
                                    marginTop: '8px',
                                    fontStyle: 'italic'
                                }}>
                                </div>
                            )}
                        </label>
                    ))}
                </fieldset>
            </div>

            <div className="FormAndResultContent">
                <label htmlFor="montageAngle" className="FormAndResultLabel">
                    Neigungswinkel der Module
                    <span
                        className="TooltipIcon"
                        title={TOOLTIPS.angle}
                        style={{
                            display: 'inline-block',
                            marginLeft: '6px',
                            cursor: 'help',
                            fontSize: '1rem'
                        }}
                    >
                        ℹ️
                    </span>
                </label>
                <input
                    id="montageAngle"
                    type="number"
                    name="montageAngle"
                    value={montageAngle}
                    onChange={onChange}
                    min={0}
                    max={90}
                    step={5}
                    placeholder="z.B. 30"
                    className={inputClass(valid.angle)}
                />

                <label htmlFor="montageDirection" className="FormAndResultLabel">
                    Ausrichtung der Module
                    <span
                        className="TooltipIcon"
                        title={TOOLTIPS.direction}
                        style={{
                            display: 'inline-block',
                            marginLeft: '6px',
                            cursor: 'help',
                            fontSize: '1rem'
                        }}
                    >
                        ℹ️
                    </span>
                </label>
                <select
                    id="montageDirection"
                    name="montageDirection"
                    value={montageDirection}
                    onChange={onChange}
                    className={inputClass(valid.direction)}
                >
                    <option value="">-- Himmelsrichtung wählen --</option>
                    {Object.entries(DIRECTION_LABELS).map(([key, lbl]) => (
                        <option key={key} value={key}>{lbl}</option>
                    ))}
                </select>

                <label htmlFor="montageShadeFactor" className="FormAndResultLabel">
                    Verschattungsfaktor
                    <span
                        className="TooltipIcon"
                        title={TOOLTIPS.shade}
                        style={{
                            display: 'inline-block',
                            marginLeft: '6px',
                            cursor: 'help',
                            fontSize: '1rem'
                        }}
                    >
                        ℹ️
                    </span>
                </label>
                <input
                    id="montageShadeFactor"
                    type="number"
                    name="montageShadeFactor"
                    value={montageShadeFactor}
                    onChange={onChange}
                    min={0}
                    max={1}
                    step={0.1}
                    placeholder="z.B. 0.0"
                    className={inputClass(valid.shade)}
                />
            </div>

            {submitted && !isValid && (
                <p className="FormAndResultError" role="alert">
                    ⚠️ Bitte alle Felder korrekt ausfüllen.
                </p>
            )}

            <div className="FormAndResultButtonGroup">
                <button type="submit" className="FormAndResultButton" disabled={isLoading}>
                    {isLoading ? "Berechnung läuft..." : "Ergebnisse berechnen"}
                </button>
                <button type="button" className="FormAndResultButtonBack" onClick={onBack} disabled={isLoading}>
                    Zurück
                </button>
            </div>
        </form>
    );
}
