import type {ChangeEvent, FormEvent} from "react";

interface FormUserinfoProps {
    formData: {
        userRateOfElectricity: string;
        userHouseholdNumber: string;
        userElectricityConsumption: string;
    };
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function FormUserinfo({ formData, onChange, onSubmit }: FormUserinfoProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block mb-1">Strompreis (ct/kWh)</label>
                <input
                    type="text"
                    name="userRateOfElectricity"
                    value={formData.userRateOfElectricity}
                    onChange={onChange}
                    className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block mb-1">Anzahl im Haushalt</label>
                <input
                    type="number"
                    name="userHouseholdNumber"
                    value={formData.userHouseholdNumber}
                    onChange={onChange}
                    className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block mb-1">Stromverbrauch (kWh/Jahr)</label>
                <input
                    type="number"
                    name="userElectricityConsumption"
                    value={formData.userElectricityConsumption}
                    onChange={onChange}
                    className="w-full border rounded p-2"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Speichern
            </button>
        </form>
    );
}
