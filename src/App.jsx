import "./App.css";
import WorldMap from "./assets/world_map.png";
import axios from "axios";
import { useState } from "react";

function App() {
  // State management
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  // Returns color based on region
  function getRegionColor(region) {
    const colors = {
      Africa: "#0066cc",
      Americas: "#008000",
      Asia: "#cc0000",
      Europe: "#ccaa00",
      Oceania: "#800080",
    };
    return colors[region] || "#000000";
  }

  // Fetches all countries from API
  async function fetchData() {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all", {
        params: {
          fields: "flags,name,population,region,capital,subregion,borders,tld",
        },
      });

      const sortedData = response.data.sort(
        (a, b) => a.population - b.population
      );
      setCountries(sortedData);
    } catch (e) {
      console.error(e);
    }
  }

  // Searches for a specific country by name
  function searchCountry() {
    const foundCountry = countries.find(
      (c) => c.name.common.toLowerCase() === searchInput.toLowerCase()
    );

    if (foundCountry) {
      setCountry(foundCountry);
      setError("");
    } else {
      setCountry(null);
      setError(`${searchInput} doesn't exist. Try again.`);
    }
    setSearchInput("");
  }

  return (
    <>
      <img src={WorldMap} alt="world map" />

      <h1>Worlds Regions</h1>

      {/* Load countries button */}
      {countries.length === 0 && (
        <button className="countries-button" onClick={fetchData}>
          Click to show all countries
        </button>
      )}

      {/* Countries grid list */}
      <ul className="countries-grid">
        {countries.map((country) => (
          <li key={country.name.common}>
            <img src={country.flags.png} alt={`${country.name.common} flag`} />
            <div>
              <p
                className="country-name"
                style={{ color: getRegionColor(country.region) }}
              >
                {country.name.common}
              </p>
              <p>
                Has a population of {country.population.toLocaleString()} people
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Search form */}
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          searchCountry();
        }}
      >
        <h2>Search country information</h2>
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/901/812/non_2x/world-planet-earth-with-magnifying-glass-free-vector.jpg"
          alt="globe with magnifier"
        />
        <input
          type="text"
          name="search-input"
          value={searchInput}
          placeholder="Enter the country name here"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Selected country details */}
      {country && country.name && (
        <div className="country">
          <img src={country.flags.png} alt={country.name.common} />
          <h2>{country.name.common}</h2>
          <p>
            {country.name.common} is situated in {country.subregion}, and the
            capital is {country.capital[0]}. It has a population of{" "}
            {Math.round(country.population / 1_000_000)} million people, and it
            borders with {country.borders.length} neighboring countries:{" "}
            {country.borders.join(", ")}. Websites can be found on{" "}
            {country.tld.join(", ")} domains.
          </p>
        </div>
      )}
    </>
  );
}

export default App;
