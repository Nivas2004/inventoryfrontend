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

  const { open } = useSidebar();

  // Auth check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/login";
      else setCurrentUser(user);
    });
  }, []);

  // Load products
  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.log("Error loading products:", err);
    }
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

  // ---------------------------
  // CSV EXPORT FUNCTION
  // ---------------------------
  const exportToCSV = () => {
    if (products.length === 0) return alert("No products to export!");

    const csvData = products.map((p, index) => ({
      SNo: index + 1,
      Name: p.name,
      Category: p.category,
      Supplier: p.supplier,
      PurchasePrice: p.purchasePrice,
      SellingPrice: p.sellingPrice,
      ProfitPercent: (
        ((p.sellingPrice - p.purchasePrice) / p.purchasePrice) *
        100
      ).toFixed(2),
      Stock: p.stock,
    }));

    const csvRows = [];
    const headers = Object.keys(csvData[0]);
    csvRows.push(headers.join(","));

    csvData.forEach((row) => {
      const values = headers.map((h) => row[h]);
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Inventory_Report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div
        className={`min-h-screen w-full bg-gray-100 transition-all duration-300 ${
          open ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar user={currentUser} />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            📦 Inventory Dashboard
          </h1>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded mb-4 w-1/3 shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Buttons */}
          <div className="mb-4 flex gap-4">
            <a
              href="/add"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              ➕ Add Product
            </a>

            <button
              onClick={exportToCSV}
              className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
            >
              📄 Export CSV
            </button>
          </div>

          {/* PRODUCT TABLE */}
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200 border-b text-center text-sm font-semibold">
                  <th className="p-3">S.No</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Purchase Price</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3">Profit %</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, index) => {
                    const profit = p.purchasePrice
                      ? (
                          ((p.sellingPrice - p.purchasePrice) /
                            p.purchasePrice) *
                          100
                        ).toFixed(2)
                      : "0";

                    return (
                      <tr
                        key={p.id}
                        className="border-b hover:bg-gray-50 text-center"
                      >
                        <td className="p-3 font-semibold">{index + 1}</td>
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{p.category}</td>
                        <td className="p-3 font-medium">₹ {p.purchasePrice}</td>
                        <td className="p-3 font-medium">₹ {p.sellingPrice}</td>
                        <td
                          className={`p-3 font-semibold ${
                            profit >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {profit}%
                        </td>
                        <td className="p-3">{p.supplier}</td>
                        <td className="p-3">{p.stock}</td>

                        <td className="p-3 flex items-center justify-center gap-2">
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
                    );
                  })
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
