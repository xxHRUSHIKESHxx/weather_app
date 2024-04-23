import React , {useState , useEffect} from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};
const defaults = {
  color: "white",
  size: 112,
  animate: true,
};
const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    main: undefined,
    icon: "CLEAR_DAY",
  });

  useEffect(() => {
    const getPosition = (options) => {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    const getWeather = async (lat, lon) => {
      try {
        const api_call = await fetch(
          `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
        );
        const data = await api_call.json();

        setWeatherData((prevData) => ({
          ...prevData,
          lat: lat,
          lon: lon,
          city: data.name,
          temperatureC: Math.round(data.main.temp),
          temperatureF: Math.round(data.main.temp * 1.8 + 32),
          humidity: data.main.humidity,
          main: data.weather[0].main,
          country: data.sys.country,
        }));

        switch (weatherData.main) {
          case "Haze":
            setWeatherData((prevData) => ({ ...prevData, icon: "CLEAR_DAY" }));
            break;
          case "Clouds":
            setWeatherData((prevData) => ({ ...prevData, icon: "CLOUDY" }));
            break;
          case "Rain":
            setWeatherData((prevData) => ({ ...prevData, icon: "RAIN" }));
            break;
          case "Snow":
            setWeatherData((prevData) => ({ ...prevData, icon: "SNOW" }));
            break;
          case "Dust":
            setWeatherData((prevData) => ({ ...prevData, icon: "WIND" }));
            break;
          case "Drizzle":
            setWeatherData((prevData) => ({ ...prevData, icon: "SLEET" }));
            break;
          case "Fog":
          case "Smoke":
            setWeatherData((prevData) => ({ ...prevData, icon: "FOG" }));
            break;
          case "Tornado":
            setWeatherData((prevData) => ({ ...prevData, icon: "WIND" }));
            break;
          default:
            setWeatherData((prevData) => ({ ...prevData, icon: "CLEAR_DAY" }));
        }
      } catch (error) {
        console.error("Error fetching weather data: ", error);
        setWeatherData((prevData) => ({ ...prevData, errorMsg: error.message }));
      }
    };

    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    const timerID = setInterval(() => {
      getWeather(weatherData.lat, weatherData.lon);
    }, 600000);

    return () => clearInterval(timerID);
  }, []); // empty dependency array means this effect runs once after the initial render

  const dateBuilder = (d) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <React.Fragment>
      {weatherData.temperatureC ? (
        <div className="city">
          <div className="title">
            <h2>{weatherData.city}</h2>
            <h3>{weatherData.country}</h3>
          </div>
          <div className="mb-icon">
            {" "}
            <ReactAnimatedWeather
              icon={weatherData.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{weatherData.main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
            <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div id="txt"></div>

              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {weatherData.temperatureC}°<span>C</span>
              </p>
              {/* <span className="slash">/</span>
              {weatherData.temperatureF} &deg;F */}
            </div>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location wil be displayed on the App <br></br> & used for calculating Real time weather.
          </h3>
        </React.Fragment>
      )}
      {weatherData.temperatureC && <Forcast icon={weatherData.icon} weather={weatherData.main} />}
    </React.Fragment>
  );
};


export default Weather;
