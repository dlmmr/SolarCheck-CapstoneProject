import styles from "../styles/Home.module.css";

interface HomeAssetProps {
    readonly message: string;
    readonly onCreateUser: () => void;
}

export default function HomeAsset({ message, onCreateUser }: HomeAssetProps) {
    const isSuccess = message.startsWith("✅");

    return (
        <main className={styles.HomeContainer} role="main">
            <div className={styles.HomeContent}>
                <h1 className={styles.HomeTitle}>
                    Willkommen zur SolarCheck-App
                </h1>

                <p className={styles.HomeText}>
                    Hier kannst du berechnen, ob sich ein Balkonkraftwerk für dich lohnt.
                </p>

                <button
                    onClick={onCreateUser}
                    className={styles.HomeButton}
                    type="button"
                    aria-label="Berechnung starten"
                >
                    Berechnung starten
                </button>

                {message && (
                    <output
                        className={isSuccess ? styles.HomeSuccess : styles.HomeError}
                        aria-live="polite"
                    >
                        {message}
                    </output>
                )}

            </div>
        </main>
    );
}