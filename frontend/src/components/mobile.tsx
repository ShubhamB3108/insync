export const MobileNotSupported = () => {
  return (
    <div className="fixed inset-0 z-9999 bg-[#14161e] flex items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Desktop Only
        </h1>

        <p className="text-zinc-400">
          inSync is currently optimized for desktop devices.
          Please open the application on a laptop or desktop
          for the best experience.
        </p>
      </div>
    </div>
  );
};