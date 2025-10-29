import { useState, type ChangeEvent, type FormEvent } from "react";
import "../app.css"; // wir greifen direkt auf globale Container-Klassen zu

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
    const isConsumptionValid =
        userElectricityConsumption !== "" && userElectricityConsumption >= 100 && userElectricityConsumption <= 100000;
    const isValid = isRateValid && isHouseholdValid && isConsumptionValid;

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
                <div>
                    <label htmlFor="userRateOfElectricity" className="FormAndResultLabel">Strompreis (ct/kWh)</label>
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
                    <label htmlFor="userHouseholdNumber" className="FormAndResultLabel">Anzahl der Personen im Haushalt</label>
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
                    <label htmlFor="userElectricityConsumption" className="FormAndResultLabel">Stromverbrauch (kWh/Jahr)</label>
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
