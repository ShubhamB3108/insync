import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Insynclogo from "../components/Insynclogo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { LoginBody } from "../services/auth.service";
import { loginUser } from "../services/auth.service";

export default function Login() {
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] =
    useState(false);

  const [userForm, setUserForm] =
    useState<LoginBody>({
      email: "",
      password: "",
    });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();

      const response = await loginUser(userForm);

      if (!response.data.user.onBoarded) {
        navigate("/onboarding", {
          replace: true,
        });
      }
      else{
        navigate('/workspace')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isValid =
    userForm.email.trim().length > 0 &&
    userForm.password.trim().length > 0;

  return (
    <div className="min-h-screen flex bg-[#0f1714] overflow-hidden">
      {/* LEFT SIDE */}
      <div className="flex-[1.4] flex flex-col justify-between px-24 py-14">
        <div>
          
            <Insynclogo className="text-white" />
          
        </div>

        <div>
          <h1 className="text-[96px] leading-[0.92] font-bold text-white tracking-[-4px]">
            Welcome
            <br />
            back.
          </h1>

          <p className="mt-6 max-w-lg text-xl text-gray-400 leading-relaxed">
            Continue where your team left off and access
            all your projects, tasks and conversations
            in one place.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <button className="hover:text-white transition">
            Terms
          </button>

          <button className="hover:text-white transition">
            Privacy
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-8">
        <div className="w-145 bg-white rounded-3xl shadow-2xl p-8">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign In
            </h2>

            <p className="text-gray-500 mt-2">
              Welcome back. Please enter your details.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleFormChange}
                placeholder="john@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    passwordVisibility
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={userForm.password}
                  onChange={handleFormChange}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 outline-none focus:border-black transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setPasswordVisibility(
                      !passwordVisibility
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {passwordVisibility ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-black"
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
              ${
                isValid
                  ? "bg-black text-white hover:opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Sign In
              <ArrowRight size={18} />
            </button>

            {/* REGISTER */}
            <p className="text-center text-sm text-gray-500 pt-2">
              Don't have an account?{" "}
              <span
                onClick={() =>
                  navigate("/signup")
                }
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