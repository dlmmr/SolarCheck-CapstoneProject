import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleCreateUser = () => {
        axios
            .post("/api/home")
            .then((response) => {
                console.log("User erstellt:", response.data);
                setMessage("✅ Benutzer erfolgreich angelegt!");

                // Nach kurzer Zeit (oder direkt) weiterleiten:
                navigate("/userinfo");
            })
            .catch((error) => {
                console.error("Fehler beim Erstellen des Benutzers:", error);
                setMessage("❌ Fehler beim Anlegen des Benutzers.");
            });
    };

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Willkommen zur Balkonkraftwerk-App</h1>
            <p className="mb-6">
                Hier kannst du berechnen, ob sich ein Balkonkraftwerk für dich lohnt.
            </p>

            <button
                onClick={handleCreateUser}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Los geht’s
            </button>

            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
