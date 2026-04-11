"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { QRCodeSVG } from "qrcode.react";

interface Player {
  _id: string;
  username: string;
}

interface Props {
  roomId: string;
  code: string;
  players: Player[];
}

export default function Lobby({ roomId, code, players }: Props) {
  const [joinUrl, setJoinUrl] = useState("");
  const [starting, setStarting] = useState(false);
  const startGame = useMutation(api.rooms.startGame);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join?code=${code}`);
  }, [code]);

  const handleStart = async () => {
    if (starting || players.length === 0) return;
    setStarting(true);
    try {
      await startGame({ roomId: roomId as Id<"rooms"> });
    } catch (err) {
      console.error(err);
      setStarting(false);
    }
  };

  return (
    <>
      {/* Scrollable content — bottom padding makes room for the pinned button */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "120px" }}>

        {/* QR + code card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "32px 24px", border: "1px solid #eeeeee", borderRadius: "20px", background: "#fafafa" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaaaaa", margin: 0 }}>
            Scan to Join
          </p>
          {joinUrl && (
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "16px", boxShadow: "rgba(0,0,0,0.06) 0px 2px 12px 0px" }}>
              <QRCodeSVG value={joinUrl} size={180} />
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "52px", fontWeight: 700, letterSpacing: "0.15em", color: "#111111", lineHeight: 1, margin: "0 0 8px 0" }}>
              {code}
            </p>
            {joinUrl && (
              <p style={{ fontSize: "12px", color: "#bbbbbb", margin: 0, wordBreak: "break-all" }}>{joinUrl}</p>
            )}
          </div>
        </div>

        {/* Player list */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111111", margin: 0 }}>
              Players Joined
            </h3>
            {/* Circle badge — fixed size so it's always round */}
            <span style={{ background: "#111111", color: "#ffffff", fontSize: "13px", fontWeight: 700, width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {players.length}
            </span>
          </div>

          {players.length === 0 ? (
            <div style={{ border: "1.5px dashed #e0e0e0", borderRadius: "14px", padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#bbbbbb", margin: 0 }}>Waiting for players to join…</p>
            </div>
          ) : (
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px", margin: 0, padding: 0, listStyle: "none" }}>
              {players.map((p) => (
                <li
                  key={p._id}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", border: "1px solid #f0f0f0", borderRadius: "12px", background: "#ffffff" }}
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#111111" }}>{p.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Pinned footer — fixed to viewport bottom, aligned to container */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(100%, 768px)",
        pointerEvents: "none",
      }}>
        {/* Gradient fade */}
        <div style={{ height: "56px", background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
        {/* Button area */}
        <div style={{ background: "#ffffff", padding: "0 16px 28px", pointerEvents: "all", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={handleStart}
            disabled={starting || players.length === 0}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", opacity: (starting || players.length === 0) ? 0.4 : 1, cursor: (starting || players.length === 0) ? "not-allowed" : "pointer" }}
          >
            {starting ? "Starting…" : "Start Simulation"}
          </button>
          {players.length === 0 && (
            <p style={{ fontSize: "12px", color: "#bbbbbb", textAlign: "center", margin: 0 }}>
              Need at least 1 player to start
            </p>
          )}
        </div>
      </div>
    </>
  );
}
