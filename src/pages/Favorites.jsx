import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { getCountryByCode } from "../lib/api";
import styles from "../styles/Home.module.css"; // reuse grid/card styles

function Favorites() {
  const { codes, remove } = useFavorites();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (codes.length === 0) {
        setCountries([]);
        setStatus("success");
        return;
      }
      setStatus("loading");
      setError(null);
      try {
        const results = await Promise.all(
          codes.map((code) => getCountryByCode(code))
        );
        // normalize possible array response, flatten
        const flat = results
          .map((r) => (Array.isArray(r) ? r[0] : r))
          .filter(Boolean);
        if (!cancelled) {
          setCountries(flat);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load favorites");
          setStatus("error");
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [codes]);

  if (status === "loading") return <p>Loading favorites…</p>;
  if (status === "error") return <p role="alert">Error: {error}</p>;

  if (codes.length === 0) {
    return (
      <>
        <h1>Favorites</h1>
        <p>You haven’t added any favorites yet.</p>
        <p><Link to="/">Browse countries</Link> and tap the ♥.</p>
      </>
    );
  }

  return (
    <>
      <h1>Favorites</h1>
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
              <div className={styles.cardTop}>
                <div className={styles.title}>{name}</div>
                <button
                  className={styles.favBtn}
                  aria-label={`Remove ${name} from favorites`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    remove(code);
                  }}
                >
                  Remove
                </button>
              </div>
              <div className={styles.meta}>
                <div>Region: {c.region ?? "—"}</div>
                <div>
                  Capital: {Array.isArray(c.capital) ? c.capital.join(", ") : (c.capital ?? "—")}
                </div>
                <div>Population: {c.population?.toLocaleString?.() ?? "—"}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Favorites;
