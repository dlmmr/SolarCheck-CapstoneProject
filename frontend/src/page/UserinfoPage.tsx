import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import UserinfoAsset, { type UserInfoFormData } from "../assets/UserinfoAsset";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserInfo } from "../model/Userinfo";

export default function UserinfoPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, formData: initialData } = location.state || {};

    // State nutzt UserInfoFormData (erlaubt leere Strings)
    const [formData, setFormData] = useState<UserInfoFormData>({
        userRateOfElectricity: initialData?.userRateOfElectricity ?? "",
        userHouseholdNumber: initialData?.userHouseholdNumber ?? "",
        userElectricityConsumption: initialData?.userElectricityConsumption ?? "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;
        setFormData(prev => ({
            ...prev,
            [name]: value === "" ? "" : Number(value),
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden!");
            return;
        }

        // Konvertiere formData zu UserInfo (nur numbers) für die API
        const userInfo: UserInfo = {
            userRateOfElectricity: Number(formData.userRateOfElectricity),
            userHouseholdNumber: Number(formData.userHouseholdNumber),
            userElectricityConsumption: Number(formData.userElectricityConsumption),
        };

        axios.put<UserResponseDTO>(`/api/home/${userId}/info`, userInfo)
            .then(res => {
                const updatedUser = res.data;
                setMessage("✅ Daten erfolgreich gespeichert!");
                navigate("/userConditions", { state: { user: updatedUser, formData: userInfo } });
            })
            .catch((error) => {
                console.error("API Error:", error);
                const errorMsg = error.response?.data?.message || "Fehler beim Speichern der Daten.";
                setMessage(`❌ ${errorMsg}`);
            });
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Deine Angaben</h2>
            <UserinfoAsset
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onBack={() => navigate("/", { state: { formData } })}
            />
            {message && (
                <p className={`mt-4 text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}