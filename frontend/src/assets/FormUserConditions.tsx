import type { ChangeEvent, FormEvent } from "react";
import type { UserConditions } from "../model/UserConditions";

interface FormUserConditionsProps {
    formData: UserConditions;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function FormUserConditions({ formData, onChange, onSubmit }: FormUserConditionsProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block mb-1">Montage vorhanden</label>
                <input
                    type="checkbox"
                    name="montagePlace"
                    checked={formData.montagePlace}
                    onChange={onChange}
                    className="mr-2"
                />
            </div>

            <div>
                <label className="block mb-1">Montagewinkel (°)</label>
                <input
                    type="number"
                    name="montageAngle"
                    value={formData.montageAngle}
                    onChange={onChange}
                    className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block mb-1">Ausrichtung</label>
                <select
                    name="montageDirection"
                    value={formData.montageDirection}
                    onChange={onChange}
                    className="w-full border rounded p-2"
                >
                    <option value="">Bitte wählen</option>
                    <option value="NORTH">Norden</option>
                    <option value="NORTHEAST">Nordosten</option>
                    <option value="EAST">Osten</option>
                    <option value="SOUTHEAST">Südosten</option>
                    <option value="SOUTH">Süden</option>
                    <option value="SOUTHWEST">Südwesten</option>
                    <option value="WEST">Westen</option>
                    <option value="NORTHWEST">Nordwesten</option>
                </select>

            </div>

            <div>
                <label className="block mb-1">Sonnenstunden pro Tag</label>
                <input
                    type="number"
                    name="montageSunhours"
                    value={formData.montageSunhours}
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
