import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import FormUserinfo from "../assets/FormUserinfo";

// 🔹 Typ für das Formular
interface UserFormData {
    userRateOfELetricity: string;
    userHouseholdNumber: string;
    userElectricityConsumption: string;
    userNotes?: string; // optional, falls du ein Textarea-Feld hinzufügen willst
}

export default function UserFormPage() {
    // 🔹 State für Formulardaten & Nachricht
    const [formData, setFormData] = useState<UserFormData>({
        userRateOfELetricity: "",
        userHouseholdNumber: "",
        userElectricityConsumption: "",
        userNotes: "",
    });

    const [message, setMessage] = useState("");

    // 🔹 Generischer Change-Handler für Input, Select & Textarea
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Submit-Handler mit Typisierung
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await axios.post("/api/userinfo", {
                ...formData,
                userHouseholdNumber: parseInt(formData.userHouseholdNumber),
                userElectricityConsumption: parseInt(formData.userElectricityConsumption),
            });
            setMessage("✅ Daten erfolgreich gespeichert!");
        } catch (error) {
            console.error(error);
            setMessage("❌ Fehler beim Speichern der Daten.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Deine Angaben</h2>

            {/* Übergabe der Props an das Formular */}
            <FormUserinfo
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />

            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}
