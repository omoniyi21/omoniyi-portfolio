function App() {
  return (
    <main style={{ padding: "64px", background: "#FAF8F6" }}>
      <p
        style={{
          fontFamily: "Space Grotesk",
          fontSize: "14px",
          letterSpacing: ".12em",
          textTransform: "uppercase",
        }}
      >
        Typography Test
      </p>

      <h1
        style={{
          fontFamily: "Space Grotesk",
          fontSize: "96px",
          lineHeight: ".95",
          marginBottom: "32px",
        }}
      >
        Helping people
        <br />
        navigate
        <br />
        complex systems.
      </h1>

      <p
        style={{
          fontFamily: "Satoshi",
          fontSize: "24px",
          lineHeight: 1.7,
          maxWidth: "620px",
        }}
      >
        I create systems, products, and experiences with clarity and
        beauty.
      </p>
    </main>
  );
}

export default App;
