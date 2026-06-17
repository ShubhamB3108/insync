import { useState, useEffect } from "react";
import { Monitor, Smartphone, ArrowRight } from "lucide-react";

export default function MobileAlertModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user is on a mobile device screen size (less than 1024px width)
    const isMobileScreen = window.innerWidth < 1024;
    
    // Check if they've already dismissed the alert during this session
    const hasDismissed = sessionStorage.getItem("mobile-warning-dismissed");

    if (isMobileScreen && !hasDismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, []);

  const handleContinue = () => {
    sessionStorage.setItem("mobile-warning-dismissed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0f1714] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
        
        {/* ICON GRAPHIC */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
            <Smartphone size={32} />
          </div>
          <div className="text-gray-600 animate-pulse">➔</div>
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
            <Monitor size={32} />
          </div>
        </div>

        {/* TEXT CONTENT */}
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Desktop Recommended
        </h3>
        
        <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
          InSync is optimized for large displays to manage projects, timelines, and real-time workspaces effectively. Your current screen setup might offer a limited experience.
        </p>

        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs sm:text-sm text-yellow-400">
          For the best collaboration experience, please switch to a desktop browser.
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-white hover:bg-gray-100 text-black font-medium rounded-xl text-sm sm:text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            Continue with Mobile
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}