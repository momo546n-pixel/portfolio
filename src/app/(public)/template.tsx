"use client";

import { motion } from "framer-motion";

/**
 * Transition d'entrée rejouée à chaque changement de page (Next recrée le
 * template à la navigation) -> effet de pages « défilantes ».
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
