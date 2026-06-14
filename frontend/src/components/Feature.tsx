
import { motion } from "framer-motion";
import {
  Users,
  PenLine,
  CheckSquare,
  MessageSquare,
  FolderOpen,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-time collaboration",
    description:
      "Work together seamlessly with shared workspaces, live updates, and synchronized changes.",
  },
  {
    icon: PenLine,
    title: "Collaborative whiteboard",
    description:
      "Brainstorm, sketch ideas, and plan projects with an infinite shared canvas.",
  },
  {
    icon: CheckSquare,
    title: "Task management",
    description:
      "Create, assign, and track tasks to keep projects organized and moving forward.",
  },
  {
    icon: MessageSquare,
    title: "Live chat",
    description:
      "Channels, threads, and direct messages linked directly to the work they're about.",
  },
  {
    icon: FolderOpen,
    title: "Workspace hub",
    description:
      "One place for docs, links, and pinned resources your whole team can find instantly.",
  },
  {
    icon: Lock,
    title: "Permissions & access",
    description:
      "Workspace-level roles so guests see what they need and admins stay in control.",
  },
];

const FeaturesSection = () => {
  return (
    <motion.section
      id="features"
      className="bg-black py-5 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
          What's inside
        </p>

        <h2 className="text-white font-bold text-4xl md:text-5xl tracking-tight leading-tight max-w-lg mb-16">
          A new way to collaborate.{" "}
          <span className="text-zinc-500">
            Built for modern teams.
          </span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {features.map(
            ({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -4,
                }}
                className="
                  group
                  bg-black
                  hover:bg-zinc-950
                  transition-colors
                  duration-200
                  p-8
                "
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-white/20 transition-colors duration-200">
                  <Icon
                    size={18}
                    className="text-zinc-300"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-white font-semibold text-base mb-2">
                  {title}
                </h3>

                <p className="text-zinc-500 text-sm leading-relaxed">
                  {description}
                </p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default FeaturesSection;

