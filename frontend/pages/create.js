import { useState } from "react";

export default function CreatePlanet() {
  const [planet] = useState({
    name: "Asteria Prime",
    type: "Oceanic Planet",
    rarity: "Epic",
    habitability: "78%",
    energy: "High",
    image: "/planet-texture.jpg",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #4b1487 0%, #160022 45%, #050008 100%)",
        color: "white",
        padding: "20px",
        overflowX: "hidden",
      }}
    >
      {/* MAIN SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2.4fr 1fr",
          gap: "22px",
          alignItems: "start",
          marginTop: "20px",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "20px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 30px rgba(170,80,255,0.25)",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              lineHeight: "44px",
              fontWeight: "900",
              marginBottom: "12px",
              background: "linear-gradient(to right,#bb6cff,#ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI-DRIVEN
            <br />
            PLANET
            <br />
            GENESIS
          </h1>

          <p
            style={{
              color: "#bba6d8",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            Describe it. Generate it. Own it.
          </p>

          <textarea
            placeholder="A planet with crystal oceans, floating islands, purple skies..."
            style={{
              width: "100%",
              height: "140px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
              padding: "16px",
              resize: "none",
              outline: "none",
              fontSize: "14px",
              marginBottom: "18px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {["Cosmic", "Realistic", "Fantasy", "Sci-Fi", "Abstract"].map(
              (style, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "999px",
                    background:
                      index === 0
                        ? "linear-gradient(90deg,#7b2cff,#ff61d8)"
                        : "rgba(255,255,255,0.08)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {style}
                </div>
              )
            )}
          </div>

          {/* ATTRIBUTES */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "22px",
            }}
          >
            {[
              ["Type", "Oceanic"],
              ["Climate", "Temperate"],
              ["Resources", "Crystal + Energy"],
              ["Rarity", "Epic"],
              ["Habitability", "78%"],
              ["Energy", "High"],
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  padding: "14px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    color: "#bda7dd",
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                >
                  {item[0]}
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {item[1]}
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "18px",
              background:
                "linear-gradient(90deg,#9b3dff,#3cc8ff)",
              color: "white",
              fontWeight: "800",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(131,88,255,0.5)",
            }}
          >
            Generate Planet
          </button>
        </div>

        {/* CENTER */}
        <div>
          <div
            style={{
              position: "relative",
              height: "760px",
              borderRadius: "32px",
              overflow: "hidden",
              background:
                "radial-gradient(circle at center,#6d1bb8 0%,#26003f 60%,#140021 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 50px rgba(174,82,255,0.3)",
            }}
          >
            {/* STARS */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                opacity: 0.25,
              }}
            />

            {/* PLANET */}
            <img
              src={planet.image}
              alt="planet"
              style={{
                position: "absolute",
                width: "520px",
                height: "520px",
                objectFit: "cover",
                borderRadius: "50%",
                top: "48%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow:
                  "0 0 90px rgba(173,73,255,0.9)",
              }}
            />

            {/* RINGS */}
            <div
              style={{
                position: "absolute",
                width: "720px",
                height: "220px",
                border: "8px solid rgba(255,220,255,0.8)",
                borderRadius: "50%",
                top: "49%",
                left: "50%",
                transform:
                  "translate(-50%, -50%) rotate(-10deg)",
                boxShadow: "0 0 30px rgba(255,255,255,0.3)",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "760px",
                height: "240px",
                border: "3px solid rgba(255,255,255,0.35)",
                borderRadius: "50%",
                top: "49%",
                left: "50%",
                transform:
                  "translate(-50%, -50%) rotate(-10deg)",
              }}
            />

            {/* 360 BUTTON */}
            <div
              style={{
                position: "absolute",
                bottom: "28px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.45)",
                padding: "12px 28px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                fontWeight: "700",
              }}
            >
              ◀ &nbsp; 360° &nbsp; ▶
            </div>
          </div>

          {/* VARIATIONS */}
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <div
              style={{
                marginBottom: "14px",
                color: "#d8c7ff",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              AI Generation Results
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "8px",
              }}
            >
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  style={{
                    minWidth: "150px",
                    height: "150px",
                    borderRadius: "22px",
                    overflow: "hidden",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <img
                    src="/planet-texture.jpg"
                    alt="variation"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "20px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 30px rgba(170,80,255,0.25)",
          }}
        >
          {/* TABS */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {["Overview", "Attributes", "History"].map(
              (tab, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "999px",
                    background:
                      index === 0
                        ? "linear-gradient(90deg,#7a39ff,#ff5ed6)"
                        : "rgba(255,255,255,0.06)",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {tab}
                </div>
              )
            )}
          </div>

          <h3
            style={{
              marginBottom: "16px",
              fontSize: "22px",
            }}
          >
            Your Generated Planet
          </h3>

          <img
            src={planet.image}
            alt="planet"
            style={{
              width: "100%",
              borderRadius: "22px",
              marginBottom: "20px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginBottom: "28px",
            }}
          >
            {[
              ["Name", planet.name],
              ["Type", planet.type],
              ["Rarity", planet.rarity],
              ["Habitability", planet.habitability],
              ["Energy", planet.energy],
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                  paddingBottom: "10px",
                }}
              >
                <span style={{ color: "#bca5dc" }}>
                  {item[0]}
                </span>

                <span
                  style={{
                    fontWeight: "700",
                    color:
                      item[0] === "Rarity"
                        ? "#ff74ff"
                        : item[0] === "Habitability"
                        ? "#67ff9d"
                        : "white",
                  }}
                >
                  {item[1]}
                </span>
              </div>
            ))}
          </div>

          {/* TRAITS */}
          <div
            style={{
              marginBottom: "26px",
            }}
          >
            <div
              style={{
                marginBottom: "16px",
                fontWeight: "700",
              }}
            >
              Special Traits
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {[
                "Crystal Oceans",
                "Floating Islands",
                "Aurora Sky",
                "Energy Ring",
                "Star Core",
                "Bio Glow",
              ].map((trait, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "16px",
                    padding: "14px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  ✦
                  <br />
                  {trait}
                </div>
              ))}
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "20px",
              border: "none",
              borderRadius: "20px",
              background:
                "linear-gradient(90deg,#3aa8ff,#ff4fd8)",
              color: "white",
              fontWeight: "900",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 0 30px rgba(125,87,255,0.45)",
            }}
          >
            Mint Planet 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
