import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FormUserinfo from "../assets/FormUserinfo";
import type { UserInfoDTO } from "../dto/UserInfoDTO";
import type { UserResponseDTO } from "../dto/UserResponseDTO";

export default function UserFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = location.state || {};

    const [formData, setFormData] = useState<UserInfoDTO>({
        userRateOfElectricity: 0,
        userHouseholdNumber: 0,
        userElectricityConsumption: 0,
    });

    const [message, setMessage] = useState("");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden! Bitte starte erneut.");
            return;
        }

        axios
            .put<UserResponseDTO>(`/api/home/${userId}/info`, formData)
            .then((response) => {
                const updatedUser = response.data;
                console.log("✅ User mit UserInfo empfangen:", updatedUser);
                setMessage("✅ Daten erfolgreich gespeichert!");

                setTimeout(() => {
                    navigate("/userConditions", { state: { user: updatedUser } });
                }, 1200);
            })
            .catch((error) => {
                console.error("Fehler beim Speichern:", error);
                setMessage("❌ Fehler beim Speichern der Daten.");
            });
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Deine Angaben</h2>
            <FormUserinfo
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
