import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserConditionsAsset, { type UserConditionsFormData } from "../assets/UserConditionsAsset";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO";

export default function UserConditionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, formData: initialData } = location.state as { user: UserResponseDTO, formData?: UserConditionsDTO };

    // State nutzt UserConditionsFormData (erlaubt leere Strings)
    const [formData, setFormData] = useState<UserConditionsFormData>(
        initialData ?? {
            montagePlace: user?.userConditions?.montagePlace ?? false,
            montageAngle: user?.userConditions?.montageAngle ?? "",
            montageDirection: user?.userConditions?.montageDirection ?? "",
            montageShadeFactor: user?.userConditions?.montageShadeFactor ?? "",
        }
    );

    const [message, setMessage] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target;
        let value: string | number | boolean;

        if (target instanceof HTMLInputElement) {
            if (target.type === "checkbox") {
                value = target.checked;
            } else if (target.type === "number") {
                value = target.value === "" ? "" : Number(target.value);
            } else {
                value = target.value;
            }
        } else {
            value = target.value;
        }

        setFormData(prev => ({ ...prev, [target.name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden!");
            return;
        }

        // Konvertiere zu UserConditionsDTO (nur numbers) für die API
        const userConditions: UserConditionsDTO = {
            montagePlace: formData.montagePlace,
            montageAngle: Number(formData.montageAngle),
            montageDirection: formData.montageDirection as UserConditionsDTO["montageDirection"],
            montageShadeFactor: Number(formData.montageShadeFactor),
        };

        try {
            await axios.put<UserResponseDTO>(`/api/home/${user.userId}/conditions`, userConditions);
            const resultResponse = await axios.post<UserResponseDTO>(`/api/home/${user.userId}/result`);
            const resultUser = resultResponse.data;

            setMessage("✅ Berechnung erfolgreich!");
            navigate("/result", { state: { user: resultUser } });
        } catch (error) {
            console.error("API Error:", error);
            setMessage("❌ Fehler beim Speichern oder Berechnen.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Montageinformationen</h2>
            <UserConditionsAsset
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onBack={() => navigate("/userinfo", { state: { userId: user.userId, formData: user.userInfo } })}
            />
            {message && (
                <p className={`mt-4 text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}