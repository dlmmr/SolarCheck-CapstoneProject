import { useState, type ChangeEvent, type FormEvent } from "react";
import "../app.css";

export interface UserConditionsFormData {
    montagePlace: boolean;
    montageAngle: number | "";
    montageDirection: string;
    montageShadeFactor: number | "";
}

interface UserConditionsAssetProps {
    readonly formData: UserConditionsFormData;
    readonly onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    readonly onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    readonly onBack: () => void;
    readonly isLoading?: boolean;
}

export default function UserConditionsAsset({
                                                formData,
                                                onChange,
                                                onSubmit,
                                                onBack,
                                                isLoading = false,
                                            }: UserConditionsAssetProps) {
    const [submitted, setSubmitted] = useState(false);
    const { montagePlace = false, montageAngle = "", montageDirection = "", montageShadeFactor = "" } = formData;

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
    const getSelectClass = (valid: boolean) =>
        !submitted || valid ? "FormAndResultInput" : "FormAndResultInput FormAndResultInputError";

    return (
        <form onSubmit={handleSubmit} className="FormAndResultContainer">
            <div className="FormAndResultContent">
                <div>
                    <label htmlFor="montagePlace" className="FormAndResultLabel">Montage vorhanden</label>
                    <input
                        id="montagePlace"
                        type="checkbox"
                        name="montagePlace"
                        checked={montagePlace}
                        onChange={onChange}
                        className="FormAndResultInput"
                    />
                </div>

                <div>
                    <label htmlFor="montageAngle" className="FormAndResultLabel">Montagewinkel (°)</label>
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
                </div>

                <div>
                    <label htmlFor="montageDirection" className="FormAndResultLabel">Ausrichtung</label>
                    <select
                        id="montageDirection"
                        name="montageDirection"
                        value={montageDirection}
                        onChange={onChange}
                        className={getSelectClass(directionValid)}
                    >
                        <option value="" disabled>Ausrichtung PV-Anlage</option>
                        <option value="NORTH">Norden</option>
                        <option value="NORTHEAST">Nordosten</option>
                        <option value="EAST">Osten</option>
                        <option value="SOUTHEAST">Südosten</option>
                        <option value="SOUTH">Süden</option>
                        <option value="SOUTHWEST">Südwesten</option>
                        <option value="WEST">Westen</option>
                        <option value="NORTHWEST">Nordwesten</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="montageShadeFactor" className="FormAndResultLabel">Verschattung am Tag (0 = keine, 1 = komplett)</label>
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
                </div>

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
