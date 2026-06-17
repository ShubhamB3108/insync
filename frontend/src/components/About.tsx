import { motion } from "framer-motion";
import { 
  Compass, 
  Layers, 
  Cpu 
} from "lucide-react";

const pillars = [
  {
    icon: Compass,
    title: "Our Mission",
    description: "To unify disconnected tools into a singular, high-performance workspace where execution meets intent.",
  },
  {
    icon: Layers,
    title: "Built for Context",
    description: "We believe conversations shouldn't live miles away from tasks. Context is preserved across everything you build.",
  },
  {
    icon: Cpu,
    title: "Engineered Speed",
    description: "Zero bloat, real-time sync engines, and optimized interactions tailored strictly for teams that move fast.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white antialiased">
      {/* Structural layout wrapper matching the main layout metrics */}
      <motion.div 
        className="max-w-5xl mx-auto px-6 py-28 md:py-36 flex flex-col lg:flex-row gap-16 lg:gap-8 justify-between items-start"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        {/* LEFT COLUMN: Editorial Profile Headers */}
        <div className="max-w-md lg:sticky lg:top-24">
          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4 font-medium">
            Who we are
          </p>

          <h1 className="text-white font-bold text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
            The backbone of execution.{" "}
            <span className="text-zinc-500">
              Not just another platform.
            </span>
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed font-normal">
            inSync was forged from frustration with noisy channels, fragmented tool stacks, and lost context. We build primitives for high-agency teams to brainstorm, track, and sync in absolute alignment.
          </p>
        </div>

        {/* RIGHT COLUMN: Interactive Pillar Stack */}
        <div className="flex-1 w-full max-w-xl flex flex-col gap-3">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.12,
                ease: "easeOut"
              }}
              whileHover={{ x: 4 }}
              className="group flex gap-6 p-6 rounded-2xl bg-zinc-950/40 border border-white/2 hover:bg-zinc-950/90 hover:border-white/5 transition-all duration-200"
            >
              {/* Icon Container with subtle bounding borders */}
              <div className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-white/10 transition-colors duration-200">
                <Icon
                  size={16}
                  className="text-zinc-400 group-hover:text-white transition-colors"
                  strokeWidth={1.5}
                />
              </div>

              {/* Text Layout */}
              <div>
                <h2 className="text-zinc-200 font-medium text-base mb-1.5 transition-colors group-hover:text-white">
                  {title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </main>
  );
}