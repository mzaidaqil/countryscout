import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCountries } from "../lib/api";
import styles from "../styles/Home.module.css";


function Home() {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const data = await listCountries();
        if (!cancelled) {
          // sort by name.common for stable UI
          data.sort((a, b) => a.name.common.localeCompare(b.name.common));
          setCountries(data);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load");
          setStatus("error");
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);
  
  if (status === "loading") return <p>Loading countries…</p>;
  if (status === "error") return <p role="alert">Error: {error}</p>;

  return (
    <>
      <h1>Explore countries</h1>
      <div className={styles.grid}>
        {countries.map((c) => {
          const code = c.cca3;
          const name = c.name?.common ?? code;
          const flag = c.flags?.png || c.flags?.svg;
          return (
            <Link
              key={code}
              to={`/country/${code}`}
              className={styles.card}
              aria-label={`View details for ${name}`}
            >
              {flag && <img className={styles.flag} src={flag} alt={`${name} flag`} />}
              <div className={styles.title}>{name}</div>
              <div className={styles.meta}>
                <div>Region: {c.region ?? "—"}</div>
                <div>Capital: {Array.isArray(c.capital) ? c.capital.join(", ") : (c.capital ?? "—")}</div>
                <div>Population: {c.population?.toLocaleString?.() ?? "—"}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
export default Home;

