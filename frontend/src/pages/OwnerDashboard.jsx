import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function OwnerDashboard() {
  const [dashboard, setDashboard] = useState({ avgRating: 0, store: null, ratings: [] });
  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const [loading, setLoading] = useState(false);
  const [storeForm, setStoreForm] = useState({ name: "", address: "" });
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/owner/dashboard");
      setDashboard(data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error loading dashboard");
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handlePasswordUpdate = async () => {
    if (!passwords.old || !passwords.new) return toast.error("Both fields required");
    setLoading(true);
    try {
      await api.put("/auth/update-password", {
        oldPassword: passwords.old,
        newPassword: passwords.new,
      });
      toast.success("Password updated");
      setPasswords({ old: "", new: "" });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const handleStoreAction = async (action, id) => {
    if (action !== "delete" && (!storeForm.name || !storeForm.address)) {
      return toast.error("Fill all fields");
    }
    try {
      if (action === "add") {
        await api.post("/owner", storeForm);
      } else if (action === "update") {
        await api.put(`/owner/${id}`, storeForm);
        toast.success("Store updated");
      } else if (action === "delete") {
        await api.delete(`/owner/${id}`);
        toast.success("Store deleted");
      }

      setStoreForm({ name: "", address: "" });
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.msg || `Error ${action} store`);
    }
  };

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Store Owner Dashboard</h1>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
            Logout
          </button>
        </div>

        {/* Password Update */}
        <div className="bg-gray-800 p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Update Password</h2>
          <div className="flex gap-2">
            {["old", "new"].map((k, i) => (
              <input
                key={k}
                type="password"
                value={passwords[k]}
                onChange={(e) => setPasswords({ ...passwords, [k]: e.target.value })}
                placeholder={i === 0 ? "Old Password" : "New Password"}
                className="flex-1 p-2 rounded bg-gray-900 border border-gray-700"
              />
            ))}
            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-gray-800 p-4 rounded shadow space-y-2">
          <h2 className="text-lg font-semibold">My Store</h2>
          {dashboard.store ? (
            <>
              <p><strong>Name:</strong> {dashboard.store.name}</p>
              <p><strong>Address:</strong> {dashboard.store.address}</p>
              <p>
                <strong>Average Rating:</strong>{" "}
                <span className="text-yellow-400 font-bold">
                  {dashboard.avgRating ? `${dashboard.avgRating} / 5` : "N/A"}
                </span>
              </p>
              <button
                onClick={() => handleStoreAction("delete", dashboard.store.id)}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded mt-2"
              >
                Delete Store
              </button>
            </>
          ) : (
            <p>No store linked yet</p>
          )}
        </div>

        {/* Add / Update Store Form */}
        <div className="bg-gray-800 p-4 rounded shadow space-y-2">
          <h2 className="text-lg font-semibold">
            {dashboard.store ? "Update Store" : "Add Store"}
          </h2>
          {["name", "address"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={`Store ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              value={storeForm[field]}
              onChange={(e) => setStoreForm({ ...storeForm, [field]: e.target.value })}
              className="w-full p-2 mb-2 rounded bg-gray-900 border border-gray-700"
            />
          ))}
          <button
            onClick={() =>
              dashboard.store
                ? handleStoreAction("update", dashboard.store.id)
                : handleStoreAction("add")
            }
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            {dashboard.store ? "Update Store" : "Add Store"}
          </button>
        </div>

        {/* Ratings List */}
        {dashboard.ratings && dashboard.ratings.length > 0 && (
          <div className="bg-gray-800 p-4 rounded shadow space-y-2">
            <h2 className="text-lg font-semibold">Customer Ratings</h2>
            <ul className="space-y-2">
            <ul className="space-y-2">
               <ul className="space-y-2">
                {dashboard.ratings.map((r, i) => (
                  <li key={`${r.user?.id || i}-${r.createdAt}`} className="border-b border-gray-700 pb-2">
                    <p><strong>User:</strong> {r.user?.name} ({r.user?.email})</p>
                    <p><strong>Rating:</strong> <span className="text-yellow-400">{r.rating} / 5</span></p>
                    <p className="text-sm text-gray-400">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>

              </ul>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
