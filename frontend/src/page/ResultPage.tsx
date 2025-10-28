import { useLocation, useNavigate } from "react-router-dom";
import type { UserResponseDTO } from "../dto/UserResponseDTO";
import ResultAsset from "../assets/ResultAsset";

export default function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = (location.state as { user: UserResponseDTO } | null) || { user: undefined };

    const goBack = () => {
        if (location.state?.user) {
            navigate("/userConditions", { state: { user } });
        } else {
            navigate("/"); // Fallback
        }
    };

    return <ResultAsset user={user} goBack={goBack} />;
}
