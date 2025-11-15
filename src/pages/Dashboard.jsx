import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");

  const { open } = useSidebar(); // Sidebar open/close state

  // Auth check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/login";
      else setCurrentUser(user);
    });
  }, []);

  // Load products
  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  // Search filter
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />

      {/* MAIN PAGE SHIFTS WHEN SIDEBAR COLLAPSES */}
      <div
        className={`min-h-screen w-full bg-gray-100 transition-all duration-300 ${
          open ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar user={currentUser} />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">📦 Inventory Dashboard</h1>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded mb-4 w-1/3 shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Add Product */}
          <div className="mb-4">
            <a
              href="/add"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              ➕ Add New Product
            </a>
          </div>

          {/* PRODUCT TABLE */}
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full table-fixed border">
              <thead>
                <tr className="bg-gray-200 border-b">
                  <th className="p-3 w-1/5 text-left">Name</th>
                  <th className="p-3 w-1/5 text-left">Category</th>
                  <th className="p-3 w-1/5 text-left">Supplier</th>
                  <th className="p-3 w-1/5 text-left">Stock</th>
                  <th className="p-3 w-1/5 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3">{p.supplier}</td>
                      <td className="p-3">{p.stock}</td>

                      <td className="p-3 flex gap-2">
                        <a
                          href={`/edit/${p.id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </a>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
