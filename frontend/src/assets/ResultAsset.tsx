import type { UserResponseDTO } from "../dto/UserResponseDTO";
import styles from "../styles/Result.module.css";

interface Props {
    user: UserResponseDTO | undefined;
    goBack: () => void;
}

export default function ResultAsset({ user, goBack }: Props) {
    if (!user?.userResult) {
        return (
            <div className={styles.container}>
                <h2>Ergebnis</h2>
                <p className="text-red-600">Keine Berechnung vorhanden.</p>
                <button className={styles.button} onClick={goBack}>Zurück</button>
            </div>
        );
    }

    const { userPossibleElectricityGeneration, userAmountOfPossibleSavings, userAmortisationTime } = user.userResult;

    return (
        <div className={styles.container}>
            <h2>Ergebnis deines Balkonkraftwerks</h2>

            <div className={styles.resultGroup}>
                <span className={styles.label}>Jahresertrag:</span>
                <span className={styles.value}>{userPossibleElectricityGeneration} kWh</span>
            </div>

            <div className={styles.resultGroup}>
                <span className={styles.label}>Ersparnis:</span>
                <span className={styles.value}>{userAmountOfPossibleSavings} €</span>
            </div>

            <div className={styles.resultGroup}>
                <span className={styles.label}>Amortisation:</span>
                <span className={styles.value}>{userAmortisationTime} Jahre</span>
            </div>

            <button className={styles.button} onClick={goBack}>Zurück</button>
        </div>
    );
}
