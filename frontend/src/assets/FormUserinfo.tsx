import { useState, type ChangeEvent, type FormEvent } from "react";
import type { UserInfo } from "../model/Userinfo";
import styles from "./FormUserinfo.module.css";

interface FormUserinfoProps {
    formData: UserInfo;
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function FormUserinfo({ formData, onChange, onSubmit }: FormUserinfoProps) {
    const [submitted, setSubmitted] = useState(false);

    const isValid =
        formData.userRateOfElectricity > 0 &&
        formData.userHouseholdNumber > 0 &&
        formData.userElectricityConsumption > 0;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);

        if (isValid) {
            onSubmit(e);
        }
    };

    const getInputClass = (value: number) => {
        if (!submitted) return styles.input;
        return value > 0 ? styles.input : `${styles.input} ${styles.inputError}`;
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div>
                <label htmlFor="userRateOfElectricity" className={styles.label}>
                    Strompreis (ct/kWh)
                </label>
                <input
                    id="userRateOfElectricity"
                    type="number"
                    name="userRateOfElectricity"
                    value={formData.userRateOfElectricity}
                    onChange={onChange}
                    className={getInputClass(formData.userRateOfElectricity)}
                />
            </div>

            <div>
                <label htmlFor="userHouseholdNumber" className={styles.label}>
                    Anzahl der Personen im Haushalt
                </label>
                <input
                    id="userHouseholdNumber"
                    type="number"
                    name="userHouseholdNumber"
                    value={formData.userHouseholdNumber}
                    onChange={onChange}
                    className={getInputClass(formData.userHouseholdNumber)}
                />
            </div>

            <div>
                <label htmlFor="userElectricityConsumption" className={styles.label}>
                    Stromverbrauch (kWh/Jahr)
                </label>
                <input
                    id="userElectricityConsumption"
                    type="number"
                    name="userElectricityConsumption"
                    value={formData.userElectricityConsumption}
                    onChange={onChange}
                    className={getInputClass(formData.userElectricityConsumption)}
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
