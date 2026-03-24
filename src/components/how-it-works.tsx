const steps = [
  {
    title: "JOIN A PROJECT",
    description:
      "Take part in a community project focused on a family, town, or shared history.",
  },
  {
    title: "Upload & Explore Photos",
    description:
      "Upload historical photographs or explore images shared by others in the community.",
  },
  {
    title: "Help Identify & Preserve Stories",
    description:
      "Tag people, add details, and contribute short stories that help bring each photograph to life.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full bg-[#2f2a2a] px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-4xl font-bold text-white lg:text-5xl">
          How it works ?
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-md border border-[#e4bd46] p-6"
            >
              <h3 className="mb-3 text-base font-bold text-[#e4bd46] uppercase tracking-wide">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/80">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
