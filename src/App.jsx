import Button from "./components/button/Button";

function App() {
  return (
    <main className="section">
      <div className="container stack">
        <Button>Primary</Button>

        <Button variant="secondary">
          Secondary
        </Button>

        <Button variant="ghost">
          Ghost
        </Button>

        <Button disabled>
          Disabled
        </Button>

        <Button>
  View Project
</Button>
      </div>
    </main>
  );
}

export default App;