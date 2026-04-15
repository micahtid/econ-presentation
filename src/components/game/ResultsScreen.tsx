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
  /** Players who chose child labor at least once */
  childLaborCount: number;
  /** Players who never used child labor */
  noLaborCount: number;
  /** Players who never used child labor AND ended in debt */
  noLaborInDebt: number;
  /** All players who ended in debt */
  inDebtCount: number;
  playerList: PlayerResult[];
}

interface Props {
  results: ResultsData;
  isHost?: boolean;
  onLeave?: () => void;
}

export default function ResultsScreen({ results, isHost = false, onLeave }: Props) {
  const { finishedCount, childLaborCount, noLaborCount, noLaborInDebt, inDebtCount } = results;

  // Stat 1: % who chose child labor at least once
  const pctChildLabor =
    finishedCount > 0 ? Math.round((childLaborCount / finishedCount) * 100) : 0;

  // Stat 2: % of non-child-labor players who still ended in debt
  const pctNoLaborInDebt =
    noLaborCount > 0 ? Math.round((noLaborInDebt / noLaborCount) * 100) : 0;

  // Stat 3: % of all players who ended in debt
  const pctInDebt =
    finishedCount > 0 ? Math.round((inDebtCount / finishedCount) * 100) : 0;

  const stats = [
    {
      pct: pctChildLabor,
      label: "of players chose child labor at least once",
    },
    {
      pct: pctNoLaborInDebt,
      label: "who avoided child labor still ended in debt",
    },
    {
      pct: pctInDebt,
      label: "of all families ended in debt",
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
          {results.finishedCount} of {results.totalPlayers} players completed the simulation
        </p>

        {/* Stat bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {stats.map(({ pct, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "40px", fontWeight: 700, color: "#111111", lineHeight: 1, margin: "0 0 6px 0" }}>
                {pct}%
              </p>
              <p style={{ fontSize: "14px", color: "#888888", margin: "0 0 14px 0", lineHeight: 1.4 }}>
                {label}
              </p>
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
          <p style={{ textAlign: "center", color: "#bbbbbb", fontSize: "12px", marginTop: "40px", marginBottom: "16px" }}>
            Thank you for participating in the simulation.
          </p>
        )}

        {onLeave && (
          <button
            onClick={onLeave}
            style={{
              width: "100%",
              padding: "14px 24px",
              marginTop: isHost ? "48px" : "0",
              background: "#ffffff",
              color: "#111111",
              border: "1.5px solid #e5e5e5",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#111111";
              (e.currentTarget as HTMLButtonElement).style.background = "#fafafa";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e5e5";
              (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
            }}
          >
            Leave Room
          </button>
        )}
      </div>
    </div>
  );
}
