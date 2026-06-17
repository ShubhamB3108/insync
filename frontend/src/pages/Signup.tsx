/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, EyeOff } from "lucide-react";
import Insynclogo from "../components/Insynclogo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RegisterBody } from "../services/auth.service";
import { registerUser } from "../services/auth.service";

export default function Signup() {
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  
  // New state to capture email validity errors from the server
  const [isInvalidEmailError, setIsInvalidEmailError] = useState(false);

  const [userForm, setUserForm] = useState<RegisterBody>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset the error status when the user starts typing in the email field again
    if (name === "email") {
      setIsInvalidEmailError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsInvalidEmailError(false); // Reset error state on new submission

      const response = await registerUser(userForm); 

      if (!response.data.onBoarded) {
        navigate("/onboarding", {
          replace: true,
        });
      } else {
        navigate('/workspace/');
      }
    } catch (error: any) {
      console.log(error);
      // Check if the error response carries a 404 status code
      if (error?.response?.status === 409) {
        setIsInvalidEmailError(true);
      }
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
    /* Stacks elements vertically on mobile, aligns side-by-side on wide screens */
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f1714] overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* LEFT SIDE: Hidden entirely on mobile devices, acts as the primary layout hero panel on desktop */}
      <div className="hidden lg:flex flex-[1.4] flex-col justify-between px-12 xl:px-15 py-8">
        <div>
          <Insynclogo className="text-white" />
        </div>

        <div>
          <h1 className="text-6xl xl:text-[96px] leading-[0.92] font-bold text-white tracking-[-4px]">
            Create
            <br />
            account.
          </h1>

          <p className="mt-6 max-w-lg text-lg xl:text-xl text-gray-400 leading-relaxed">
            Join your team, manage projects, collaborate
            in real time and keep everything organized
            in one workspace.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          {/* Footer content slot placeholder */}
        </div>
      </div>

      {/* RIGHT SIDE: Centers the auth form cleanly on mobile and mounts structural branding at the top */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:bg-[#0f1714]">
        
        {/* Inline brand header fallback visible ONLY on mobile screens */}
        <div className="w-full max-w-md flex justify-start mb-6 sm:mb-8 lg:hidden">
          <Insynclogo className="text-white" />
        </div>

        {/* Form white-card viewport box wrapper using responsive bounds */}
        <div className="w-full max-w-md md:max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* HEADER */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create Account
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Let's get your workspace ready.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
          >
            {/* NAME ROW: Stacks linearly on mobile viewports, splits into dual columns above the sm threshold */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={userForm.firstName}
                  onChange={handleFormChange}
                  
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={userForm.lastName}
                  onChange={handleFormChange}
                
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-black transition"
                />
              </div>
            </div>

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
                
                className={`w-full border rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-black transition ${
                  isInvalidEmailError ? "border-red-500" : "border-gray-200"
                }`}
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
                  placeholder="Enter password"
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={confirmPasswordVisibility ? "text" : "password"}
                  name="confirmPassword"
                  value={userForm.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 pr-12 text-sm sm:text-base outline-none focus:border-black transition"
                />

                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {confirmPasswordVisibility ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {userForm.confirmPassword && userForm.password !== userForm.confirmPassword && (
                <p className="text-red-500 text-xs sm:text-sm mt-2">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* 404 SERVER ERROR MESSAGE */}
            {isInvalidEmailError && (
              <p className="text-red-500 text-sm font-medium text-center pt-1 animate-pulse">
                Please enter a valid email address.
              </p>
            )}

            {/* BUTTON */}
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
              Sign Up 
            </button>

            {/* LOGIN LINK TRIGGER */}
            <p className="text-center text-xs sm:text-sm text-gray-500 pt-2">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
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