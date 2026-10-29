import type { IconType } from "react-icons";
import {
  FaPython,
  FaJava,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaPhp,
  FaWordpress,
  FaReact,
  FaNodeJs,
  FaLinux,
  FaGitAlt,
  FaDatabase,
  FaNetworkWired,
  FaShieldHalved,
  FaMobileScreen,
  FaCloud,
  FaCode,
} from "react-icons/fa6";

type Rule = { test: RegExp; icon: IconType; color: string };

// L'ordre compte (ex. « javascript » avant « java »).
const RULES: Rule[] = [
  { test: /javascript/i, icon: FaJs, color: "#F7DF1E" },
  { test: /python|django/i, icon: FaPython, color: "#4B8BBE" },
  { test: /java/i, icon: FaJava, color: "#E76F00" },
  { test: /php/i, icon: FaPhp, color: "#8892BF" },
  { test: /html/i, icon: FaHtml5, color: "#E34F26" },
  { test: /css|tailwind/i, icon: FaCss3Alt, color: "#1572B6" },
  { test: /wordpress/i, icon: FaWordpress, color: "#2596be" },
  { test: /react|next\.?js/i, icon: FaReact, color: "#61DAFB" },
  { test: /node|express/i, icon: FaNodeJs, color: "#3C873A" },
  { test: /linux|unix|kali|virtualbox/i, icon: FaLinux, color: "#F6C915" },
  { test: /git|github/i, icon: FaGitAlt, color: "#F05032" },
  {
    test: /base de don|donn[ée]es|sql|postgres|bdd|merise|uml/i,
    icon: FaDatabase,
    color: "#4479A1",
  },
  { test: /r[ée]seau|wan|routage|commut/i, icon: FaNetworkWired, color: "#8b5cf6" },
  { test: /s[ée]curit/i, icon: FaShieldHalved, color: "#10b981" },
  { test: /mobile/i, icon: FaMobileScreen, color: "#a78bfa" },
  { test: /virtualis|cloud/i, icon: FaCloud, color: "#0ea5e9" },
];

const FALLBACK: Rule = { test: /.*/, icon: FaCode, color: "#a78bfa" };

export function techStyle(name: string): Rule {
  return RULES.find((r) => r.test.test(name)) ?? FALLBACK;
}

export function TechIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { icon: Icon, color } = techStyle(name);
  return <Icon className={className} color={color} aria-hidden />;
}
