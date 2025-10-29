import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO";
import type { Direction } from "../dto/Direction";
import UserConditionsAsset, { type UserConditionsFormData } from "../assets/UserConditionsAsset";

const DIRECTION_VALUES: Direction[] = ["NORTH","NORTHEAST","EAST","SOUTHEAST","SOUTH","SOUTHWEST","WEST","NORTHWEST"];

export default function UserConditionsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const locationState = location.state as { user?: UserResponseDTO; formData?: UserConditionsDTO } | null;
    const user = locationState?.user ?? null;

    const [formData, setFormData] = useState<UserConditionsFormData>({
        montagePlace: locationState?.formData?.montagePlace ?? user?.userConditions?.montagePlace ?? false,
        montageAngle: locationState?.formData?.montageAngle ?? user?.userConditions?.montageAngle ?? "",
        montageDirection: (locationState?.formData?.montageDirection ?? user?.userConditions?.montageDirection ?? "") as "" | Direction,
        montageShadeFactor: locationState?.formData?.montageShadeFactor ?? user?.userConditions?.montageShadeFactor ?? "",
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { if (!user) navigate("/"); }, [user, navigate]);
    if (!user) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = "checked" in e.target ? e.target.checked : undefined;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const validateAndParseNumber = (value: string | number, label: string): number | null => {
        const num = typeof value === "number" ? value : parseFloat(value);
        if (!Number.isFinite(num)) { setMessage(`❌ ${label} ist ungültig.`); return null; }
        return num;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const montageAngle = validateAndParseNumber(formData.montageAngle, "Montagewinkel");
        if (montageAngle === null) return;

        const montageShadeFactor = validateAndParseNumber(formData.montageShadeFactor, "Verschattungsfaktor");
        if (montageShadeFactor === null) return;

        if (!DIRECTION_VALUES.includes(formData.montageDirection as Direction)) {
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
