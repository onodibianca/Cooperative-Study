import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TextFileViewer from "./pages/TextFileViewer";
import "./App.css";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-green-100">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/files/:fileId/view" element={<TextFileViewer />} />
      </Routes>
    </div>
  );
}

export default App;
