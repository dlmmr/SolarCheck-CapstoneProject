import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "../styles/Userinfo.module.css";

export interface UserInfoFormData {
    userRateOfElectricity: number | "";
    userHouseholdNumber: number | "";
    userElectricityConsumption: number | "";
}

interface UserinfoAssetProps {
    readonly formData: UserInfoFormData;
    readonly onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    readonly onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    readonly onBack: () => void;
    readonly isLoading?: boolean;
}

export default function UserinfoAsset({
                                          formData,
                                          onChange,
                                          onSubmit,
                                          onBack,
                                          isLoading = false,
                                      }: UserinfoAssetProps) {
    const [submitted, setSubmitted] = useState(false);
    const { userRateOfElectricity = "", userHouseholdNumber = "", userElectricityConsumption = "" } = formData;

    const isRateValid = userRateOfElectricity !== "" && userRateOfElectricity >= 1 && userRateOfElectricity <= 500;
    const isHouseholdValid = userHouseholdNumber !== "" && userHouseholdNumber >= 1 && userHouseholdNumber <= 20;
    const isConsumptionValid = userElectricityConsumption !== "" && userElectricityConsumption >= 100 && userElectricityConsumption <= 100000;
    const isValid = isRateValid && isHouseholdValid && isConsumptionValid;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        if (isValid) onSubmit(e);
    };

    const getInputClass = (valid: boolean) => !submitted || valid ? styles.input : `${styles.input} ${styles.inputError}`;

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div>
                <label htmlFor="userRateOfElectricity" className={styles.label}>Strompreis (ct/kWh)</label>
                <input
                    id="userRateOfElectricity"
                    type="number"
                    name="userRateOfElectricity"
                    value={userRateOfElectricity}
                    onChange={onChange}
                    min={1}
                    max={500}
                    step={1}
                    placeholder="z.B. 30"
                    className={getInputClass(isRateValid)}
                />
            </div>

            <div>
                <label htmlFor="userHouseholdNumber" className={styles.label}>Anzahl der Personen im Haushalt</label>
                <input
                    id="userHouseholdNumber"
                    type="number"
                    name="userHouseholdNumber"
                    value={userHouseholdNumber}
                    onChange={onChange}
                    min={1}
                    max={20}
                    step={1}
                    placeholder="z.B. 2"
                    className={getInputClass(isHouseholdValid)}
                />
            </div>

            <div>
                <label htmlFor="userElectricityConsumption" className={styles.label}>Stromverbrauch (kWh/Jahr)</label>
                <input
                    id="userElectricityConsumption"
                    type="number"
                    name="userElectricityConsumption"
                    value={userElectricityConsumption}
                    onChange={onChange}
                    min={100}
                    max={100000}
                    step={100}
                    placeholder="z.B. 3500"
                    className={getInputClass(isConsumptionValid)}
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
