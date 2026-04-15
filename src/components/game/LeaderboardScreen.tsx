"use client";

const CHILD_STATUS_LABEL: Record<string, string> = {
  school: "In School",
  working: "Working",
  trained: "Trained",
};

interface PlayerResult {
  username: string;
  childStatus: string;
  balance: number;
  scenario: number;
}

interface Props {
  results: {
    finishedCount: number;
    totalPlayers: number;
    playerList: PlayerResult[];
  };
  isHost?: boolean;
  onRevealStats?: () => void;
}

export default function LeaderboardScreen({
  results,
  isHost = false,
  onRevealStats,
}: Props) {
  const { finishedCount, totalPlayers, playerList } = results;

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: "560px", width: "100%", padding: "64px 24px 48px" }}>

        {/* Header */}
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaaaaa", textAlign: "center", marginBottom: "12px" }}>
          Leaderboard
        </p>
        <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#111111", textAlign: "center", lineHeight: 1.15, marginBottom: "10px" }}>
          Final Rankings
        </h2>
        <p style={{ textAlign: "center", color: "#888888", fontSize: "14px", marginBottom: "40px" }}>
          {finishedCount} of {totalPlayers} players completed the simulation
        </p>

        {/* Player list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
          {playerList.map((player, index) => {
            const isTop3 = index < 3;
            const rankColors = ["#d4a017", "#9e9e9e", "#a05a2c"];
            const rankColor = isTop3 ? rankColors[index] : "#cccccc";

            return (
              <div
                key={player.username}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  border: "1.5px solid",
                  borderColor: isTop3 ? rankColor : "#eeeeee",
                  borderRadius: "14px",
                  background: isTop3 ? "#fafafa" : "#ffffff",
                }}
              >
                {/* Rank badge */}
                <span style={{
                  flexShrink: 0,
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: rankColor,
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {index + 1}
                </span>

                {/* Name + status */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: "#111111", fontSize: "14px", margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {player.username}
                  </p>
                  <p style={{ fontSize: "12px", color: "#aaaaaa", margin: 0, marginTop: "2px" }}>
                    Child: {CHILD_STATUS_LABEL[player.childStatus] ?? player.childStatus}
                  </p>
                </div>

                {/* Balance */}
                <span style={{
                  flexShrink: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  color: player.balance < 0 ? "#dc2626" : "#111111",
                }}>
                  {player.balance < 0 ? `–$${Math.abs(player.balance)}` : `$${player.balance}`}
                </span>
              </div>
            );
          })}

          {playerList.length === 0 && (
            <p style={{ textAlign: "center", color: "#bbbbbb", fontSize: "14px", padding: "24px 0" }}>
              No results yet.
            </p>
          )}
        </div>

        {/* Host action */}
        {isHost && onRevealStats && (
          <button
            onClick={onRevealStats}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "#111111",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Show Class Statistics →
          </button>
        )}

        {!isHost && (
          <p style={{ textAlign: "center", color: "#bbbbbb", fontSize: "12px", marginTop: "8px" }}>
            Waiting for the host to continue…
          </p>
        )}
      </div>
    </div>
  );
}
