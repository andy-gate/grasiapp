export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="marketing-grid-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59, 68, 251, 0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(77, 33, 255, 0.2), transparent 50%), radial-gradient(ellipse 40% 30% at 10% 60%, rgba(42, 16, 163, 0.25), transparent 50%)",
        }}
      />
    </div>
  );
}
