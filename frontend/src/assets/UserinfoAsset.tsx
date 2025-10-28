import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "../styles/Userinfo.module.css";

// Eigener Type für das Formular - erlaubt leere Strings
export interface UserInfoFormData {
    userRateOfElectricity: number | "";
    userHouseholdNumber: number | "";
    userElectricityConsumption: number | "";
}

interface UserinfoAssetProps {
    formData: UserInfoFormData;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

export default function UserinfoAsset({ formData, onChange, onSubmit, onBack }: UserinfoAssetProps) {
    const [submitted, setSubmitted] = useState(false);

    // Validierung: Prüft ob Feld ausgefüllt UND im gültigen Bereich ist
    const isRateValid =
        formData.userRateOfElectricity !== "" &&
        Number(formData.userRateOfElectricity) >= 1 &&
        Number(formData.userRateOfElectricity) <= 500;

    const isHouseholdValid =
        formData.userHouseholdNumber !== "" &&
        Number(formData.userHouseholdNumber) >= 1 &&
        Number(formData.userHouseholdNumber) <= 20;

    const isConsumptionValid =
        formData.userElectricityConsumption !== "" &&
        Number(formData.userElectricityConsumption) >= 100 &&
        Number(formData.userElectricityConsumption) <= 100000;

    const isValid = isRateValid && isHouseholdValid && isConsumptionValid;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        if (isValid) onSubmit(e);
    };

    // Hilfsfunktion für CSS-Klassen basierend auf Validierung
    const getInputClass = (isFieldValid: boolean) =>
        !submitted ? styles.input : isFieldValid ? styles.input : `${styles.input} ${styles.inputError}`;

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div>
                <label htmlFor="userRateOfElectricity" className={styles.label}>
                    Strompreis (ct/kWh)
                </label>
                <input
                    id="userRateOfElectricity"
                    placeholder="z.B. 30"
                    type="number"
                    name="userRateOfElectricity"
                    value={formData.userRateOfElectricity}
                    onChange={onChange}
                    min={1}
                    max={500}
                    step={1}
                    className={getInputClass(isRateValid)}
                />
            </div>

            <div>
                <label htmlFor="userHouseholdNumber" className={styles.label}>
                    Anzahl der Personen im Haushalt
                </label>
                <input
                    id="userHouseholdNumber"
                    placeholder="z.B. 2"
                    type="number"
                    name="userHouseholdNumber"
                    value={formData.userHouseholdNumber}
                    onChange={onChange}
                    min={1}
                    max={20}
                    step={1}
                    className={getInputClass(isHouseholdValid)}
                />
            </div>

            <div>
                <label htmlFor="userElectricityConsumption" className={styles.label}>
                    Stromverbrauch (kWh/Jahr)
                </label>
                <input
                    id="userElectricityConsumption"
                    placeholder="z.B. 3500"
                    type="number"
                    name="userElectricityConsumption"
                    value={formData.userElectricityConsumption}
                    onChange={onChange}
                    min={100}
                    max={100000}
                    step={100}
                    className={getInputClass(isConsumptionValid)}
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