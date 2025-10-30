import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO";
import type { Direction } from "../dto/Direction";
import type { UserPvConfig } from "../dto/UserPvConfig";
import UserConditionsAsset, { type UserConditionsFormData } from "../assets/UserConditionsAsset";

// ✅ Set für Richtungsauswahl
const DIRECTION_VALUES: Set<Direction> = new Set([
    "NORTH", "NORTHEAST", "EAST", "SOUTHEAST",
    "SOUTH", "SOUTHWEST", "WEST", "NORTHWEST",
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

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const validateAndParseNumber = (value: string | number, fieldName: string, min: number, max: number): number | null => {
        if (value === "") {
            setMessage(`❌ ${fieldName} darf nicht leer sein.`);
            return null;
        }
        const parsed = Number(value);
        if (isNaN(parsed) || parsed < min || parsed > max) {
            setMessage(`❌ ${fieldName} muss zwischen ${min} und ${max} liegen.`);
            return null;
        }
        return parsed;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.userPvConfig) {
            setMessage("❌ Bitte PV-Modul auswählen.");
            return;
        }
        if (!DIRECTION_VALUES.has(formData.montageDirection as Direction)) {
            setMessage("❌ Ungültige Montagerichtung!");
            return;
        }

        const montageAngle = validateAndParseNumber(formData.montageAngle, "Montagewinkel", 0, 90);
        if (montageAngle === null) return;

        const montageShadeFactor = validateAndParseNumber(formData.montageShadeFactor, "Verschattung", 0, 1);
        if (montageShadeFactor === null) return;

        const userConditions: UserConditionsDTO = {
            userPvConfig: formData.userPvConfig as UserPvConfig,
            montageAngle,
            montageDirection: formData.montageDirection as Direction,
            montageShadeFactor,
        };

        setIsLoading(true);
        try {
            await axios.put(`/api/home/${user.userId}/conditions`, userConditions);
            const resultResponse = await axios.post(`/api/home/${user.userId}/result`);
            navigate("/result", { state: { user: resultResponse.data } });
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                const backendMessage =
                    responseData && typeof responseData === "object"
                        ? (responseData as { message?: string }).message
                        : undefined;
                setMessage(`❌ ${backendMessage ?? 'Fehler beim Speichern'}`);
            } else {
                setMessage("❌ Netzwerkfehler. Bitte erneut versuchen.");
            }
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
            {message && <p className="error">{message}</p>}
            <UserConditionsAsset
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onBack={handleBack}
                isLoading={isLoading}
            />
        </div>
    );
}
