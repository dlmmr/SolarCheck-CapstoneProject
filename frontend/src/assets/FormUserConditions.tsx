import type { ChangeEvent, FormEvent } from "react";
import type { UserConditions } from "../model/UserConditions";
import styles from "./FormUserConditions.module.css"; // 👈 CSS Module importieren

interface FormUserConditionsProps {
    formData: UserConditions;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function FormUserConditions({ formData, onChange, onSubmit }: FormUserConditionsProps) {
    return (
        <form onSubmit={onSubmit} className={styles.container}>
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
                    className={styles.checkbox}
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
                    className={styles.input}
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
                    className={styles.select}
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
                <label htmlFor="montageSunhours" className={styles.label}>
                    Sonnenstunden pro Tag
                </label>
                <input
                    id="montageSunhours"
                    type="number"
                    name="montageSunhours"
                    value={formData.montageSunhours}
                    onChange={onChange}
                    className={styles.input}
                />
            </div>

            <button type="submit" className={styles.button}>
                Speichern und weiter
            </button>
        </form>
    );
}
