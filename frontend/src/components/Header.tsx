
import { useNavigate } from "react-router-dom";
import Insynclogo from "./Insynclogo";
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-black border-b  backdrop-blur-sm"
    >
      {/* Logo */}
      
    <Insynclogo className="text-white" />

      {/* Center Links */}
      <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
        {["Features", "About", "Pricing"].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/login")}
          className="
            text-sm
            text-zinc-400
            hover:text-white
            transition-colors
            duration-150
            px-4
            py-2
          "
        >
          Log In
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="
            text-sm
            font-semibold
            bg-white
            text-black
            px-5
            py-2
            rounded-lg
            hover:bg-zinc-200
            transition-colors
            duration-150
          "
        >
          Join / Create
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

