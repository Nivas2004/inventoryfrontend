import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { SidebarProvider } from "./context/SidebarContext";

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
