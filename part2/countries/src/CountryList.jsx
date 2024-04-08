const CountryList = ({ countries, handleCountrySelect }) => {
  return (
    <>
      {countries.map((country, index) => (
        <div key={index}>
          <span>{country.name.common}</span>
          <button onClick={() => handleCountrySelect(country)}>Show</button>
        </div>
      ))}
    </>
  );
};

export default CountryList;
