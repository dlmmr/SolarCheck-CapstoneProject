import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO";
import type { Direction } from "../dto/Direction";
import type { UserPvConfig } from "../dto/UserPvConfig";
import UserConditionsAsset, { type UserConditionsFormData } from "../assets/UserConditionsAsset";

const DIRECTION_VALUES: Set<Direction> = new Set([
    "NORTH", "NORTHEAST", "EAST", "SOUTHEAST",
    "SOUTH", "SOUTHWEST", "WEST", "NORTHWEST",
]);

const PV_CONFIG_VALUES: Set<UserPvConfig> = new Set([
    "CHEAP_PV_COMBI",
    "MEDIUM_PV_COMBI",
    "PREMIUM_PV_COMBI",
]);

export default function UserConditionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state as { user?: UserResponseDTO; formData?: UserConditionsDTO } | null;
    const user = locationState?.user ?? null;

    const [formData, setFormData] = useState<UserConditionsFormData>({
        userPvConfig: locationState?.formData?.userPvConfig ?? user?.userConditions?.userPvConfig ?? "",
        montageAngle: locationState?.formData?.montageAngle ?? user?.userConditions?.montageAngle ?? "",
        montageDirection: locationState?.formData?.montageDirection ?? user?.userConditions?.montageDirection ?? "",
        montageShadeFactor: locationState?.formData?.montageShadeFactor ?? user?.userConditions?.montageShadeFactor ?? "",
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { if (!user) navigate("/"); }, [user, navigate]);
    if (!user) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number = value;
        if (type === "number") {
            newValue = value === "" ? "" : Number(value);
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const validateAndParseNumber = (
        value: string | number,
        fieldName: string,
        min: number,
        max: number
    ): number | null => {
        // Konvertiere zu String für einheitliche Behandlung
        const strValue = String(value).trim();

        if (strValue === "") {
            setMessage(`❌ ${fieldName} darf nicht leer sein.`);
            return null;
        }

        const parsed = Number.parseFloat(strValue);

        if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
            setMessage(`❌ ${fieldName} muss eine gültige Zahl sein.`);
            return null;
        }

        if (parsed < min || parsed > max) {
            setMessage(`❌ ${fieldName} muss zwischen ${min} und ${max} liegen.`);
            return null;
        }

        return parsed;
    };

    const validatePvConfig = (value: UserPvConfig | ""): value is UserPvConfig => {
        if (value === "") {
            setMessage("❌ Bitte PV-Modul auswählen.");
            return false;
        }
        if (!PV_CONFIG_VALUES.has(value)) {
            setMessage("❌ Ungültiges PV-Modul!");
            return false;
        }
        return true;
    };

    const validateDirection = (value: Direction | ""): value is Direction => {
        if (value === "") {
            setMessage("❌ Bitte Montagerichtung auswählen.");
            return false;
        }
        if (!DIRECTION_VALUES.has(value)) {
            setMessage("❌ Ungültige Montagerichtung!");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validierung mit Type Guards
        if (!validatePvConfig(formData.userPvConfig)) return;
        if (!validateDirection(formData.montageDirection)) return;

        const montageAngle = validateAndParseNumber(formData.montageAngle, "Montagewinkel", 0, 90);
        if (montageAngle === null) return;

        const montageShadeFactor = validateAndParseNumber(formData.montageShadeFactor, "Verschattung", 0, 1);
        if (montageShadeFactor === null) return;

        // Jetzt sind alle Werte validiert und haben die richtigen Typen
        const userConditions: UserConditionsDTO = {
            userPvConfig: formData.userPvConfig,
            montageAngle,
            montageDirection: formData.montageDirection,
            montageShadeFactor,
        };

        setIsLoading(true);
        try {
            await axios.put(`/api/home/${user.userId}/conditions`, userConditions);
            const resultResponse = await axios.post(`/api/home/${user.userId}/result`);
            setMessage("✅ Daten erfolgreich gespeichert!");
            navigate("/result", { state: { user: resultResponse.data } });
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

    const handleBack = () => {
        if (isLoading) return;
        navigate("/userinfo", { state: { userId: user.userId, formData: user.userInfo } });
    };

    return (
        <div className="page">
            <h1>Deine Angaben</h1>
            <UserConditionsAsset
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onBack={handleBack}
                isLoading={isLoading}
            />
            {message && (
                <p className={message.startsWith("✅") ? "success" : "error"}>{message}</p>
            )}
        </div>
    );
}