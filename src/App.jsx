import React from "react";
import styles from "./styles/App.module.css";

function App() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.brand}>CountryScout</div>
          <nav className={styles.nav} aria-label="Primary">
            {/* nav links will go here when we add routing */}
            <a href="#">Home</a>
            <a href="#">Favorites</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <section>
            <h1>Explore countries</h1>
            <p>Search, filter, and view details. Favorites persist locally.</p>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} CountryScout</p>
        </div>
      </footer>
    </>
  );
}

export default App;
