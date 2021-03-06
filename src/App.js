import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.scss";
import location from "./images/location.svg";
import humidity from "./images/humidity.svg";
import uv from "./images/uv.svg";
import windy from "./images/windy.svg";
import WeatherProperty from "./components/WeatherProperty/WeatherProperty";
import Days from "./components/Days/Days";
import Hours from "./components/Hours/Hours";
import cloudRain from "./images/cloud-rain.svg";
import rainGif from "./images/rain.gif";
import thundery from "./images/thundery.gif";
import overcast from "./images/overcast.gif";
import fog from "./images/fog.gif";
import snow from "./images/snow.gif";
import background from "./images/background.jpg";
import clouds from "./images/clouds-gif.gif";
import sunnyGif from "./images/sunny-gif.gif";
import $ from "jquery";
import Loading from "./components/Loading/Loading";

const key = "97fa134ece674729a8750505201210";
const url = "http://api.weatherapi.com/v1/forecast.json";

function getLongDay(time) {
  return new Date(time).toLocaleString("default", {
    weekday: "long",
  });
}

function App() {
  const [query, setQuery] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [dataRes, setDataRes] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        let { latitude, longitude } = position.coords;
        setQuery(`${latitude}, ${longitude}`);
      });
    }
  }, []);

  useEffect(() => {
    if (query) {
      Axios.get(`${url}?key=${key}&q=${query}&days=3`).then((res) => {
        const { data } = res;
        setDataRes(data);
        setTimeout(() => {
          const info = {
            location: {
              country: data.location.country,
              name: data.location.name,
              localtime: data.location.localtime,
            },
            temp_c: data.current.temp_c,
            uv: data.current.uv,
            humidity: data.current.humidity,
            daily_chance_of_rain:
              data.forecast.forecastday[0].day.daily_chance_of_rain,
            wind_kph: data.current.wind_kph,
            condition: data.current.condition,
            days: data.forecast.forecastday.map((item) =>
              getLongDay(item.date)
            ),
            dayActive: getLongDay(data.location.localtime),
            hours: data.forecast.forecastday.find((item) => {
              return (
                getLongDay(item.date) === getLongDay(data.location.localtime)
              );
            }),
          };
          setWeatherInfo(info);
        }, 1000);
      });
    }
  }, [query]);

  useEffect(() => {
    if (weatherInfo) {
      const statusOfWeather = weatherInfo.condition.text.toLowerCase();
      if (statusOfWeather.includes("thunder")) {
        $("#container").css("background-image", `url(${thundery})`);
      } else if (
        statusOfWeather.includes("rain") ||
        statusOfWeather.includes("sleet") ||
        statusOfWeather.includes("drizzle") ||
        statusOfWeather.includes("ice")
      ) {
        $("#container").css("background-image", `url(${rainGif})`);
      } else if (statusOfWeather.includes("overcast")) {
        $("#container").css("background-image", `url(${overcast})`);
      } else if (
        statusOfWeather.includes("fog") ||
        statusOfWeather.includes("mist")
      ) {
        $("#container").css("background-image", `url(${fog})`);
      } else if (
        statusOfWeather.includes("snow") ||
        statusOfWeather.includes("blizzard")
      ) {
        $("#container").css("background-image", `url(${snow})`);
      } else if (statusOfWeather.includes("sunny")) {
        $("#container").css("background-image", `url(${sunnyGif})`);
      } else if (statusOfWeather.includes("cloudy")) {
        $("#container").css("background-image", `url(${clouds})`);
      } else {
        $("#container").css("background-image", `url(${background})`);
      }
    }
  }, [weatherInfo]);

  const onHandleDay = (e) => {
    const today = getLongDay(new Date());
    const dayActive = $(e.target).text();
    if (dayActive !== today) {
      const objDay = dataRes.forecast.forecastday.find((item) => {
        return getLongDay(item.date) === dayActive;
      });
      const info = {
        location: {
          country: dataRes.location.country,
          name: dataRes.location.name,
          localtime: dataRes.location.localtime,
        },
        temp_c: objDay.day.avgtemp_c,
        uv: objDay.day.uv,
        humidity: objDay.day.avghumidity,
        daily_chance_of_rain: objDay.day.daily_chance_of_rain,
        wind_kph: objDay.day.maxwind_kph,
        condition: objDay.day.condition,
        days: dataRes.forecast.forecastday.map((item) => getLongDay(item.date)),
        dayActive: getLongDay(objDay.date),
        hours: {
          hour: objDay.hour,
        },
      };
      setWeatherInfo(info);
    } else {
      const info = {
        location: {
          country: dataRes.location.country,
          name: dataRes.location.name,
          localtime: dataRes.location.localtime,
        },
        temp_c: dataRes.current.temp_c,
        uv: dataRes.current.uv,
        humidity: dataRes.current.humidity,
        daily_chance_of_rain:
          dataRes.forecast.forecastday[0].day.daily_chance_of_rain,
        wind_kph: dataRes.current.wind_kph,
        condition: dataRes.current.condition,
        days: dataRes.forecast.forecastday.map((item) => getLongDay(item.date)),
        dayActive: getLongDay(dataRes.location.localtime),
        hours: dataRes.forecast.forecastday.find((item) => {
          return (
            getLongDay(item.date) === getLongDay(dataRes.location.localtime)
          );
        }),
      };
      setWeatherInfo(info);
    }
  };

  return (
    <>
      {weatherInfo ? (
        <div className="App">
          <div className="containerWeather" id="container">
            <div className="containerWeather__background"></div>
            <div className="d-flex justify-content-between containerWeather__content">
              <div className="d-flex flex-column">
                <img
                  src={weatherInfo.condition.icon}
                  alt="clouds"
                  className="icons"
                />
                <h3 className="mb-0">{weatherInfo.condition.text}</h3>
                <h6>{`${weatherInfo.location.name} City - ${weatherInfo.location.country}`}</h6>
                <h1 className="font-weight-bolder">{weatherInfo.temp_c} °C</h1>
                <div className="d-flex align-items-center cursor-poiter">
                  <img
                    src={location}
                    alt="location"
                    className="icons icons--small"
                  />
                  <p className="mb-0 ml-2">Change Location</p>
                </div>
              </div>
              <div className="d-flex flex-column mt-4">
                <WeatherProperty
                  icon={uv}
                  title="UV"
                  content={weatherInfo.uv}
                />
                <WeatherProperty
                  icon={humidity}
                  title="Humidity"
                  content={weatherInfo.humidity + " %"}
                />
                <WeatherProperty
                  icon={cloudRain}
                  title="Chance of Rain"
                  content={weatherInfo.daily_chance_of_rain + " %"}
                />
                <WeatherProperty
                  icon={windy}
                  title="Wind Speed"
                  content={weatherInfo.wind_kph + " km/h"}
                />
              </div>
            </div>
            <div className="d-flex flex-column align-items-baseline containerWeather__bottom">
              <div className="d-flex">
                {weatherInfo.days.map((item, index) => (
                  <Days
                    day={item}
                    active={item === weatherInfo.dayActive ? true : false}
                    key={index}
                    onHandleDay={onHandleDay}
                  />
                ))}
              </div>
              <div className="containerWeather__bottom__hours">
                <div className="d-flex mb-3">
                  {weatherInfo.hours.hour.map((item) => (
                    <Hours
                      time={item.time.slice(11, 16)}
                      temperature={item.temp_c}
                      feelLike={item.feelslike_c}
                      rain={item.chance_of_rain}
                      image={item.condition.icon}
                      key={item.time_epoch}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
