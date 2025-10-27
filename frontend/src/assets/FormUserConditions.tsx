import { useState, type ChangeEvent, type FormEvent } from "react";
import type { UserConditions } from "../model/UserConditions";
import styles from "./FormUserConditions.module.css";

interface FormUserConditionsProps {
    formData: UserConditions;
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function FormUserConditions({
                                               formData,
                                               onChange,
                                               onSubmit,
                                           }: FormUserConditionsProps) {
    const [submitted, setSubmitted] = useState(false);

    const isValid =
        formData.montagePlace === true &&
        Number(formData.montageAngle) >= 0 &&
        formData.montageDirection !== "" &&
        Number(formData.montageShadeFactor) >= 0 &&
        Number(formData.montageShadeFactor) <= 1;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);

        if (isValid) {
            onSubmit(e);
        }
    };

    const getInputClass = (value: string | number, allowZero = false) => {
        if (!submitted) return styles.input;
        if (allowZero) {
            return value !== "" && value !== null && value !== undefined
                ? styles.input
                : `${styles.input} ${styles.inputError}`;
        }
        return value && Number(value) > 0
            ? styles.input
            : `${styles.input} ${styles.inputError}`;
    };


    const getSelectClass = (value: string) => {
        if (!submitted) return styles.select;
        return value ? styles.select : `${styles.select} ${styles.inputError}`;
    };

    const getCheckboxClass = (value: boolean) => {
        if (!submitted) return styles.checkbox;
        return value ? styles.checkbox : `${styles.checkbox} ${styles.inputError}`;
    };


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
                    checked={formData.montagePlace}
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
                    type="number"
                    name="montageAngle"
                    value={formData.montageAngle}
                    onChange={onChange}
                    className={getInputClass(formData.montageAngle, true)}
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
                    className={getSelectClass(formData.montageDirection)}
                >
                    <option value="">Bitte wählen</option>
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
                    Verschattung am Tag
                </label>
                <input
                    id="montageShadeFactor"
                    type="number"
                    name="montageShadeFactor"
                    value={formData.montageShadeFactor}
                    onChange={onChange}
                    min={0}
                    max={1}
                    step={0.1}
                    className={getInputClass(formData.montageShadeFactor, true)}
                />
            </div>

            {submitted && !isValid && (
                <p className={styles.error}>Bitte fülle alle Felder korrekt aus.</p>
            )}

            <button type="submit" className={styles.button}>
                Speichern und weiter
            </button>
        </form>
    );
}
