/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Insynclogo from "../components/Insynclogo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { LoginBody } from "../services/auth.service";
import { loginUser } from "../services/auth.service";

export default function Login() {
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userForm, setUserForm] = useState<LoginBody>({
    email: "",
    password: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (error) setError(null);

    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError(null); 

      const response = await loginUser(userForm);
      
      if (!response.data.user.onBoarded) {
        navigate("/onboarding", {
          replace: true,
        });
      } else {
        navigate(`/workspace/${response.data.user.workspaceId}/home`, { replace: true });
      }
    } catch (err: any) {
      console.log(err);
      
      if (err?.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const isValid =
    userForm.email.trim().length > 0 &&
    userForm.password.trim().length > 0;

  return (
    /* Stacks elements vertically on mobile, aligns side-by-side on wide screens */
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f1714] overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* LEFT SIDE: Hidden entirely on mobile devices, acts as the primary layout hero panel on desktop */}
      <div className="hidden lg:flex flex-[1.4] flex-col justify-between px-12 xl:px-15 py-8">
        <div>
          <Insynclogo className="text-white" />
        </div>

        <div>
          <h1 className="text-6xl xl:text-[96px] leading-[0.92] font-bold text-white tracking-[-4px]">
            Welcome
            <br />
            back.
          </h1>

          <p className="mt-6 max-w-lg text-lg xl:text-xl text-gray-400 leading-relaxed">
            Continue where your team left off and access
            all your projects, tasks and conversations
            in one place.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          {/* Footer content slot placeholder */}
        </div>
      </div>

      {/* RIGHT SIDE: Centers the auth form cleanly on mobile and mounts structural branding at the top */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:bg-[#0f1714]">
        
        {/* Inline brand header fallback visible ONLY on mobile screens */}
        <div className="w-full max-w-md flex justify-start mb-8 lg:hidden">
          <Insynclogo className="text-white" />
        </div>

        {/* Form panel container using responsive bounds instead of a fixed desktop px scale */}
        <div className="w-full max-w-md md:max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* HEADER */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sign In
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Welcome back. Please enter your details.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleFormChange}
                placeholder="john@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-black transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisibility ? "text" : "password"}
                  name="password"
                  value={userForm.password}
                  onChange={handleFormChange}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 pr-12 text-sm sm:text-base outline-none focus:border-black transition"
                />

                <button
                  type="button"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {passwordVisibility ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR ALERTS & FORGOT PASSWORD PANEL */}
            <div className="space-y-2">
              {error && (
                <div className="text-xs text-red-500 font-medium tracking-wide bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 sm:py-3.5 rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.99]
              ${
                isValid
                  ? "bg-black text-white hover:opacity-90 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Sign In
              <ArrowRight size={16} className="sm:w-4.5 sm:h-4.5" />
            </button>

            {/* REGISTER */}
            <p className="text-center text-xs sm:text-sm text-gray-500 pt-2">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="font-medium text-black hover:underline cursor-pointer"
              >
                Create account
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}