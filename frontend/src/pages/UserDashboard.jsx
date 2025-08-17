import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSort from "../components/FilterSort.jsx";
import RatingButtons from "../components/RatingButtons.jsx";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ search: "" });

  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("ASC");


  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores", { params: { ...filters, sort, order } });
      setStores(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to fetch stores");
    }
  };

  useEffect(() => { fetchStores(); }, [filters, sort, order]);

  const updatePassword = async () => {
    if (!passwords.old || !passwords.new) return toast.error("Both fields are required");
    try {
      setLoading(true);
      await api.put("/auth/update-password", { oldPassword: passwords.old, newPassword: passwords.new });
      toast.success("Password updated successfully");
      setPasswords({ old: "", new: "" });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
        </div>

        {/* Password Update */}
        <div className="flex gap-2 bg-gray-800 p-4 rounded-lg shadow">
          {["old", "new"].map((key, i) => (
            <input
              key={key}
              type="password"
              value={passwords[key]}
              onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
              placeholder={i === 0 ? "Old Password" : "New Password"}
              className="flex-1 p-2 rounded bg-gray-900 border border-gray-700"
            />
          ))}
          <button
            onClick={updatePassword}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

        {/* Stores */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <FilterSort {...{ filters, setFilters, sort, setSort, order, setOrder, onApply: fetchStores }} />
          <div className="overflow-x-auto mt-4">
            <table className="w-full border border-gray-700 rounded">
              <thead className="bg-gray-700">
                <tr>
                  {["Store Name", "Address", "Rating", "Rate"].map(h => <th key={h} className="p-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {stores.length ? stores.map(s => (
                  <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.address}</td>
                    <td className="p-2">{s.rating || "N/A"}</td>
                    <td className="p-2"><RatingButtons storeId={s.id} onRated={fetchStores} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center p-4 text-gray-400">No stores found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
