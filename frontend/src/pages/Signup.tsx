
import { Eye, EyeOff } from "lucide-react";
import Insynclogo from "../components/Insynclogo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RegisterBody } from "../services/auth.service";
import { registerUser } from "../services/auth.service";

export default function Signup() {
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] =
    useState(false);

  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);


  const [userForm, setUserForm] =
    useState<RegisterBody>({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
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

      const response = await registerUser(userForm); 

      if (!response.data.onBoarded) {
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
    userForm.firstName.trim().length > 0 &&
    userForm.lastName.trim().length > 0 &&
    userForm.email.trim().length > 0 &&
    userForm.password.length >= 8 &&
    userForm.confirmPassword.length >= 8 &&
    userForm.password === userForm.confirmPassword;

  return (
    <div className="min-h-screen flex bg-[#0f1714] overflow-hidden">
      {/* LEFT SIDE */}
      <div className="flex-[1.4] flex flex-col justify-between px-24 py-14">
        <div>
          <Insynclogo className="text-white" />
        </div>

        <div>
          <h1 className="text-[96px] leading-[0.92] font-bold text-white tracking-[-4px]">
            Create
            <br />
            account.
          </h1>

          <p className="mt-6 max-w-lg text-xl text-gray-400 leading-relaxed">
            Join your team, manage projects, collaborate
            in real time and keep everything organized
            in one workspace.
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
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2">
              Let's get your workspace ready.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* NAME ROW */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={userForm.firstName}
                  onChange={handleFormChange}
                  placeholder="John"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={userForm.lastName}
                  onChange={handleFormChange}
                  placeholder="Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black transition"
                />
              </div>
            </div>

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
                  placeholder="Enter password"
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={
                    confirmPasswordVisibility
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={userForm.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 outline-none focus:border-black transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setConfirmPasswordVisibility(
                      !confirmPasswordVisibility
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {confirmPasswordVisibility ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {userForm.confirmPassword &&
                userForm.password !==
                  userForm.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* BUTTON */}
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
              Sign Up 
            </button>

            {/* LOGIN */}
            <p className="text-center text-sm text-gray-500 pt-2">
              Already have an account?{" "}
              <span
                onClick={() =>
                  navigate("/login")
                }
                className="font-medium text-black hover:underline cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

