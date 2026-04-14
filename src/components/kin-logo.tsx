export function KinLogo({ size = 44 }: { size?: number }) {
  return (
    <img
      src="/img/Logo-Transparent.png"
      alt="Viking Roots Logo"
      style={{ width: size, height: size, objectFit: "contain" }}
      className="rounded-md"
    />
  );
}
