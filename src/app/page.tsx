import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Hero section */}
      <section
        style={{
          width: "100%",
          maxWidth: "1180px",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "36px",
          textAlign: "center",
        }}
      >
        {/* Eyebrow label — "small" scale: 14px / 600 */}
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "20px",
            color: "#aaaaaa",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Economics Presentation
        </p>

        {/* Heading — "display" scale: 80px / 80px line-height / 600 */}
        <h1
          style={{
            fontSize: "clamp(48px, 6.8vw, 80px)",
            fontWeight: 600,
            lineHeight: "clamp(52px, 6.8vw, 80px)",
            letterSpacing: "-0.02em",
            color: "#111111",
            maxWidth: "860px",
            margin: 0,
          }}
        >
          Economics Simulation
        </h1>

        {/* Body text — "body-lg" scale: 18px / 27px / 0.36px */}
        <p
          style={{
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "27px",
            letterSpacing: "0.36px",
            color: "#666666",
            maxWidth: "520px",
            margin: 0,
          }}
        >
          A live multiplayer simulation for presentations. Explore how extreme
          poverty forces families into impossible choices.
        </p>

        {/* Button pair — full width, stacked */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            maxWidth: "340px",
            margin: 0,
          }}
        >
          <Link href="/host" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Host a Session
          </Link>
          <Link href="/join" className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
            Join as Player
          </Link>
        </div>
      </section>

    </main>
  );
}
