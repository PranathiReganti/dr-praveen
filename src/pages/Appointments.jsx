import { useState } from "react";
import { CLINICS } from '../data/content'

export default function Appointments() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    clinic: "",
  });

  const submit = (e) => {
    e.preventDefault();
    alert("Token generated (connect Firebase later)");
  };

  return (
    <div className="p-10 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Book Appointment
      </h1>

      <form onSubmit={submit} className="space-y-4">

        <input
          placeholder="Name"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <select
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, clinic: e.target.value })
          }
        >
          <option>Select Clinic</option>
          {clinics.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="bg-teal-600 text-white px-6 py-2 rounded">
          Generate Token
        </button>

      </form>

    </div>
  );
}