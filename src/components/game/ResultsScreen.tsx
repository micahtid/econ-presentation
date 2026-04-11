"use client";

interface PlayerResult {
  username: string;
  childStatus: string;
  balance: number;
  scenario: number;
}

interface ResultsData {
  totalPlayers: number;
  finishedCount: number;
  childLaborCount: number;
  negativeNoLabor: number;
  playerList: PlayerResult[];
}

interface Props {
  results: ResultsData;
  isHost?: boolean;
}

export default function ResultsScreen({ results, isHost = false }: Props) {
  const { totalPlayers, finishedCount, childLaborCount, negativeNoLabor } = results;

  const pctChildLabor =
    finishedCount > 0 ? Math.round((childLaborCount / finishedCount) * 100) : 0;

  const pctNegativeNoLabor =
    finishedCount > 0 ? Math.round((negativeNoLabor / finishedCount) * 100) : 0;

  const stats = [
    {
      pct: pctChildLabor,
      label: "chose child labor to survive",
    },
    {
      pct: pctNegativeNoLabor,
      label: "avoided child labor but ended in debt",
    },
    {
      pct: pctChildLabor + pctNegativeNoLabor,
      label: "of families couldn't escape poverty's trap",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: "560px", width: "100%", padding: "64px 24px 48px" }}>

        {/* Header */}
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaaaaa", textAlign: "center", marginBottom: "12px" }}>
          Final Results
        </p>
        <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#111111", textAlign: "center", lineHeight: 1.15, marginBottom: "10px" }}>
          Simulation Results
        </h2>
        <p style={{ textAlign: "center", color: "#888888", fontSize: "14px", marginBottom: "56px" }}>
          {finishedCount} of {totalPlayers} players completed the simulation
        </p>

        {/* Stat bars — column, centered */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {stats.map(({ pct, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              {/* Percentage */}
              <p style={{ fontSize: "40px", fontWeight: 700, color: "#111111", lineHeight: 1, margin: "0 0 6px 0" }}>
                {pct}%
              </p>
              {/* Label */}
              <p style={{ fontSize: "14px", color: "#888888", margin: "0 0 14px 0", lineHeight: 1.4 }}>
                {label}
              </p>
              {/* Bar track */}
              <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "#111111",
                    borderRadius: "999px",
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {!isHost && (
          <p style={{ textAlign: "center", color: "#bbbbbb", fontSize: "12px", marginTop: "40px" }}>
            Thank you for participating in the simulation.
          </p>
        )}
      </div>
    </div>
  );
}
