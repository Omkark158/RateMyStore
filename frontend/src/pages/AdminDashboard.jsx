import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import UserForm from "../components/UserForm";
import StoreForm from "../components/StoreForm";
import FilterSort from "../components/FilterSort";



function useCrud(endpoint, initialFilters, sort = "name", refreshStats) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [order, setOrder] = useState("ASC");
  const singular = endpoint.slice(0, -1);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/${endpoint}`, { params: { ...filters, sort, order } });
      setItems(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.msg || `Failed to fetch ${endpoint}`);
    }
  };

  const createItem = async (data) => {
    try {
      const res = await api.post(`/${endpoint}`, data);
      setItems((prev) => [...prev, res.data]);  
      toast.success(`${singular} added`);
      await refreshStats?.();
    } catch (err) {
      toast.error(err?.response?.data?.msg || `Failed to add ${singular}`);
    }
  };

  const updateItem = async (item, field = "name") => {
    const newValue = prompt(`New ${field}:`, item[field]);
    if (!newValue) return;
    try {
      const res = await api.put(`/${endpoint}/${item.id}`, {
        ...item,
        [field]: newValue,
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? res.data : i))
      );
      toast.success(`${singular} updated`);
      await refreshStats?.();
    } catch (err) {
      toast.error(err?.response?.data?.msg || `Failed to update ${singular}`);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Confirm delete?")) return;
    try {
      await api.delete(`/${endpoint}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(`${singular} deleted`);
      await refreshStats?.();
    } catch (err) {
      toast.error(err?.response?.data?.msg || `Failed to delete ${singular}`);
    }
  };

  return { items, filters, setFilters, fetchItems, createItem, updateItem, deleteItem, order, setOrder };
}

function DataTable({ items, columns, onEdit, onDelete, empty }) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-700">
            {columns.map((c) => (
              <th key={c.key} className="p-2">{c.label}</th>
            ))}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map((it) => (
              <tr key={it.id} className="bg-gray-800 hover:bg-gray-700">
                {columns.map((c) => (
                  <td key={c.key} className="p-2">{it[c.key]}</td>
                ))}
                <td className="p-2 flex gap-2">
                  <button onClick={() => onEdit(it)} className="bg-yellow-500 px-2 py-1 rounded">Edit</button>
                  <button onClick={() => onDelete(it.id)} className="bg-red-500 px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={columns.length + 1} className="p-2 text-center">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });

  const [userSort, setUserSort] = useState("name");
  const [storeSort, setStoreSort] = useState("name");

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch {}
  };

 const users = useCrud("users", { search: "" }, "name", fetchStats);
const stores = useCrud("stores", { search: "" }, "name", fetchStats);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "admin") {
      toast.error("Access denied");
      localStorage.clear();
      return navigate("/login");
    }
    fetchStats();
    users.fetchItems();
    stores.fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              toast.success("Logged out");
              navigate("/login");
            }}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-800 p-3 rounded shadow text-center">
          <h2 className="text-base font-bold mb-2">Stats</h2>
          <div className="flex justify-around">
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-xs font-semibold capitalize">{k}</span>
                <span className="text-lg font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-base font-semibold mb-2">Add New User</h2>
            <UserForm onSuccess={users.createItem} />
              <FilterSort
                filters={users.filters}
                setFilters={users.setFilters}
                sort={userSort}
                setSort={setUserSort}
                order={users.order}
                setOrder={users.setOrder}
                onApply={() => users.fetchItems(userSort, users.order)}
                includeRole
                includeEmail
              />
            <h3 className="text-base font-semibold mt-3">User List</h3>
            <DataTable
              items={users.items.map(u => ({ ...u, rating: (u.rating != null ? u.rating : "-")  }))}
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "address", label: "Address" },
                { key: "role", label: "Role" },
                { key: "rating", label: "Rating" },
              ]}
              onEdit={users.updateItem}
              onDelete={users.deleteItem}
              empty="No users found"
            />
          </div>

          <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-base font-semibold mb-2">Add New Store</h2>
            <StoreForm onSuccess={stores.createItem} />
            <FilterSort
              filters={users.filters}
              setFilters={users.setFilters}
              sort={userSort}
              setSort={setUserSort}
              order={users.order}
              setOrder={users.setOrder}
              onApply={() => users.fetchItems(userSort, users.order)}
              includeRole
              includeEmail
            />

            <h3 className="text-base font-semibold mt-3">Store List</h3>
            <DataTable
              items={stores.items}
              columns={[
                { key: "name", label: "Name" },
                { key: "address", label: "Address" },
              ]}
              onEdit={stores.updateItem}
              onDelete={stores.deleteItem}
              empty="No stores found"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
