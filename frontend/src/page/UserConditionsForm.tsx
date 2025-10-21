import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FormUserConditions from "../assets/FormUserConditions";
import type { User } from "../model/User";
import type { UserConditions } from "../model/UserConditions";

export default function UserConditionsForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state as { user: User } || {};

    const [formData, setFormData] = useState<UserConditions>({
        montagePlace: user?.userConditions?.montagePlace || false,
        montageAngle: user?.userConditions?.montageAngle || 0,
        montageDirection: user?.userConditions?.montageDirection || "",
        montageSunhours: user?.userConditions?.montageSunhours || 0,
    });

    const [message, setMessage] = useState("");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;
        const name = target.name;

        let value: string | number | boolean;

        if (target instanceof HTMLInputElement) {
            if (target.type === "checkbox") {
                value = target.checked;
            } else if (target.type === "number") {
                value = Number(target.value);
            } else {
                value = target.value;
            }
        } else {
            // select oder textarea
            value = target.value;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden! Bitte starte erneut.");
            return;
        }

        axios
            .put<User>(`/api/home/${user.userId}/conditions`, formData)
            .then((response) => {
                const updatedUser = response.data;
                console.log("✅ User mit UserConditions & UserResult empfangen:", updatedUser);
                setMessage("✅ Daten erfolgreich gespeichert!");

                // Beispiel: nach 1 Sekunde weiter zur Ergebnis-Seite
                setTimeout(() => {
                    navigate("/result", { state: { user: updatedUser } });
                }, 1200);
            })
            .catch((error) => {
                console.error("Fehler beim Speichern:", error);
                setMessage("❌ Fehler beim Speichern der Daten.");
            });
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Montageinformationen</h2>

            <FormUserConditions
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />

            {message && (
                <p
                    className={`mt-4 text-center ${
                        message.startsWith("✅") ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
