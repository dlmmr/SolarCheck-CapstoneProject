import type { ChangeEvent, FormEvent } from "react";
import styles from "./FormUserinfo.module.css";

interface FormUserinfoProps {
    formData: {
        userRateOfElectricity: string;
        userHouseholdNumber: string;
        userElectricityConsumption: string;
    };
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function FormUserinfo({ formData, onChange, onSubmit }: FormUserinfoProps) {
    return (
        <form onSubmit={onSubmit} className={styles.container}>
            <div>
                <label htmlFor="userRateOfElectricity" className={styles.label}>
                    Strompreis (ct/kWh)
                </label>
                <input
                    id="userRateOfElectricity"
                    type="text"
                    name="userRateOfElectricity"
                    value={formData.userRateOfElectricity}
                    onChange={onChange}
                    className={styles.input}
                />
            </div>

            <div>
                <label htmlFor="userHouseholdNumber" className={styles.label}>
                    Anzahl im Haushalt
                </label>
                <input
                    id="userHouseholdNumber"
                    type="number"
                    name="userHouseholdNumber"
                    value={formData.userHouseholdNumber}
                    onChange={onChange}
                    className={styles.input}
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
                    className={styles.input}
                />
            </div>

            <button type="submit" className={styles.button}>
                Speichern und weiter
            </button>
        </form>
    );
}
