import { useState } from "react";
import SearchInput from "./SearchInput";
import CountryList from "./CountryList";
import CountryDetails from "./CountryDetails";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSearch = async (query) => {
    setSelectedCountry(null);

    if (query.trim() === "") {
      setCountries([]);
      return;
    }

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${query}`
      );
      const data = await response.json();

      if (response.ok) {
        setCountries(data);
        if (data.length === 1) {
          setSelectedCountry(data[0]);
        }
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleCountrySelect = (selected) => {
    setSelectedCountry(selected);
  };

  return (
    <div>
      <h1>Country Info App</h1>
      <SearchInput handleSearch={handleSearch} />
      {countries.length > 10 ? (
        <p>Too many matches, please specify your search</p>
      ) : (
        <>
          {countries.length === 1 ? (
            <CountryDetails country={countries[0]} />
          ) : (
            <CountryList
              countries={countries}
              handleCountrySelect={handleCountrySelect}
            />
          )}
        </>
      )}
      {selectedCountry && countries.length > 1 && (
        <CountryDetails country={selectedCountry} />
      )}
    </div>
  );
};

export default App;
