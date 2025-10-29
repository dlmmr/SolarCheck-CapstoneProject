import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO";
import type { Direction } from "../dto/Direction";
import UserConditionsAsset, { type UserConditionsFormData } from "../assets/UserConditionsAsset";

// ✅ Use Set for existence checks
const DIRECTION_VALUES: Set<Direction> = new Set([
    "NORTH",
    "NORTHEAST",
    "EAST",
    "SOUTHEAST",
    "SOUTH",
    "SOUTHWEST",
    "WEST",
    "NORTHWEST",
]);

export default function UserConditionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state as { user?: UserResponseDTO; formData?: UserConditionsDTO } | null;
    const user = locationState?.user ?? null;

    const [formData, setFormData] = useState<UserConditionsFormData>({
        montagePlace: locationState?.formData?.montagePlace ?? user?.userConditions?.montagePlace ?? false,
        montageAngle: locationState?.formData?.montageAngle ?? user?.userConditions?.montageAngle ?? "",
        // ✅ Remove unnecessary assertion
        montageDirection: locationState?.formData?.montageDirection ?? user?.userConditions?.montageDirection ?? "",
        montageShadeFactor: locationState?.formData?.montageShadeFactor ?? user?.userConditions?.montageShadeFactor ?? "",
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { if (!user) navigate("/"); }, [user, navigate]);
    if (!user) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = "checked" in e.target ? e.target.checked : undefined;

        // ✅ Nested ternary extracted
        let newValue: string | number | boolean | undefined;
        if (type === "checkbox") newValue = checked;
        else if (type === "number") newValue = value === "" ? "" : Number(value);
        else newValue = value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const validateAndParseNumber = (value: string | number, label: string): number | null => {
        // ✅ Use Number.parseFloat
        const num = typeof value === "number" ? value : Number.parseFloat(value);
        if (!Number.isFinite(num)) { setMessage(`❌ ${label} ist ungültig.`); return null; }
        return num;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const montageAngle = validateAndParseNumber(formData.montageAngle, "Montagewinkel");
        if (montageAngle === null) return;

        const montageShadeFactor = validateAndParseNumber(formData.montageShadeFactor, "Verschattungsfaktor");
        if (montageShadeFactor === null) return;

        // ✅ Use Set.has() instead of Array.includes()
        if (!DIRECTION_VALUES.has(formData.montageDirection as Direction)) {
            setMessage("❌ Ungültige Montagerichtung!");
            return;
        }

        const userConditions: UserConditionsDTO = {
            montagePlace: formData.montagePlace,
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
            setMessage("❌ Fehler beim Speichern oder Berechnen.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
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
