import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "../styles/UserConditions.module.css";

// Eigener Type für das Formular - erlaubt leere Strings/undefined
export interface UserConditionsFormData {
    montagePlace: boolean;
    montageAngle: number | "";
    montageDirection: string;
    montageShadeFactor: number | "";
}

interface FormUserConditionsProps {
    formData: UserConditionsFormData;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

export default function UserConditionsAsset({
                                                formData,
                                                onChange,
                                                onSubmit,
                                                onBack,
                                            }: FormUserConditionsProps) {
    const [submitted, setSubmitted] = useState(false);

    // Validierung
    const angleValid =
        formData.montageAngle !== "" &&
        Number(formData.montageAngle) >= 0 &&
        Number(formData.montageAngle) <= 90;

    const directionValid =
        formData.montageDirection !== "" &&
        formData.montageDirection !== undefined;

    const shadeValid =
        formData.montageShadeFactor !== "" &&
        Number(formData.montageShadeFactor) >= 0 &&
        Number(formData.montageShadeFactor) <= 1;

    const isValid =
        formData.montagePlace === true &&
        angleValid &&
        directionValid &&
        shadeValid;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);

        if (isValid) {
            onSubmit(e);
        }
    };

    // Hilfsfunktionen für CSS-Klassen
    const getInputClass = (isFieldValid: boolean) =>
        !submitted ? styles.input : isFieldValid ? styles.input : `${styles.input} ${styles.inputError}`;

    const getSelectClass = (isFieldValid: boolean) =>
        !submitted ? styles.select : isFieldValid ? styles.select : `${styles.select} ${styles.inputError}`;

    const getCheckboxClass = (isFieldValid: boolean) =>
        !submitted ? styles.checkbox : isFieldValid ? styles.checkbox : `${styles.checkbox} ${styles.inputError}`;

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div className={styles.formGroup}>
                <label htmlFor="montagePlace" className={styles.label}>
                    Montage vorhanden
                </label>
                <input
                    id="montagePlace"
                    type="checkbox"
                    name="montagePlace"
                    checked={!!formData.montagePlace}
                    onChange={onChange}
                    className={getCheckboxClass(formData.montagePlace)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="montageAngle" className={styles.label}>
                    Montagewinkel (°)
                </label>
                <input
                    id="montageAngle"
                    placeholder="z.B. 30"
                    type="number"
                    name="montageAngle"
                    value={formData.montageAngle}
                    onChange={onChange}
                    min={0}
                    max={90}
                    step={5}
                    className={getInputClass(angleValid)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="montageDirection" className={styles.label}>
                    Ausrichtung
                </label>
                <select
                    id="montageDirection"
                    name="montageDirection"
                    value={formData.montageDirection}
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

            <div className={styles.formGroup}>
                <label htmlFor="montageShadeFactor" className={styles.label}>
                    Verschattung am Tag (0 = keine, 1 = komplett)
                </label>
                <input
                    id="montageShadeFactor"
                    placeholder="z.B. 0.3"
                    type="number"
                    name="montageShadeFactor"
                    value={formData.montageShadeFactor}
                    onChange={onChange}
                    min={0}
                    max={1}
                    step={0.1}
                    className={getInputClass(shadeValid)}
                />
            </div>

            {submitted && !isValid && (
                <p className={styles.error}>Bitte fülle alle Felder korrekt aus.</p>
            )}

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.buttonBack} onClick={onBack}>
                    Zurück
                </button>
                <button type="submit" className={styles.button}>
                    Speichern und weiter
                </button>
            </div>
        </form>
    );
}