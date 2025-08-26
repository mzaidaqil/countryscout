import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { listCountries } from "../lib/api";
import styles from "../styles/Home.module.css";

function Home() {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Derive filtered list
  const filtered = useMemo(() => {
    let list = countries;

    if (region !== "all") {
      list = list.filter(c => (c.region || "").toLowerCase() === region);
    }

    if (debouncedQuery) {
      list = list.filter(c => {
        const name = (c.name?.common || "").toLowerCase();
        const capital = Array.isArray(c.capital)
          ? c.capital.join(", ").toLowerCase()
          : (c.capital || "").toLowerCase();
        return name.includes(debouncedQuery) || capital.includes(debouncedQuery);
      });
    }

    return list;
  }, [countries, region, debouncedQuery]);

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const data = await listCountries();
        if (!cancelled) {
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
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return <p>Loading countries…</p>;
  if (status === "error") return <p role="alert">Error: {error}</p>;

  return (
    <>
      <h1>Explore countries</h1>

      <div className={styles.controls}>
        <input
          className={styles.input}
          type="search"
          placeholder="Search by name or capital…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search countries"
        />
        <select
          className={styles.select}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Filter by region"
        >
          <option value="all">All regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
          <option value="antarctic">Antarctic</option>
        </select>
      </div>

      <div className={styles.count}>
        Showing {filtered.length} of {countries.length}
      </div>

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No matches. Try another search or region.</p>
        ) : (
          filtered.map((c) => {
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
                {flag && (
                  <img
                    className={styles.flag}
                    src={flag}
                    alt={`${name} flag`}
                  />
                )}
                <div className={styles.title}>{name}</div>
                <div className={styles.meta}>
                  <div>Region: {c.region ?? "—"}</div>
                  <div>
                    Capital: {Array.isArray(c.capital)
                      ? c.capital.join(", ")
                      : (c.capital ?? "—")}
                  </div>
                  <div>Population: {c.population?.toLocaleString?.() ?? "—"}</div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}

export default Home;
