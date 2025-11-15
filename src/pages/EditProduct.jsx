import React, { useState, useEffect } from "react";
import { getProductById, updateProduct } from "../api";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useSidebar } from "../context/SidebarContext";

function EditProduct() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    supplier: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
  });

  const { open } = useSidebar(); // <-- ADDED

  // 🔐 Login check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/login";
      else setCurrentUser(user);
    });
  }, []);

  // Load product details
  useEffect(() => {
    const load = async () => {
      const res = await getProductById(id);

      // Remove _id field before setting state
      const { _id, ...cleanData } = res.data;

      setProduct(cleanData);
    };

    load();
  }, [id]);

  // Update handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, product);
    alert("Product updated successfully!");
    window.location.href = "/";
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* ⭐ FIXED MARGIN LIKE DASHBOARD ⭐ */}
      <div
        className={`min-h-screen w-full bg-gray-100 transition-all duration-300 ${
          open ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar user={currentUser} />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">✏️ Edit Product</h1>

          <form
            className="bg-white p-6 rounded shadow space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              className="border p-2 w-full"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />

            <input
              className="border p-2 w-full"
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              required
            />

            <input
              className="border p-2 w-full"
              placeholder="Supplier"
              value={product.supplier}
              onChange={(e) =>
                setProduct({ ...product, supplier: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Purchase Price"
              value={product.purchasePrice}
              onChange={(e) =>
                setProduct({ ...product, purchasePrice: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Selling Price"
              value={product.sellingPrice}
              onChange={(e) =>
                setProduct({ ...product, sellingPrice: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Stock"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
              required
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
