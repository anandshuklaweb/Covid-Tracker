import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, CardContent } from "@mui/material";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import Footer from "./Footer";
import Information from "./Information";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

        if (countryCode === "worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className="app">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <h1 className="navbar-brand">COVID Tracker</h1>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="d-flex">
              <select
                className="form-select d-flex"
                variant="outlined"
                value={country}
                onChange={onCountryChange}
              >
                <option value="worldwide">Worldwide</option>
                {countries.map((country, i) => (
                  <option key={i} value={country.value}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="app__stats">
          <div className="card info-main-card">
            <div className="row">
              <InfoBox
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus Cases"
                isRed
                active={casesType === "cases"}
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0.0a")}
              />

              <InfoBox
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                active={casesType === "recovered"}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                isRed
                active={casesType === "deaths"}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="app__left">
              <Map
                countries={mapCountries}
                casesType={casesType}
                center={mapCenter}
                zoom={mapZoom}
              />
            </div>
          </div>

          <div className="col-md-4">
            <Card className="app__right mt-20 mb-20">
              <CardContent>
                <div className="app__information">
                  <Table countries={tableData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mb-20">
        <LineGraph casesType={casesType} />
      </div>

      <Information />
      <Footer />
    </div>
  );
};

export default App;
