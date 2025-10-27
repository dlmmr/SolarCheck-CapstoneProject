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
        montagePlace: user?.userConditions?.montagePlace ?? false,
        montageAngle: user?.userConditions?.montageAngle ?? 0,
        montageDirection: user?.userConditions?.montageDirection ?? "",
        montageShadeFactor: user?.userConditions?.montageShadeFactor ?? 0,
    });

    const [message, setMessage] = useState("");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;
        const name = target.name;

        let value: string | number | boolean;

        if (target instanceof HTMLInputElement) {
            if (target.type === "checkbox") value = target.checked;
            else if (target.type === "number") value = Number(target.value);
            else value = target.value;
        } else {
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

        // 1️⃣ UserConditions speichern
        axios
            .put<User>(`/api/home/${user.userId}/conditions`, formData)
            .then((response) => {
                const updatedUser = response.data;
                console.log("✅ UserConditions gespeichert:", updatedUser);

                // 2️⃣ Direkt die Berechnung auslösen
                return axios.post<User>(`/api/home/${user.userId}/result`);
            })
            .then((resultResponse) => {
                const resultUser = resultResponse.data;
                console.log("✅ Berechnung durchgeführt:", resultUser);
                setMessage("✅ Berechnung erfolgreich!");

                // 3️⃣ Weiterleiten auf Result-Page mit den berechneten Daten
                setTimeout(() => {
                    navigate("/result", { state: { user: resultUser } });
                }, 500);
            })
            .catch((error) => {
                console.error("Fehler:", error);
                setMessage("❌ Fehler beim Speichern oder Berechnen.");
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
