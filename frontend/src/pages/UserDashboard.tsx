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

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = [
    "All",
    "Traditional Sweet",
    "Fusion Sweets",
    "Dry Sweets",
    "Milk Sweet",
    "Chocolate Sweets",
    "Festival Special",
    "Coloured Sweet",
  ];

  // Fetch sweets
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

  // Handle purchase
  const handlePurchase = async (sweet: Sweet) => {
    if (sweet.quantity <= 0) {
      toast.error("Out of stock!");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/${sweet.id}/purchase`,
        { amount: 1 },
        { headers }
      );
      toast.success(`Successfully purchased ${sweet.name} (Qty: 1)!`);
      fetchSweets();
    } catch {
      toast.error("Error purchasing sweet!");
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Filter sweets
  const filteredSweets = sweets.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B2F2F] via-[#2E1A12] to-[#C77D24] text-white px-6 py-6">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#2E1A12",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 18px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#C77D24",
              secondary: "#fff",
            },
          },
        }}
      />

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

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white/10 p-6 rounded-2xl border border-white/20 items-center">
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
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-[#2E1A12] text-white">
              {cat}
            </option>
          ))}
        </select>
        <button
          onClick={() => fetchSweets()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl"
        >
          Search
        </button>
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
                <div>
                  <div className="font-bold text-lg">{sweet.name}</div>
                  <div className="text-sm opacity-80">
                    ₹{sweet.price} — {sweet.category}
                  </div>
                  <div className="text-sm text-yellow-300 font-semibold">
                    Qty: {sweet.quantity}
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(sweet)}
                  disabled={sweet.quantity <= 0}
                  className={`${
                    sweet.quantity > 0
                      ? "bg-[#C77D24] hover:bg-[#E67E22]"
                      : "bg-gray-500 cursor-not-allowed"
                  } text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300`}
                >
                  {sweet.quantity > 0 ? "Purchase" : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
