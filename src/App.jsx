import React from "react";
import styles from "./styles/App.module.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import CountryDetails from "./pages/CountryDetails";



function App() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.brand}>CountryScout</div>
          <nav className={styles.nav} aria-label="Primary">
            <Link to="/">Home</Link>
            <Link to="/favorites">Favorites</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/country/:code" element={<CountryDetails />} />
        </Routes>
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
