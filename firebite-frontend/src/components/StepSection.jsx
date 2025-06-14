export default function StepSection() {
  const steps = [
    {
      title: "1. Choose",
      desc: "Choose your best combos from the thousands of exciting items.",
    },
    {
      title: "2. Pay",
      desc: "Pay through online easily. We use the most safe way in payment.",
    },
    {
      title: "3. Enjoy",
      desc: "Enjoy your meal from the core of heart & feel the taste inside.",
    },
  ];

  return (
    <div style={{ background: "black", padding: "4rem 1rem" }}>
      <h2
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        3 Easy Steps To Enjoy
      </h2>

      <div
        className="step-section-flex"
        style={{
          background: "#ffcc00",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "1rem",
          display: "flex",
          gap: "1rem",
        }}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              background: "white",
              padding: "2rem",
              borderRadius: "0.75rem",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                color: "#e7272d",
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                color: "black",
                fontSize: "1rem",
                lineHeight: "1.5",
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Add responsive flex direction for mobile */}
      <style>
        {`
          @media (max-width: 768px) {
            .step-section-flex {
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </div>
  );
}
