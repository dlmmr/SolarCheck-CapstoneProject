import {useState, type ChangeEvent, type FormEvent} from "react";
import "../App.css";

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

const TOOLTIPS = {
    electricity: "Trage hier den Preis ein, den du aktuell pro kWh zahlst (typisch in Deutschland: 30 bis 40 ct).",
    household: "Anzahl der Personen, die dauerhaft im Haushalt leben",
    consumption: "Trage hier deinen jährlichen Stromverbrauch in kWh ein (Richtwerte: 1 Person 2.000, 2 Personen 3.000, 4 Personen 4.500)."
};

export default function UserinfoAsset({
                                          formData,
                                          onChange,
                                          onSubmit,
                                          onBack,
                                          isLoading = false,
                                      }: UserinfoAssetProps) {
    const [submitted, setSubmitted] = useState(false);
    const {userRateOfElectricity = "", userHouseholdNumber = "", userElectricityConsumption = ""} = formData;

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
                <label htmlFor="userRateOfElectricity" className="FormAndResultLabel">
                    Dein aktueller Strompreis in ct/kWh{' '}
                    <span className="TooltipIcon" title={TOOLTIPS.electricity}>
                        ℹ️
                    </span>
                </label>
                <input
                    id="userRateOfElectricity"
                    type="number"
                    name="userRateOfElectricity"
                    value={userRateOfElectricity}
                    onChange={onChange}
                    min={1}
                    max={500}
                    step={1}
                    placeholder="z.B. 35"
                    className={getInputClass(isRateValid)}
                />

                <label htmlFor="userHouseholdNumber" className="FormAndResultLabel">
                    Personenanzahl im Haushalt{' '}
                    <span className="TooltipIcon" title={TOOLTIPS.household}>
                        ℹ️
                    </span>
                </label>
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

                <label htmlFor="userElectricityConsumption" className="FormAndResultLabel">
                    Jährlicher Stromverbrauch in kWh{' '}
                    <span className="TooltipIcon" title={TOOLTIPS.consumption}>
                        ℹ️
                    </span>
                </label>
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

                {submitted && !isValid && (
                    <p className="FormAndResultError" role="alert">
                        ⚠️ Bitte fülle alle Felder korrekt aus.
                    </p>
                )}
            </div>

            <div className="FormAndResultButtonGroup">
                <button type="submit" className="FormAndResultButton" disabled={isLoading}>
                    {isLoading ? "Speichern..." : "Weiter"}
                </button>
                <button type="button" className="FormAndResultButtonBack" onClick={onBack} disabled={isLoading}>
                    Zurück
                </button>
            </div>
        </form>
    );
}