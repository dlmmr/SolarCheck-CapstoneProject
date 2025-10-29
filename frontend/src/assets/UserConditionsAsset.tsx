import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Direction } from "../dto/Direction";
import "../app.css";

export interface UserConditionsFormData {
    montagePlace: boolean;
    montageAngle: number | "";
    montageDirection: "" | Direction;
    montageShadeFactor: number | "";
}

interface UserConditionsAssetProps {
    readonly formData: UserConditionsFormData;
    readonly onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    readonly onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    readonly onBack: () => void;
    readonly isLoading?: boolean;
}

// Runtime gültige Richtungsliste
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

export default function UserConditionsAsset({
                                                formData,
                                                onChange,
                                                onSubmit,
                                                onBack,
                                                isLoading = false,
                                            }: UserConditionsAssetProps) {
    const [submitted, setSubmitted] = useState(false);
    const { montagePlace, montageAngle, montageDirection, montageShadeFactor } = formData;

    const angleValid = montageAngle !== "" && montageAngle >= 0 && montageAngle <= 90;
    const directionValid = montageDirection !== "";
    const shadeValid = montageShadeFactor !== "" && montageShadeFactor >= 0 && montageShadeFactor <= 1;
    const isValid = montagePlace && angleValid && directionValid && shadeValid;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        if (isValid) onSubmit(e);
    };

    const getInputClass = (valid: boolean) =>
        !submitted || valid ? "FormAndResultInput" : "FormAndResultInput FormAndResultInputError";

    return (
        <form onSubmit={handleSubmit} className="FormAndResultContainer">
            <div className="FormAndResultContent">
                <label className="FormAndResultLabel">
                    Montage vorhanden
                    <input
                        id="montagePlace"
                        type="checkbox"
                        name="montagePlace"
                        checked={montagePlace}
                        onChange={onChange}
                        className="FormAndResultInput"
                    />
                </label>

                <label className="FormAndResultLabel">
                    Montagewinkel (°)
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
                        className={getInputClass(angleValid)}
                    />
                </label>

                <label className="FormAndResultLabel">
                    Ausrichtung
                    <select
                        id="montageDirection"
                        name="montageDirection"
                        value={montageDirection}
                        onChange={onChange}
                        className={getInputClass(directionValid)}
                    >
                        <option value="">-- Bitte wählen --</option>
                        {Object.entries(DIRECTION_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="FormAndResultLabel">
                    Verschattung am Tag (0 = keine, 1 = komplett)
                    <input
                        id="montageShadeFactor"
                        type="number"
                        name="montageShadeFactor"
                        value={montageShadeFactor}
                        onChange={onChange}
                        min={0}
                        max={1}
                        step={0.1}
                        placeholder="z.B. 0.3"
                        className={getInputClass(shadeValid)}
                    />
                </label>

                {submitted && !isValid && (
                    <p className="FormAndResultError">Bitte fülle alle Felder korrekt aus.</p>
                )}
            </div>

            <div className="FormAndResultButtonGroup">
                <button type="submit" className="FormAndResultButton" disabled={isLoading}>
                    {isLoading ? "Speichern..." : "Speichern und weiter"}
                </button>
                <button type="button" className="FormAndResultButtonBack" onClick={onBack} disabled={isLoading}>
                    Zurück
                </button>
            </div>
        </form>
    );
}
