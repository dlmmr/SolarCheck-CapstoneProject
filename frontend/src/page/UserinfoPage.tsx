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

    const [formData, setFormData] = useState<UserInfoFormData>({
        userRateOfElectricity: initialData?.userRateOfElectricity ?? "",
        userHouseholdNumber: initialData?.userHouseholdNumber ?? "",
        userElectricityConsumption: initialData?.userElectricityConsumption ?? "",
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === "" ? "" : Number(value),
        }));
    };

    const validateAndParseNumber = (value: string | number, fieldName: string): number | null => {
        // If already a number, validate it
        if (typeof value === "number") {
            return Number.isFinite(value) ? value : null;
        }

        // Trim whitespace from string
        const trimmed = String(value).trim();

        // Check if empty
        if (trimmed === "") {
            setMessage(`❌ ${fieldName} darf nicht leer sein.`);
            return null;
        }

        // Parse to number
        const parsed = Number.parseFloat(trimmed);

        // Validate the parsed number
        if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
            setMessage(`❌ ${fieldName} muss eine gültige Zahl sein.`);
            return null;
        }

        return parsed;
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden!");
            return;
        }

        // Validate and parse numeric fields
        const userRateOfElectricity = validateAndParseNumber(formData.userRateOfElectricity, "Stromtarif");
        if (userRateOfElectricity === null) return;

        const userHouseholdNumber = validateAndParseNumber(formData.userHouseholdNumber, "Haushaltsgröße");
        if (userHouseholdNumber === null) return;

        const userElectricityConsumption = validateAndParseNumber(formData.userElectricityConsumption, "Stromverbrauch");
        if (userElectricityConsumption === null) return;

        // Build UserInfo object only after successful validation
        const userInfo: UserInfo = {
            userRateOfElectricity: userRateOfElectricity,
            userHouseholdNumber: userHouseholdNumber,
            userElectricityConsumption: userElectricityConsumption,
        };

        setIsLoading(true);
        try {
            const res = await axios.put<UserResponseDTO>(`/api/home/${userId}/info`, userInfo);
            setMessage("✅ Daten erfolgreich gespeichert!");
            navigate("/userConditions", { state: { user: res.data, formData: userInfo } });
        } catch (error: unknown) {
            console.error("API Error:", error);

            let errorMsg = "Fehler beim Speichern der Daten.";
            if (axios.isAxiosError(error) && error.response?.data) {
                errorMsg = (error.response.data as { message?: string }).message || errorMsg;
            }

            setMessage(`❌ ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <h1>Deine Angaben</h1>
            <UserinfoAsset
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onBack={() => navigate("/", { state: { formData } })}
                isLoading={isLoading}
            />
            {message && (
                <p className={message.startsWith("✅") ? "success" : "error"}>{message}</p>
            )}
        </div>
    );
}