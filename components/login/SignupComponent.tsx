import { saveUser } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupComponent() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // save user in localStorage
    saveUser(form);

    alert("Account created successfully!");

    // go to login page
    router.push("/login");
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button type="submit">Signup</button>
    </form>
  );
}