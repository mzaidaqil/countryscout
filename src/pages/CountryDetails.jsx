import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCountryByCode } from "../lib/api";



function CountryDetails() {
  const { code } = useParams(); // grabs :code from the URL
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const data = await getCountryByCode(code);
        // REST Countries returns an array for alpha in some versions; normalize
        const c = Array.isArray(data) ? data[0] : data;
        if (!cancelled) {
          setCountry(c);
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
  }, [code]);

  if (status === "loading") return <p>Loading…</p>;
  if (status === "error") return <p role="alert">Error: {error}</p>;
  if (!country) return <p>No data.</p>;

  const name = country.name?.common ?? code;
  const flag = country.flags?.png || country.flags?.svg;
  const langs = country.languages ? Object.values(country.languages).join(", ") : "—";
  const currs = country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "—";
  const caps = Array.isArray(country.capital) ? country.capital.join(", ") : (country.capital ?? "—");

  return (
    <>
      <p><Link to="..">← Back</Link></p>
      <h1>{name}</h1>
      {flag && <img src={flag} alt={`${name} flag`} style={{ width: 320, maxWidth: "100%", borderRadius: 12 }} />}
      <ul>
        <li><strong>Region:</strong> {country.region ?? "—"} {country.subregion ? `— ${country.subregion}` : ""}</li>
        <li><strong>Capital:</strong> {caps}</li>
        <li><strong>Population:</strong> {country.population?.toLocaleString?.() ?? "—"}</li>
        <li><strong>Languages:</strong> {langs}</li>
        <li><strong>Currencies:</strong> {currs}</li>
        <li><strong>Borders:</strong> {Array.isArray(country.borders) ? country.borders.join(", ") : "—"}</li>
        {country.maps?.googleMaps && (
          <li>
            <a href={country.maps.googleMaps} target="_blank" rel="noreferrer">
              View on Google Maps
            </a>
          </li>
        )}
      </ul>
    </>
  );
}
export default CountryDetails;

