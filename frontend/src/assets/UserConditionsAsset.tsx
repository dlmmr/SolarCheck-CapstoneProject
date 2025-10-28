import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "../styles/UserConditions.module.css";

export interface UserConditionsFormData {
    montagePlace: boolean;
    montageAngle: number | "";
    montageDirection: string;
    montageShadeFactor: number | "";
}

interface FormUserConditionsProps {
    readonly formData: UserConditionsFormData;
    readonly onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
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
                                            }: FormUserConditionsProps) {
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

    const getInputClass = (valid: boolean) => !submitted || valid ? styles.input : `${styles.input} ${styles.inputError}`;
    const getSelectClass = (valid: boolean) => !submitted || valid ? styles.select : `${styles.select} ${styles.inputError}`;
    const getCheckboxClass = (valid: boolean) => !submitted || valid ? styles.checkbox : `${styles.checkbox} ${styles.inputError}`;

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div className={styles.formGroup}>
                <label htmlFor="montagePlace" className={styles.label}>Montage vorhanden</label>
                <input
                    id="montagePlace"
                    type="checkbox"
                    name="montagePlace"
                    checked={montagePlace}
                    onChange={onChange}
                    className={getCheckboxClass(montagePlace)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="montageAngle" className={styles.label}>Montagewinkel (°)</label>
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

            <div className={styles.formGroup}>
                <label htmlFor="montageDirection" className={styles.label}>Ausrichtung</label>
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

            <div className={styles.formGroup}>
                <label htmlFor="montageShadeFactor" className={styles.label}>Verschattung am Tag (0 = keine, 1 = komplett)</label>
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

            {submitted && !isValid && <p className={styles.error}>Bitte fülle alle Felder korrekt aus.</p>}

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.buttonBack} onClick={onBack} disabled={isLoading}>Zurück</button>
                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? "Speichern..." : "Speichern und weiter"}
                </button>
            </div>
        </form>
    );
}
