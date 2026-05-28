"use client";

import { motion, useReducedMotion } from "framer-motion";

const SNIPPET = `// GrasiApp — custom software
const build = async (idea: ProjectSpec) => {
  const design = await discover(idea);
  const app = await develop({
    stack: ["Next.js", "PostgreSQL", "Cloud"],
    design,
  });
  return deploy(app);
};`;

export function CodeMockup() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto mt-12 max-w-lg"
      initial={reduce ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-indigo via-brand-blue to-brand-violet opacity-40 blur-xl"
        animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/90 shadow-2xl backdrop-blur-xl"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-slate-500">
            grasiapp/project.ts
          </span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
          <code>
            {SNIPPET.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 inline-block w-4 select-none text-slate-600">
                  {i + 1}
                </span>
                <span
                  className={
                    line.startsWith("//")
                      ? "text-slate-500"
                      : line.includes("const") || line.includes("await")
                        ? "text-brand-blue-light"
                        : line.includes('"')
                          ? "text-emerald-400/90"
                          : "text-slate-300"
                  }
                >
                  {line || " "}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </motion.div>
    </motion.div>
  );
}
