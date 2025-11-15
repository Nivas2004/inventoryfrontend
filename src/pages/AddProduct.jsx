import React, { useState, useEffect } from "react";
import { addProduct } from "../api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useSidebar } from "../context/SidebarContext";

function AddProduct() {
  const [currentUser, setCurrentUser] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    supplier: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
  });

  const { open } = useSidebar(); // <-- Sidebar state

  // Auth check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/login";
      else setCurrentUser(user);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addProduct(product);
    alert("Product added successfully!");
    window.location.href = "/";
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* MAIN CONTENT SHIFTING BASED ON SIDEBAR */}
      <div
        className={`min-h-screen w-full bg-gray-100 transition-all duration-300 ${
          open ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar user={currentUser} />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">➕ Add Product</h1>

          <form
            className="bg-white p-6 rounded shadow space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              className="border p-3 w-full rounded"
              placeholder="Product Name"
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />

            <input
              className="border p-3 w-full rounded"
              placeholder="Category"
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />

            <input
              className="border p-3 w-full rounded"
              placeholder="Supplier"
              onChange={(e) =>
                setProduct({ ...product, supplier: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-3 w-full rounded"
              placeholder="Purchase Price"
              onChange={(e) =>
                setProduct({ ...product, purchasePrice: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-3 w-full rounded"
              placeholder="Selling Price"
              onChange={(e) =>
                setProduct({ ...product, sellingPrice: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-3 w-full rounded"
              placeholder="Stock"
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
