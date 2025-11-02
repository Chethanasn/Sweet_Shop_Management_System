import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/sweets";

type Sweet = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Traditional Sweet");
  const [customCategory, setCustomCategory] = useState(""); // ✅ New state
  const [quantity, setQuantity] = useState("");
  const [editSweet, setEditSweet] = useState<Sweet | null>(null);
  const [restockAmounts, setRestockAmounts] = useState<Record<number, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = [
    "Traditional Sweet",
    "Fusion Sweets",
    "Dry Sweets",
    "Milk Sweet",
    "Chocolate Sweets",
    "Festival Special",
    "Coloured Sweet",
    "Custom", // ✅ New custom option
  ];

  // ============ Fetch Sweets ============
  const fetchSweets = async () => {
    try {
      const res = await axios.get(API_URL, { headers });
      setSweets(res.data);
    } catch {
      toast.error("Error fetching sweets!");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // ============ Add Sweet ============
  const handleAddSweet = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory =
      category === "Custom" && customCategory.trim() !== ""
        ? customCategory.trim()
        : category;

    if (!name || !price || !finalCategory) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      await axios.post(
        API_URL,
        {
          name,
          category: finalCategory,
          price: parseFloat(price),
          quantity: parseInt(quantity) || 0,
        },
        { headers }
      );
      toast.success("Sweet added!");
      setName("");
      setPrice("");
      setQuantity("");
      setCategory("Traditional Sweet");
      setCustomCategory("");
      fetchSweets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error adding sweet!");
    }
  };

  // ============ Delete Sweet ============
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this sweet?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers });
      toast.success("Sweet deleted!");
      fetchSweets();
    } catch {
      toast.error("Error deleting sweet!");
    }
  };

  // ============ Update Sweet ============
  const handleUpdateSweet = async () => {
    if (!editSweet) return;
    try {
      await axios.put(`${API_URL}/${editSweet.id}`, editSweet, { headers });
      toast.success("Sweet updated!");
      setEditSweet(null);
      fetchSweets();
    } catch {
      toast.error("Error updating sweet!");
    }
  };

  // ============ Restock Sweet ============
  const handleRestock = async (id: number) => {
    const amount = restockAmounts[id];
    if (!amount || parseInt(amount) <= 0) {
      toast.error("Enter a valid restock amount!");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/${id}/restock`,
        { amount: parseInt(amount) },
        { headers }
      );
      toast.success("Sweet restocked!");
      setRestockAmounts((prev) => ({ ...prev, [id]: "" }));
      fetchSweets();
    } catch {
      toast.error("Error restocking sweet!");
    }
  };

  // ============ Logout ============
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ============ Filtered Sweets ============
  const filteredSweets = sweets.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // ============ UI ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B2F2F] via-[#2E1A12] to-[#C77D24] text-white px-6 py-6">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div></div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Add Sweet Form */}
      <form
        onSubmit={handleAddSweet}
        className="flex flex-wrap gap-4 mb-6 bg-white/10 p-6 rounded-2xl border border-white/20"
      >
        <input
          type="text"
          placeholder="Sweet Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[200px] p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#C77D24]"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-[100px] p-3 rounded-xl bg-white/20 text-white"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-[200px] p-3 rounded-xl bg-white/20 text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-[#2E1A12] text-white">
              {cat}
            </option>
          ))}
        </select>

        {/* ✅ Custom Category Field appears only if "Custom" selected */}
        {category === "Custom" && (
          <input
            type="text"
            placeholder="Enter Custom Category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="flex-1 min-w-[200px] p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#C77D24]"
          />
        )}

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-[100px] p-3 rounded-xl bg-white/20 text-white"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold"
        >
          Add Sweet
        </button>
      </form>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white/10 p-4 rounded-2xl border border-white/20">
        <input
          type="text"
          placeholder="Search sweets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[250px] p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#C77D24]"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="min-w-[200px] p-3 rounded-xl bg-white/20 text-white"
        >
          <option value="All" className="bg-[#2E1A12] text-white">
            All
          </option>
          {categories
            .filter((cat) => cat !== "Custom") // Don't show "Custom" in search
            .map((cat) => (
              <option key={cat} value={cat} className="bg-[#2E1A12] text-white">
                {cat}
              </option>
            ))}
        </select>
      </div>

      {/* Sweet List */}
      <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
        <h2 className="text-2xl font-bold mb-4">Available Sweets</h2>
        {filteredSweets.length === 0 ? (
          <p className="text-gray-300">No sweets found.</p>
        ) : (
          <div className="space-y-4">
            {filteredSweets.map((sweet) => (
              <div
                key={sweet.id}
                className="flex flex-wrap justify-between items-center bg-white/10 p-4 rounded-xl"
              >
                {editSweet?.id === sweet.id ? (
                  <div className="flex flex-wrap gap-3 items-center">
                    <input
                      type="text"
                      value={editSweet.name}
                      onChange={(e) =>
                        setEditSweet({ ...editSweet, name: e.target.value })
                      }
                      className="p-2 rounded bg-white/20 text-white"
                    />
                    <input
                      type="number"
                      value={editSweet.price}
                      onChange={(e) =>
                        setEditSweet({
                          ...editSweet,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="p-2 rounded bg-white/20 text-white w-20"
                    />
                    <select
                      value={editSweet.category}
                      onChange={(e) =>
                        setEditSweet({ ...editSweet, category: e.target.value })
                      }
                      className="p-2 rounded bg-white/20 text-white"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editSweet.quantity}
                      onChange={(e) =>
                        setEditSweet({
                          ...editSweet,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className="p-2 rounded bg-white/20 text-white w-20"
                    />
                    <button
                      onClick={handleUpdateSweet}
                      className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditSweet(null)}
                      className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="font-bold text-lg">{sweet.name}</div>
                      <div className="text-sm opacity-80">
                        ₹{sweet.price} — {sweet.category} — Qty: {sweet.quantity}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => setEditSweet(sweet)}
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-lg"
                      >
                        Edit
                      </button>
                      <input
                        type="number"
                        placeholder="Restock"
                        value={restockAmounts[sweet.id] || ""}
                        onChange={(e) =>
                          setRestockAmounts({
                            ...restockAmounts,
                            [sweet.id]: e.target.value,
                          })
                        }
                        className="w-24 p-2 rounded bg-white/20 text-white placeholder-gray-300"
                      />
                      <button
                        onClick={() => handleRestock(sweet.id)}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleDelete(sweet.id)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
