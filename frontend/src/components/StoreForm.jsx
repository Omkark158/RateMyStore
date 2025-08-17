import { useState } from "react";
import toast from "react-hot-toast";

export default function StoreForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", address: "", ownerEmail: "" });

  const handleSubmit = async () => {
    try {
      await onSuccess(form);
      setForm({ name: "", address: "", ownerEmail: "" });
   
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Error adding store");
    }
  };

  return (
    <div className="mb-6 bg-gray-900 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3">Add Store</h3>
      {["name", "address", "ownerEmail"].map((field) => (
        <input
          key={field}
          type={field === "ownerEmail" ? "email" : "text"}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="w-full p-2 mb-2 rounded bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
        />
      ))}
      <button
        className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
}
