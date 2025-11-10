import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import AuthLayout from "../../components/layout/AuthLayout";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Filter logic
  useEffect(() => {
    const role = localStorage.getItem("role") ?? null;
    console.log("User role on login page load:", role);
    if (role === "admin") navigate("/admin/equipment");
    else if (role === "student") navigate("/equipments");
    else if (role === "staff") navigate("/requests");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(form.email, form.password);
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("id", data.user.userId);

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/equipment");
      } else if (data.user.role === "student") {
        navigate("/equipments");
      } else if (data.user.role === "staff") navigate("/requests");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      footer={
        <div>
          <small className="text-muted">
            <strong>Test Accounts:</strong>
            <br />
            Admin: <code>admin@example.com / admin123</code>
            <br />
            Student: <code>studenta@example.com / student123</code>
            <br />
            Staff: <code>staff@example.com / staff123</code>
          </small>
        </div>
      }
    >
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="text-center mt-3">
        <a href="/signup" className="text-decoration-none">
          Don't have an account? Signup
        </a>
      </div>
    </AuthLayout>
  );
}
