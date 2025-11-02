import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Sweet {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

const API_URL = "http://localhost:5000";

function SweetPage() {
  const navigate = useNavigate();

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "ADMIN";
  const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const fetchSweets = async () => {
    try {
      const res = await axios.get(`${API_URL}/sweets`);
      setSweets(res.data);
      setFilteredSweets(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch sweets");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    let list = [...sweets];
    if (search.trim()) {
      list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterCategory !== "All") {
      list = list.filter(s => s.category.toLowerCase() === filterCategory.toLowerCase());
    }
    setFilteredSweets(list);
  }, [search, filterCategory, sweets]);

  const addSweet = async () => {
    if (!isAdmin) return toast.error("Admin only.");
    if (!name || !price || !category) return toast.error("All fields required.");
    try {
      await axios.post(`${API_URL}/sweets`, { name, category, price: price.toString() }, auth);
      toast.success("Added!");
      setName(""); setPrice(""); setCategory("");
      fetchSweets();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Error adding sweet");
    }
  };

  const deleteSweet = async (id: number) => {
    if (!isAdmin) return toast.error("Admin only.");
    try {
      await axios.delete(`${API_URL}/sweets/${id}`, auth);
      toast.success("Deleted!");
      fetchSweets();
    } catch (e) {
      console.error(e);
      toast.error("Error deleting");
    }
  };

  const purchaseSweet = async (id: number) => {
    if (!token) return navigate("/"); // force login
    try {
      await axios.post(`${API_URL}/sweets/${id}/purchase`, {}, auth);
      toast.success("Purchased!");
      fetchSweets();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Error purchasing");
    }
  };

  const restockSweet = async (id: number) => {
    if (!isAdmin) return toast.error("Admin only.");
    try {
      await axios.post(`${API_URL}/sweets/${id}/restock`, {}, auth);
      toast.success("Restocked!");
      fetchSweets();
    } catch (e) {
      console.error(e);
      toast.error("Error restocking");
    }
  };

  const categories = Array.from(new Set(sweets.map(s => s.category)));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B2F2F] via-[#2E1A12] to-[#C77D24] text-white flex flex-col items-center py-10">
      <Toaster position="top-right" />

      <div className="w-[90%] md:w-[70%] lg:w-[60%] flex justify-between items-center mb-10">
        <div className="text-3xl font-extrabold flex items-center gap-3">
          🍬 Sweet Shop Management ({isAdmin ? "Admin" : "User"})
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {isAdmin && (
        <div className="flex flex-wrap gap-3 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-[90%] md:w-[70%] lg:w-[60%] border border-white/20 mb-8">
          <input
            type="text"
            placeholder="Sweet Name"
            className="p-3 rounded-xl flex-1 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C77D24]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            className="p-3 rounded-xl w-28 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C77D24]"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            className="p-3 rounded-xl flex-1 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C77D24]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            onClick={addSweet}
            className="bg-[#C77D24] hover:bg-[#E67E22] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:scale-105"
          >
            Add Sweet
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 w-[90%] md:w-[70%] lg:w-[60%] bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
        <input
          type="text"
          placeholder="🔍 Search sweets..."
          className="p-3 rounded-xl flex-1 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C77D24]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 rounded-xl bg-[#3B2F2F]/90 text-white focus:outline-none focus:ring-2 focus:ring-[#C77D24] cursor-pointer"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10 w-[90%] md:w-[70%] lg:w-[60%] bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">Available Sweets</h2>
        {filteredSweets.length === 0 ? (
          <p className="text-gray-200 italic">No sweets found.</p>
        ) : (
          <div className="grid gap-4">
            {filteredSweets.map((sweet) => (
              <div
                key={sweet.id}
                className="flex justify-between items-center bg-white/10 p-4 rounded-xl shadow-sm hover:shadow-lg hover:bg-white/20 transition-all duration-300"
              >
                <div>
                  <p className="font-bold text-lg capitalize">{sweet.name}</p>
                  <p className="text-gray-300">
                    ₹{sweet.price} — {sweet.category} | Qty:{" "}
                    <span className={sweet.quantity > 0 ? "text-green-300" : "text-red-400"}>
                      {sweet.quantity}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={sweet.quantity <= 0 || isAdmin}
                    onClick={() => purchaseSweet(sweet.id)}
                    className={`${
                      sweet.quantity <= 0 ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                    } px-4 py-2 rounded-lg font-semibold transition-all duration-300`}
                  >
                    Purchase
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => restockSweet(sweet.id)}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => deleteSweet(sweet.id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SweetPage;
