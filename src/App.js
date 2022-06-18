import React, { useState } from "react";
import "./styles.css";
import cities from "./cities.json";
import { Map } from "./components/Map";
import img_sun from "./img_sun.svg";

const CITIES_LENGTH = cities.length;
const googleKey = "AIzaSyDlNDdvaxU7q4ASnvXZCgfhlJ7CO7TOEFA";

export default function App() {
  const [mode, updateMode] = useState("start");
  const [temperatureGuess, updateTemperatureGuess] = useState(0);
  const [temperatureActual, updateTemperaturActual] = useState(0);
  const [city, setCity] = useState({});
  const [score, updateScore] = useState(Number(window.localStorage.score) || 0);
  const [coords, setCoords] = useState(null);
  const tempDifference = Math.abs(temperatureGuess - temperatureActual);

  const incrementScore = () => {
    console.log("temperatureGuess: ", temperatureGuess);
    if (temperatureGuess !== "") {
      // const tempDifference = Math.abs(temperatureGuess - temperatureActual);
      const scoreIncrement = tempDifference > 10 ? 0 : 10 - tempDifference;
      const newScore = score + scoreIncrement;
      updateScore(newScore);
      window.localStorage.score = newScore;
      console.log("scoreIncrement: ", scoreIncrement);
    }
  };

  const goToGuess = () => {
    const randomCityNumber = Math.floor(Math.random() * CITIES_LENGTH);
    const newCity = cities[randomCityNumber];

    fetch(`https://weatherdbi.herokuapp.com/data/weather/${newCity.city}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.currentConditions?.temp?.c !== undefined) {
          updateTemperaturActual(data.currentConditions.temp.c);
        } else {
          goToGuess();
        }
      });
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        newCity.city +
        "&key=" +
        googleKey
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const coords = data.results[0].geometry.location;
          setCoords(coords);
        } else {
          goToGuess();
        }
      });

    setCity(newCity);
    updateMode("guess");
    //updateTemperatureGuess(0);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (temperatureGuess !== "") {
      incrementScore();
      updateMode("result");
    }
  };

  const setTempGuess = (e) => {
    // console.log(e.target.value);
    updateTemperatureGuess(e.target.value);
  };

  const Mode = () => {
    if (mode === "guess") {
      return (
        <div className="container-guess">
          <>
            <label className="city-country">
              {city.city}, {city.country}
            </label>{" "}
            {}
            <input
              // type="number"
              type="text"
              value={temperatureGuess}
              onChange={setTempGuess}
              autoFocus={true}
            />
            <button className="btn" onClick={onSubmit}>
              Guess
            </button>
          </>
        </div>
      );
    }
    if (mode === "result") {
      return (
        <div className="container-diff">
          <div className="city-country">
            {city.city}, {city.country}
          </div>
          <div className="diff-guessed">
            You guessed: <br />
            <div className="temp">{temperatureGuess}&deg;</div>
          </div>
          <div className="diff-actual">
            Actual temperature: <br />
            <div className="temp">{temperatureActual}&deg;</div>
          </div>{" "}
          <br />
          <div>
            <div className="temp-diff">
              {tempDifference}&deg; difference <br />
            </div>
            <button className="btn" onClick={goToGuess}>
              Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="container-start">
        <img src={img_sun} alt="sun" />
        <h1>Temperature Oracle</h1>
        <h2>Oracle suggests a city, you guess the temperature there</h2>
        <button className="btn" onClick={goToGuess}>
          Start
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="map">
        {coords && <Map lat={coords.lat} lng={coords.lng} />}
      </div>
      {mode !== "start" && (
        <div className="container-results">
          <span className="your-score">Your Score:</span>
          <br />
          <span className="score-number">{score}</span>
        </div>
      )}
      <Mode />
    </div>
  );
}
