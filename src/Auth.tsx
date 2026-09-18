import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import logo from "./assets/logo.png";

const inputClass =
  "bg-background border border-border rounded px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent transition w-full";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  const handleLogIn = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4">
      <img src={logo} alt="Dashko logo" className="h-20" />

      <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-sm flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-text text-center mb-1">
          Welcome to Dashko
        </h2>
        <p className="text-text-muted text-sm text-center mb-2">
          Track your vehicles and service history in one place.
        </p>

        <input
          className={inputClass}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="text-danger text-sm">{errorMsg}</p>}

        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={handleLogIn}
            disabled={loading}
            className="bg-accent text-white px-4 py-2.5 rounded font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : "Log In"}
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="border border-border text-text px-4 py-2.5 rounded font-medium hover:border-accent hover:text-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
