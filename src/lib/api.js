const BASE = "https://restcountries.com/v3.1";

// small helper to throw on HTTP errors
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const msg = `HTTP ${res.status} — ${res.statusText}`;
    throw new Error(msg);
  }
  return res.json();
}

// list countries (only fields we need for the list view)
export async function listCountries() {
  const fields = [
    "name",
    "cca3",
    "region",
    "population",
    "capital",
    "flags",
  ].join(",");
  return getJSON(`${BASE}/all?fields=${fields}`);
}

// details by country code
export async function getCountryByCode(code) {
  const fields = [
    "name",
    "cca3",
    "capital",
    "region",
    "subregion",
    "population",
    "languages",
    "currencies",
    "flags",
    "maps",
    "borders",
  ].join(",");
  return getJSON(`${BASE}/alpha/${code}?fields=${fields}`);
}
