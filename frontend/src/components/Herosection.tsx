import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] bg-black flex flex-col items-center justify-center text-center px-6 pt-24 pb-10 overflow-hidden">
      {/* Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Center Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-white/3 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Heading */}

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-white font-bold tracking-tight leading-[1.08] max-w-4xl mb-6 text-5xl md:text-6xl lg:text-7xl"
            >
              Collaborate, Chat & Create
              <br />
              <span className="text-zinc-400">In Sync.</span>
            </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
          }}
          className="text-zinc-500 text-lg leading-relaxed max-w-xl mb-10"
        >
          Bring your team together with live chat,
          collaborative whiteboards, shared workspaces,
          and task management — all in one platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.6,
          }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => navigate("/signup")}
            className="
              bg-white
              text-black
              text-sm
              font-semibold
              px-7
              py-3
              rounded-lg
              hover:bg-zinc-200
              transition-colors
              duration-150
            "
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="
              bg-transparent
              text-zinc-400
              text-sm
              font-medium
              px-7
              py-3
              rounded-lg
              border
              border-white/15
              hover:border-white/30
              hover:text-white
              transition-all
              duration-150
            "
          >
            Log In
          </button>
        </motion.div>

        {/* Navigation Links */}
        
      </div>
    </section>
  );
};

export default HeroSection;