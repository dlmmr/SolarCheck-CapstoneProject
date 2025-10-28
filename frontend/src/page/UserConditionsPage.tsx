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
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = 'checked' in e.target ? e.target.checked : undefined;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value
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
        const parsed = parseFloat(trimmed);

        // Validate the parsed number
        if (!Number.isFinite(parsed) || isNaN(parsed)) {
            setMessage(`❌ ${fieldName} muss eine gültige Zahl sein.`);
            return null;
        }

        return parsed;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.userId) {
            setMessage("❌ Keine Benutzer-ID vorhanden!");
            return;
        }

        // Validate and parse numeric fields
        const montageAngle = validateAndParseNumber(formData.montageAngle, "Montagewinkel");
        if (montageAngle === null) return;

        const montageShadeFactor = validateAndParseNumber(formData.montageShadeFactor, "Verschattungsfaktor");
        if (montageShadeFactor === null) return;

        // Build DTO only after successful validation
        const userConditions: UserConditionsDTO = {
            montagePlace: formData.montagePlace,
            montageAngle: montageAngle,
            montageDirection: formData.montageDirection as UserConditionsDTO["montageDirection"],
            montageShadeFactor: montageShadeFactor,
        };

        setIsLoading(true);
        try {
            await axios.put<UserResponseDTO>(`/api/home/${user.userId}/conditions`, userConditions);
            const resultResponse = await axios.post<UserResponseDTO>(`/api/home/${user.userId}/result`);
            setMessage("✅ Berechnung erfolgreich!");
            setTimeout(() => {
                navigate("/result", { state: { user: resultResponse.data } });
                }, 300);
        } catch (error: unknown) {
            console.error("API Error:", error);

            // sichere Typprüfung
            let errorMsg = "Fehler beim Speichern oder Berechnen.";
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
            <h2>Montageinformationen</h2>
            <UserConditionsAsset
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onBack={() => navigate("/userinfo", { state: { userId: user.userId, formData: user.userInfo } })}
                isLoading={isLoading}
            />
            {message && (
                <p className={message.startsWith("✅") ? "success" : "error"}>{message}</p>
            )}
        </div>
    );
}