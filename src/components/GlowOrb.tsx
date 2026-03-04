import { motion } from "framer-motion";

const GlowOrb = ({
  className = "",
  color = "primary",
  size = 400,
  delay = 0,
}: {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
}) => {
  const colorMap: Record<string, string> = {
    primary: "hsl(265 80% 65%)",
    cyan: "hsl(195 90% 60%)",
    violet: "hsl(280 70% 70%)",
    rose: "hsl(340 70% 65%)",
  };

  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colorMap[color] || colorMap.primary}22 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export default GlowOrb;
