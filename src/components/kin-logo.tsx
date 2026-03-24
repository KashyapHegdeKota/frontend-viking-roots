export function KinLogo({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-md border-2 border-[#e4bd46] bg-transparent"
      aria-hidden="true"
    >
      <span
        style={{ fontSize: size * 0.36 }}
        className="font-bold tracking-widest text-[#e4bd46]"
      >
        KIN
      </span>
    </div>
  );
}
