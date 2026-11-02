import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Music2
} from "lucide-react";
import "./GameSettings.css";

export default function GameSettings({
  settings,
  onChange,
  onPreview,
  onClose
}) {
  return (
    <main className="pp-settings-page">
      <button
        type="button"
        className="pp-settings-back"
        onClick={onClose}
      >
        <ArrowLeft size={18} />
        Back to cottage
      </button>

      <div className="pp-settings-heading">
        <span>✿ YOUR COZY CORNER ✿</span>
        <h2>Game Settings</h2>
        <p>Make Pocket Pet feel just right for you.</p>
      </div>

      <section className="pp-settings-card">
        <div className="pp-settings-row">
          <div className="pp-settings-icon">
            <Volume2 size={23} />
          </div>

          <div className="pp-settings-copy">
            <strong>Sound effects</strong>
            <p>
              Play little chimes when caring for your pets.
            </p>
          </div>

          <label className="pp-settings-switch">
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(event) =>
                onChange("sound", event.target.checked)
              }
            />
            <span />
          </label>
        </div>

        <div className="pp-settings-volume">
          <label htmlFor="pp-volume">
            Volume
            <strong>{settings.volume}%</strong>
          </label>

          <input
            id="pp-volume"
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.volume}
            disabled={!settings.sound}
            onChange={(event) =>
              onChange("volume", Number(event.target.value))
            }
          />

          <button
            type="button"
            onClick={onPreview}
            disabled={
              !settings.sound || settings.volume === 0
            }
          >
            {settings.sound ? (
              <Music2 size={17} />
            ) : (
              <VolumeX size={17} />
            )}
            Test sound
          </button>
        </div>
      </section>

      <section className="pp-settings-card">
        <div className="pp-settings-row">
          <div className="pp-settings-icon">
            <Sparkles size={23} />
          </div>

          <div className="pp-settings-copy">
            <strong>Reduce animations</strong>
            <p>
              Make motion and transitions more gentle.
            </p>
          </div>

          <label className="pp-settings-switch">
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) =>
                onChange(
                  "reduceMotion",
                  event.target.checked
                )
              }
            />
            <span />
          </label>
        </div>
      </section>

      <p className="pp-settings-footnote">
        Your settings are saved automatically on this device.
        Your pets and progress are not affected.
      </p>
    </main>
  );
}
