import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeAsset from "../assets/HomeAsset";
import type { UserResponseDTO } from "../dto/UserResponseDTO";

export default function Home() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleCreateUser = () => {
        axios
            .post<UserResponseDTO>("/api/home")
            .then((response) => {
                const createdUser = response.data;
                console.log("User erstellt:", createdUser);
                setMessage("✅ Benutzer erfolgreich angelegt!");

                navigate("/userinfo", { state: { userId: createdUser.userId } });
            })
            .catch((error) => {
                console.error("Fehler beim Erstellen des Benutzers:", error);
                setMessage("❌ Fehler beim Anlegen des Benutzers.");
            });
    };

    return <HomeAsset message={message} onCreateUser={handleCreateUser} />;
}
