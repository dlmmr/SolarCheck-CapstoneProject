import { useLocation, useNavigate } from "react-router-dom";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import ResultAsset from "../assets/ResultAsset";

export default function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // User-Daten aus location.state extrahieren, Fallback auf undefined
    const { user } = (location.state as { user: UserResponseDTO } | null) || {};

    const goBack = () => {
        if (user) {
            navigate("/userConditions", { state: { user } });
        } else {
            navigate("/"); // Fallback
        }
    };

    return (
        <div className="page">
            <ResultAsset user={user} goBack={goBack} />
        </div>
    );
}
