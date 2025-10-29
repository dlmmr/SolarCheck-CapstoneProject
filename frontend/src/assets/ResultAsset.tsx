import type { UserResponseDTO } from "../dto/UserResponseDTO";
import "../app.css";

interface Props {
    readonly user: UserResponseDTO | undefined;
    readonly goBack: () => void;
}

export default function ResultAsset({ user, goBack }: Props) {
    if (!user?.userResult) {
        return (
            <div className="FormAndResultContainer">
                <h2>Ergebnis</h2>
                <p className="FormAndResultError">Keine Berechnung vorhanden.</p>
                <button className="FormAndResultButton" onClick={goBack}>Zurück</button>
            </div>
        );
    }

    const { userPossibleElectricityGeneration, userAmountOfPossibleSavings, userAmortisationTime } = user.userResult;

    return (
        <div className="FormAndResultContainer">

            <div className="FormAndResultContent">
                <div className="ResultGroup">
                    <span className="ResultLabel">Jahresertrag:</span>
                    <span className="ResultValue">{userPossibleElectricityGeneration} kWh</span>
                </div>
                <div className="ResultGroup">
                    <span className="ResultLabel">Ersparnis:</span>
                    <span className="ResultValue">{userAmountOfPossibleSavings} €</span>
                </div>
                <div className="ResultGroup">
                    <span className="ResultLabel">Amortisation:</span>
                    <span className="ResultValue">{userAmortisationTime} Jahre</span>
                </div>
            </div>

            <button className="FormAndResultButton" onClick={goBack}>Zurück</button>
        </div>
    );
}
