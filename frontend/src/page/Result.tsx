import { useLocation, useNavigate } from "react-router-dom";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import styles from "./Result.module.css";

export default function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { user } = location.state as { user: UserResponseDTO } || {};

    if (!user?.userResult) {
        return (
            <div className={styles.container}>
                <h2 className="text-2xl font-semibold mb-4">Ergebnis</h2>
                <p className="text-red-600">❌ Keine Berechnung vorhanden. Bitte zuerst die Bedingungen eingeben.</p>
                <button className={styles.button} onClick={() => navigate(-1)}>Zurück</button>
            </div>
        );
    }

    const { userPossibleElectricityGeneration, userAmountOfPossibleSavings, userAmortisationTime } = user.userResult;

    return (
        <div className={styles.container}>
            <h2 className="text-2xl font-semibold mb-4">Ergebnis deines Balkonkraftwerks</h2>

            <div className={styles.resultGroup}>
                <span className={styles.label}>Möglicher Jahresertrag:</span>
                <span className={styles.value}>{userPossibleElectricityGeneration} kWh</span>
            </div>

            <div className={styles.resultGroup}>
                <span className={styles.label}>Mögliche Einsparung:</span>
                <span className={styles.value}>{userAmountOfPossibleSavings} €</span>
            </div>

            <div className={styles.resultGroup}>
                <span className={styles.label}>Amortisationszeit:</span>
                <span className={styles.value}>{userAmortisationTime} Jahre</span>
            </div>

            <button className={styles.button} onClick={() => navigate(-1)}>Zurück zu den Bedingungen</button>
        </div>
    );
}
