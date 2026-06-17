import "@fontsource/inter/700.css";

type InsyncLogoProps = {
  className?: string;
};

function InsyncLogo({ className = "" }: InsyncLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-4xl font-extrabold tracking-tight ${className}`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        inSync
      </span>
    </div>
  );
}

export default InsyncLogo;