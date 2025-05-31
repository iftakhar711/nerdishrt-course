import { useEffect } from "react";

const Roadmap = () => {
  const steps = [
    {
      title: "Get Qualified",
      description: "99% Pass rate with our expert training",
      icon: "📚",
      accent: "#525e75",
    },
    {
      title: "SIA Licence",
      description: "We handle your application process",
      icon: "🛡️",
      accent: "#78938a",
    },
    {
      title: "Fast Certification",
      description: "Accelerated programs available",
      icon: "⚡",
      accent: "#78938a",
    },
    {
      title: "Job Placement",
      description: "Dedicated job support team",
      icon: "💼",
      accent: "#525e75",
    },
  ];

  useEffect(() => {
    const cards = document.querySelectorAll(".roadmap-card");
    const connectors = document.querySelectorAll(".roadmap-connector");

    const animateStep = (index) => {
      if (index >= cards.length) return;

      const card = cards[index];
      const highlight = card.querySelector(".card-highlight");
      const icon = card.querySelector(".card-icon");
      const title = card.querySelector(".card-title");
      const desc = card.querySelector(".card-desc");

      // Animate card base
      card.style.opacity = "1";
      card.style.transform = "scale(1)";
      highlight.style.width = "100%";

      setTimeout(() => {
        icon.style.opacity = "1";
        icon.style.transform = "translateY(0)";
      }, 100);

      setTimeout(() => {
        title.style.opacity = "1";
        title.style.transform = "translateY(0)";
      }, 200);

      setTimeout(() => {
        desc.style.opacity = "1";
        desc.style.transform = "translateY(0)";
      }, 300);

      // After full card animates, trigger connector, then next step
      setTimeout(() => {
        if (index < connectors.length) {
          const connector = connectors[index];
          connector.style.opacity = "1";
          connector.style.transform = "scaleX(1)";
        }

        // Animate next step after slight delay
        setTimeout(() => animateStep(index + 1), 0.5);
      }, 500);
    };

    // Initial state
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "scale(0.8)";
      card.querySelector(".card-highlight").style.width = "0";
      card.querySelector(".card-icon").style.opacity = "0";
      card.querySelector(".card-icon").style.transform = "translateY(-20px)";
      card.querySelector(".card-title").style.opacity = "0";
      card.querySelector(".card-title").style.transform = "translateY(10px)";
      card.querySelector(".card-desc").style.opacity = "0";
      card.querySelector(".card-desc").style.transform = "translateY(10px)";
    });

    connectors.forEach((connector) => {
      connector.style.opacity = "0";
      connector.style.transform = "scaleX(0)";
      connector.style.transformOrigin = "left";
    });

    // Observe container
    const container = document.getElementById("roadmap-container");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStep(0);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (container) observer.observe(container);
  }, []);

  return (
    <div id="roadmap-container" className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-2 relative">
        {steps.map((item, index) => (
          <div
            key={`step-${index}`}
            className="flex flex-col md:flex-row items-center"
          >
            <div
              className="roadmap-card relative z-10 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100 
                w-full max-w-xs mx-auto md:mx-0 mb-4 md:mb-0 overflow-hidden
                hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              style={{
                minHeight: "200px",
                boxShadow:
                  "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                transition: "all 0.5s ease-out",
              }}
            >
              <div
                className="card-highlight absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"
                style={{ backgroundColor: item.accent, width: 0 }}
              />

              <div className="flex flex-col items-center text-center h-full">
                <div
                  className="card-icon relative flex items-center justify-center text-4xl p-4 mb-4 rounded-2xl 
                    text-white"
                  style={{
                    backgroundColor: item.accent,
                    boxShadow: `0 8px 20px -5px ${item.accent}80`,
                    opacity: 0,
                    transform: "translateY(-20px)",
                    transition: "all 0.5s ease-out",
                  }}
                >
                  {item.icon}
                  <div className="absolute -inset-2 rounded-2xl border-2 border-white/20 pointer-events-none" />
                </div>

                <div className="flex-1">
                  <h3
                    className="card-title text-xl font-bold text-gray-900 mb-2"
                    style={{
                      color: item.accent,
                      opacity: 0,
                      transform: "translateY(10px)",
                      transition: "all 0.4s ease-out",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="card-desc text-gray-600 text-sm leading-relaxed"
                    style={{
                      opacity: 0,
                      transform: "translateY(10px)",
                      transition: "all 0.4s ease-out",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className="roadmap-connector hidden md:block h-1 w-16 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full"
                style={{
                  opacity: 0,
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "all 0.4s ease-out",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
