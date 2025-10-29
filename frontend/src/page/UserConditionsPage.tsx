import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO";
import type { Direction } from "../dto/Direction";
import UserConditionsAsset, { type UserConditionsFormData } from "../assets/UserConditionsAsset";
import type {UserPvConfig} from "../dto/UserPvConfig.ts";

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
        userPvConfig: locationState?.formData?.userPvConfig ?? user?.userConditions?.userPvConfig ?? "",
        montageAngle: locationState?.formData?.montageAngle ?? user?.userConditions?.montageAngle ?? 0,
        montageDirection: locationState?.formData?.montageDirection ?? user?.userConditions?.montageDirection ?? "",
        montageShadeFactor: locationState?.formData?.montageShadeFactor ?? user?.userConditions?.montageShadeFactor ?? 0,
    });


    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { if (!user) navigate("/"); }, [user, navigate]);
    if (!user) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = "checked" in e.target ? e.target.checked : undefined;

        let newValue: string | number | boolean | undefined;
        if (type === "checkbox") {
            newValue = checked;
        } else if (type === "number") {
            newValue = value === "" ? 0 : Number(value);
        } else {
            newValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate PV config
        if (!formData.userPvConfig) {
            setMessage("❌ Bitte PV-Modul auswählen.");
            return;
        }

        // Validate direction
        if (!DIRECTION_VALUES.has(formData.montageDirection as Direction)) {
            setMessage("❌ Ungültige Montagerichtung!");
            return;
        }

        const userConditions: UserConditionsDTO = {
            userPvConfig: formData.userPvConfig as UserPvConfig,
            montageAngle: formData.montageAngle,
            montageDirection: formData.montageDirection as Direction,
            montageShadeFactor: formData.montageShadeFactor
        };

        setIsLoading(true);
        try {
            await axios.put(`/api/home/${user.userId}/conditions`, userConditions);
            const resultResponse = await axios.post(`/api/home/${user.userId}/result`);
            navigate("/result", { state: { user: resultResponse.data } });
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                setMessage(`❌ ${error.response.data.message || 'Fehler beim Speichern'}`);
            } else {
                setMessage("❌ Netzwerkfehler. Bitte erneut versuchen.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (isLoading) return;  // ✅ Prevent navigation during submit
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