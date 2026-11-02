import { useEffect, useState } from "react";
import {
  Sun,
  CloudSun,
  CloudRain,
  Snowflake,
  Moon,
  Clock3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import "./WeatherSystem.css";

const STORAGE_KEY = "pocketpet_weather_v1";

const weatherOptions = [
  { id: "sunny", name: "Sunny", Icon: Sun },
  { id: "cloudy", name: "Cloudy", Icon: CloudSun },
  { id: "rainy", name: "Rainy", Icon: CloudRain },
  { id: "snowy", name: "Snowy", Icon: Snowflake }
];

function loadWeather() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return {
      weather: weatherOptions.some(
        (option) => option.id === saved?.weather
      )
        ? saved.weather
        : "sunny",
      lighting: ["auto", "day", "night"].includes(saved?.lighting)
        ? saved.lighting
        : "auto"
    };
  } catch {
    return {
      weather: "sunny",
      lighting: "auto"
    };
  }
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "day" : "night";
}

export default function WeatherSystem({ children, petName = "Your pet" }) {
  const [settings, setSettings] = useState(loadWeather);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  const lighting =
    settings.lighting === "auto"
      ? timeOfDay
      : settings.lighting;

  const currentWeather = weatherOptions.find(
    (option) => option.id === settings.weather
  );

  const CurrentIcon = currentWeather.Icon;

  const description =
    lighting === "night"
      ? `${petName} is enjoying a cozy evening.`
      : settings.weather === "rainy"
      ? `${petName} can listen to the gentle rain.`
      : settings.weather === "snowy"
      ? `${petName} is watching the snowflakes fall.`
      : settings.weather === "cloudy"
      ? `${petName} is having a peaceful cloudy day.`
      : `${petName} is enjoying the sunshine!`;

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));
  }

  return (
    <section className="weather-system">
      <div className="weather-toolbar">
        <div className="weather-toolbar-info">
          <div className="weather-current-icon">
            {lighting === "night" ? (
              <Moon size={21} />
            ) : (
              <CurrentIcon size={21} />
            )}
          </div>

          <div>
            <strong>
              {currentWeather.name} · {lighting === "night" ? "Night" : "Day"}
            </strong>
            <span>{description}</span>
          </div>
        </div>

        <button
          type="button"
          className="weather-expand-button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          Atmosphere
          {expanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
      </div>

      {expanded && (
        <div className="weather-settings">
          <div className="weather-setting-group">
            <span className="weather-setting-label">WEATHER</span>

            <div className="weather-option-row">
              {weatherOptions.map(({ id, name, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`weather-option ${
                    settings.weather === id ? "active" : ""
                  }`}
                  onClick={() => updateSetting("weather", id)}
                  aria-pressed={settings.weather === id}
                >
                  <Icon size={18} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="weather-setting-group">
            <span className="weather-setting-label">LIGHTING</span>

            <div className="weather-option-row">
              <button
                type="button"
                className={`weather-option ${
                  settings.lighting === "auto" ? "active" : ""
                }`}
                onClick={() => updateSetting("lighting", "auto")}
                aria-pressed={settings.lighting === "auto"}
              >
                <Clock3 size={18} />
                Auto
              </button>

              <button
                type="button"
                className={`weather-option ${
                  settings.lighting === "day" ? "active" : ""
                }`}
                onClick={() => updateSetting("lighting", "day")}
                aria-pressed={settings.lighting === "day"}
              >
                <Sun size={18} />
                Day
              </button>

              <button
                type="button"
                className={`weather-option ${
                  settings.lighting === "night" ? "active" : ""
                }`}
                onClick={() => updateSetting("lighting", "night")}
                aria-pressed={settings.lighting === "night"}
              >
                <Moon size={18} />
                Night
              </button>
            </div>
          </div>

          <p className="weather-auto-note">
            Auto follows your computer's local time.
            Daytime is 7 AM to 7 PM.
          </p>
        </div>
      )}

      <div
        className={`weather-scene weather-${settings.weather} weather-${lighting}`}
      >
        <div className="weather-scene-content">
          {children}
        </div>

        <div className="weather-atmosphere" aria-hidden="true">
          {settings.weather === "sunny" && lighting === "day" && (
            <div className="weather-sun">
              <Sun size={49} strokeWidth={1.5} />
            </div>
          )}

          {settings.weather === "cloudy" && (
            <>
              <div className="weather-cloud weather-cloud-one" />
              <div className="weather-cloud weather-cloud-two" />
            </>
          )}

          {settings.weather === "rainy" && (
            <div className="weather-particles">
              {Array.from({ length: 24 }, (_, index) => (
                <span
                  key={index}
                  className="weather-raindrop"
                  style={{
                    "--particle-index": index,
                    "--particle-left": `${(index * 37) % 100}%`,
                    "--particle-delay": `${(index % 9) * -0.23}s`,
                    "--particle-duration": `${1.05 + (index % 5) * 0.18}s`
                  }}
                />
              ))}
            </div>
          )}

          {settings.weather === "snowy" && (
            <div className="weather-particles">
              {Array.from({ length: 23 }, (_, index) => (
                <span
                  key={index}
                  className="weather-snowflake"
                  style={{
                    "--particle-index": index,
                    "--particle-left": `${(index * 43) % 100}%`,
                    "--particle-delay": `${(index % 9) * -0.7}s`,
                    "--particle-duration": `${4 + (index % 6) * 0.6}s`
                  }}
                />
              ))}
            </div>
          )}

          {lighting === "night" && (
            <div className="weather-night-sky">
              <Moon className="weather-moon" size={36} />
              {Array.from({ length: 12 }, (_, index) => (
                <span
                  key={index}
                  className="weather-star"
                  style={{
                    left: `${(index * 31 + 7) % 94}%`,
                    top: `${(index * 17 + 6) % 46}%`,
                    animationDelay: `${index * 0.24}s`
                  }}
                >
                  ✦
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
