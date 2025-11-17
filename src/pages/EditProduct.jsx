import React, { useState, useEffect } from "react";
import { getProductById, updateProduct } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useSidebar } from "../context/SidebarContext";

function EditProduct() {
  const { id } = useParams(); // ✅ Only ID is needed
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    supplier: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    userId: "",
  });

  const { open } = useSidebar();

  // -------------------------------------------------
  // AUTH CHECK
  // -------------------------------------------------
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        setCurrentUser(user);
      }
    });
  }, []);

  // -------------------------------------------------
  // LOAD PRODUCT (Protected by user ID)
  // -------------------------------------------------
  useEffect(() => {
    if (!currentUser) return;

    const loadProduct = async () => {
      try {
        const res = await getProductById(id, currentUser.uid);
        const data = res.data;

        if (data.userId !== currentUser.uid) {
          alert("You do not have permission to edit this product.");
          navigate("/");
          return;
        }

        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.log("❌ Error loading product:", err);
        alert("Failed to load product.");
      }
    };

    loadProduct();
  }, [currentUser, id, navigate]);

  // -------------------------------------------------
  // UPDATE PRODUCT
  // -------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      purchasePrice: Number(product.purchasePrice),
      sellingPrice: Number(product.sellingPrice),
      stock: Number(product.stock),
      userId: currentUser.uid,
    };

    await updateProduct(id, currentUser.uid, updatedProduct);

    alert("Product updated successfully!");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-6">✏️ Edit Product</h1>

          <form
            className="bg-white p-6 rounded shadow space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              className="border p-2 w-full"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
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
                setProduct({
                  ...product,
                  purchasePrice: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Selling Price"
              value={product.sellingPrice}
              onChange={(e) =>
                setProduct({
                  ...product,
                  sellingPrice: e.target.value,
                })
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
