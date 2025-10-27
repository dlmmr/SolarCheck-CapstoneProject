import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FormUserConditions from "../assets/FormUserConditions";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO";


export default function UserConditionsForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state as { user: UserResponseDTO } || {};

    const [formData, setFormData] = useState<UserConditionsDTO>({
        montagePlace: user?.userConditions?.montagePlace ?? false,
        montageAngle: user?.userConditions?.montageAngle ?? 0,
        montageDirection: user?.userConditions?.montageDirection ?? "NORTH",
        montageShadeFactor: user?.userConditions?.montageShadeFactor ?? 0,
    });
    const [message, setMessage] = useState("");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;

        let value: string | number | boolean;

        if (target instanceof HTMLInputElement) {
            if (target.type === "checkbox") {
                value = target.checked; // ✅ nur hier
            } else if (target.type === "number") {
                value = Number(target.value);
            } else {
                value = target.value;
            }
        } else {
            // HTMLSelectElement oder HTMLTextAreaElement
            value = target.value;
        }

        setFormData((prev) => ({
            ...prev,
            [target.name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden! Bitte starte erneut.");
            return;
        }

        try {
            // 1️⃣ UserConditions speichern
            await axios.put<UserResponseDTO>(`/api/home/${user.userId}/conditions`, formData);
            console.log("✅ UserConditions gespeichert");

            // 2️⃣ Direkt die Berechnung auslösen
            const resultResponse = await axios.post<UserResponseDTO>(`/api/home/${user.userId}/result`);
            const resultUser = resultResponse.data;

            console.log("✅ Berechnung durchgeführt:", resultUser);
            setMessage("✅ Berechnung erfolgreich!");

            // 3️⃣ Weiterleiten auf Result-Page
            setTimeout(() => {
                navigate("/result", { state: { user: resultUser } });
            }, 500);
        } catch (error) {
            console.error("Fehler:", error);
            setMessage("❌ Fehler beim Speichern oder Berechnen.");
        }
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
                <p className={`mt-4 text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
