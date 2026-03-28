"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { cases } from "../../../data/cases";

export default function Page() {
  const [unlocked, setUnlocked] = useState(false);
  const params = useParams();
  const id = params?.id || "";

  const item = cases.find((c) => c.id === id);

  if (!item) {
    return (
      <main style={{ padding: "40px 20px", maxWidth: 700, margin: "0 auto" }}>
        <h1>未找到内容</h1>
        <p>当前 id: {String(id)}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>{item.title}</h1>

      <p style={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
        {item.free}
      </p>

      {!unlocked ? (
        <div style={styles.lockBox}>
          <div style={styles.blur} />
          <div style={styles.lockContent}>
            <button style={styles.button} onClick={() => setUnlocked(true)}>
              继续看清
            </button>
            <p style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
              解锁行动层
            </p>
          </div>
        </div>
      ) : (
        <section style={styles.deepSection}>
          <div style={styles.deepDivider}>更深一层</div>
          <p style={{ lineHeight: 1.8, whiteSpace: "pre-line", marginTop: 16 }}>
            {item.deep}
          </p>
        </section>
      )}
    </main>
  );
}

const styles = {
  lockBox: {
    position: "relative",
    marginTop: 20,
    height: 140,
  },
  blur: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
  },
  lockContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    textAlign: "center",
  },
  button: {
    background: "#1f1f1f",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: 14,
  },
  deepSection: {
    marginTop: 28,
    paddingTop: 20,
    borderTop: "1px solid #e8e2d8",
  },
  deepDivider: {
    display: "inline-block",
    fontSize: 12,
    color: "#777",
    letterSpacing: "0.08em",
  },
};