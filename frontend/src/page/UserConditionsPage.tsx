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

    const [formData, setFormData] = useState<UserConditionsFormData>({
        montagePlace: initialData?.montagePlace ?? user?.userConditions?.montagePlace ?? false,
        montageAngle: initialData?.montageAngle ?? user?.userConditions?.montageAngle ?? "",
        montageDirection: initialData?.montageDirection ?? user?.userConditions?.montageDirection ?? "",
        montageShadeFactor: initialData?.montageShadeFactor ?? user?.userConditions?.montageShadeFactor ?? "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden!");
            return;
        }

        const userConditions: UserConditionsDTO = {
            montagePlace: formData.montagePlace,
            montageAngle: Number(formData.montageAngle),
            montageDirection: formData.montageDirection as UserConditionsDTO["montageDirection"],
            montageShadeFactor: Number(formData.montageShadeFactor),
        };

        try {
            await axios.put<UserResponseDTO>(`/api/home/${user.userId}/conditions`, userConditions);
            const resultResponse = await axios.post<UserResponseDTO>(`/api/home/${user.userId}/result`);
            setMessage("✅ Berechnung erfolgreich!");
            navigate("/result", { state: { user: resultResponse.data } });
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
