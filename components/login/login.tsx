import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../utils/auth";

export function LoginComponent() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = getUser();

    // ❌ No account
    if (!user) {
      alert("Please create account first");
      router.push("/signup");
      return;
    }

    // ❌ Wrong credentials
    if (user.email !== form.email || user.password !== form.password) {
      alert("Invalid credentials");
      return;
    }

    alert("Login successful 🚀");

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button type="submit">Login</button>
    </form>
  );
}