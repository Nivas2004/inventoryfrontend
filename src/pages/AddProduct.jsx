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
    userId: "", // backend expects this
  });

  const { open } = useSidebar();

  // 🔐 Auth check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        setCurrentUser(user);

        // store firebase UID
        setProduct((prev) => ({
          ...prev,
          userId: user.uid,
        }));
      }
    });
  }, []);

  // Profit calculation
  const profit =
    product.purchasePrice && product.sellingPrice
      ? (
          ((product.sellingPrice - product.purchasePrice) /
            product.purchasePrice) *
          100
        ).toFixed(2)
      : 0;

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedProduct = {
      ...product,
      purchasePrice: Number(product.purchasePrice),
      sellingPrice: Number(product.sellingPrice),
      stock: Number(product.stock),
      userId: currentUser.uid, // ensure correct value
    };

    await addProduct(formattedProduct);
    alert("Product added successfully!");

    window.location.href = "/";
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
          <h1 className="text-3xl font-bold mb-6">➕ Add Product</h1>

          <form
            className="bg-white p-6 rounded shadow space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              className="border p-3 w-full rounded"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
              required
            />

            <input
              className="border p-3 w-full rounded"
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              required
            />

            <input
              className="border p-3 w-full rounded"
              placeholder="Supplier"
              value={product.supplier}
              onChange={(e) =>
                setProduct({ ...product, supplier: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="border p-3 w-full rounded"
              placeholder="Purchase Price"
              value={product.purchasePrice}
              onChange={(e) =>
                setProduct({
                  ...product,
                  purchasePrice: Number(e.target.value),
                })
              }
              required
            />

            <input
              type="number"
              className="border p-3 w-full rounded"
              placeholder="Selling Price"
              value={product.sellingPrice}
              onChange={(e) =>
                setProduct({
                  ...product,
                  sellingPrice: Number(e.target.value),
                })
              }
              required
            />

            <div className="bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded text-center font-semibold">
              Profit Percentage: {profit}% 📈
            </div>

            <input
              type="number"
              className="border p-3 w-full rounded"
              placeholder="Stock Quantity"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: Number(e.target.value) })
              }
              required
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
