import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Direction } from "../dto/Direction";
import type { UserPvConfig } from "../dto/UserPvConfig";
import "../app.css";

export interface UserConditionsFormData {
    userPvConfig: UserPvConfig | "";       // erlaubt leer für UX
    montageAngle: number | "";             // erlaubt leer für UX
    montageDirection: Direction | "";      // erlaubt leer für UX
    montageShadeFactor: number | "";       // erlaubt leer für UX
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

const PV_CARDS: Array<{ key: UserPvConfig; title: string; desc: string; icon: string }> = [
    { key: "CHEAP_PV_COMBI", title: "Budget PV-Set", desc: "Günstige Lösung", icon: "💡" },
    { key: "MEDIUM_PV_COMBI", title: "Standard PV-Set", desc: "Preis-/Leistung gut", icon: "⚡" },
    { key: "PREMIUM_PV_COMBI", title: "Premium PV-Set", desc: "Beste Performance", icon: "🌞" },
];

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
            <fieldset className="PvCardGrid">
                <legend className="visually-hidden">PV-Modul auswählen</legend>
                {PV_CARDS.map(card => (
                    <label key={card.key} className={`PvCard ${userPvConfig === card.key ? "PvCardSelected" : ""}`}>
                        <input
                            type="radio"
                            name="userPvConfig"
                            value={card.key}
                            checked={userPvConfig === card.key}
                            onChange={onChange}
                            className="PvCardInput"
                            aria-label={`${card.title}: ${card.desc}`}
                        />
                        <div className="PvCardIcon">{card.icon}</div>
                        <div className="PvCardTitle">{card.title}</div>
                        <div className="PvCardDesc">{card.desc}</div>
                    </label>
                ))}
            </fieldset>

            <div className="FormAndResultContent">
                <div>
                    <label htmlFor="montageAngle">Montagewinkel (°)</label>
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
                </div>
                <div>
                    <label htmlFor="montageDirection">Ausrichtung</label>
                    <select
                        id="montageDirection"
                        name="montageDirection"
                        value={montageDirection}
                        onChange={onChange}
                        className={inputClass(valid.direction)}
                    >
                        <option value="">-- wählen --</option>
                        {Object.entries(DIRECTION_LABELS).map(([key, lbl]) => (
                            <option key={key} value={key}>{lbl}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="montageShadeFactor">Verschattung (0 = keine, 1 = komplett)</label>
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
            </div>

            {submitted && !isValid && (
                <p className="FormAndResultError">🔴 Bitte alle Felder korrekt ausfüllen.</p>
            )}

            <div className="FormAndResultButtonGroup">
                <button type="submit" className="FormAndResultButton" disabled={isLoading}>
                    {isLoading ? "Speichern..." : "Weiter"}
                </button>
                <button type="button" className="FormAndResultButtonBack" onClick={onBack} disabled={isLoading}>
                    Zurück
                </button>
            </div>
        </form>
    );
}