import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import AuthLayout from "../../components/layout/AuthLayout";

export default function Login() {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r === "admin") nav("/admin/equipment");
    if (r === "student") nav("/equipments");
    if (r === "staff") nav("/requests");
  }, [nav]);

  const update = (e) => {
    setCreds((c) => ({ ...c, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);

    try {
      const res = await login(creds.email, creds.password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      localStorage.setItem("id", res.user.userId);

      if (res.user.role === "admin") return nav("/admin/equipment");
      if (res.user.role === "student") return nav("/equipments");
      if (res.user.role === "staff") return nav("/requests");
    } catch (err) {
      setMsg(err.response?.data?.error || "Unable to login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Access Portal"
      footer={
        <small className="text-muted">
          <b>Demo Accounts</b><br/>
          Admin → admin@example.com / admin123<br/>
          Student → studenta@example.com / student123<br/>
          Staff → staff@example.com / staff123
        </small>
      }
    >
      {msg && <div className="alert alert-warning py-2">{msg}</div>}

      <form onSubmit={submit} className="mt-2">
        <input
          className="form-control mb-2"
          name="email"
          type="email"
          placeholder="Your email address"
          value={creds.email}
          onChange={update}
          disabled={busy}
          required
        />
        <input
          className="form-control mb-3"
          name="password"
          type="password"
          placeholder="Your password"
          value={creds.password}
          onChange={update}
          disabled={busy}
          required
        />
        <button className="btn btn-success w-100" disabled={busy}>
          {busy ? "Please wait..." : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-3">
        <a href="/signup" className="text-decoration-none small">
          New user? Create account
        </a>
      </div>
    </AuthLayout>
  );
}
