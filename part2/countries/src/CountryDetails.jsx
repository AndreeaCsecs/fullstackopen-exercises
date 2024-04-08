import { useState, useEffect } from "react";

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`
        );
        const data = await response.json();
        if (response.ok) {
          setWeather(data);
        } else {
          console.error("Error fetching weather data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    if (country && country.capital) {
      fetchWeather();
    }
  }, [country]);

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  };

  if (!country) return null;

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common} Flag`} />
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {kelvinToCelsius(weather.main.temp)}°C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <p>Description: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default CountryDetails;
