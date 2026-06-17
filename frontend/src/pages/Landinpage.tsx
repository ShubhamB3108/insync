import { motion } from "framer-motion";
import Navbar from "../components/Header";
import Herosection from "../components/Herosection";
import Features from "../components/Feature";
import AboutPage from "../components/About";

const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Navbar />
      <Herosection />
      <Features />
      <AboutPage />
    </motion.div>
  );
};

export default LandingPage;