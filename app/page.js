import { cases } from "../data/cases";

export default function HomePage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.badge}>KANQING / 看清</div>
          <h1 style={styles.title}>看清你此刻真正卡住的地方</h1>
          <p style={styles.subtitle}>
            先被一句话打中，再决定要不要继续往下看。
          </p>
        </header>

        <section style={styles.list}>
          {cases.map((item) => (
            <article key={item.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{item.title}</h2>
              <p style={styles.cardText}>{item.short}</p>
              <a href={`/case/${item.id}`} style={styles.button}>
                展开看清
              </a>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f5ef",
    color: "#1f1f1f",
    padding: "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Noto Sans SC", sans-serif',
  },
  container: {
    maxWidth: "760px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "28px",
  },
  badge: {
    display: "inline-block",
    fontSize: "12px",
    letterSpacing: "0.08em",
    color: "#666",
    marginBottom: "10px",
  },
  title: {
    fontSize: "34px",
    lineHeight: 1.2,
    margin: "0 0 12px 0",
  },
  subtitle: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "#555",
    margin: 0,
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    border: "1px solid #ece7dc",
  },
  cardTitle: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },
  cardText: {
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#444",
    margin: "0 0 16px 0",
  },
  button: {
    display: "inline-block",
    background: "#1f1f1f",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "999px",
    padding: "10px 16px",
    fontSize: "14px",
  },
};