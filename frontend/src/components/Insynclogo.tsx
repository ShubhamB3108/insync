type InsyncLogoProps = {
  className?: string;
};

function Insynclogo({ className = "" }: InsyncLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-3xl font-bold ${className}`}>
        InSync
      </span> 
    </div>
  );
}

export default Insynclogo;