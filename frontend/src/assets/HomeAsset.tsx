
import styles from "../styles/Home.module.css";

interface HomeAssetProps {
    readonly message: string;
    readonly onCreateUser: () => void;
}

export default function HomeAsset({ message, onCreateUser }: HomeAssetProps) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Willkommen zur SolarCheck-App</h1>
            <p className={styles.text}>
                Hier kannst du berechnen, ob sich ein Balkonkraftwerk für dich lohnt.
            </p>

            <button onClick={onCreateUser} className={styles.button}>
                Los geht’s
            </button>

            {message && (
                <p className={message.startsWith("✅") ? styles.success : styles.error}>
                    {message}
                </p>
            )}
        </div>
    );
}
