import { useState } from "react";
import {
  ArrowLeft,
  HeartPulse,
  Stethoscope,
  Cookie,
  Sparkles,
  Coins,
  CheckCircle2,
  AlertCircle,
  Heart,
  ClipboardList
} from "lucide-react";
import "./PetWellness.css";

const careStats = [
  { key: "hunger", name: "Fullness", icon: "♡" },
  { key: "happiness", name: "Happiness", icon: "✿" },
  { key: "energy", name: "Energy", icon: "☾" },
  { key: "cleanliness", name: "Cleanliness", icon: "✧" }
];

export const wellnessTreats = [
  {
    id: "berry",
    name: "Berry Biscuit",
    description: "A sweet snack for a hungry friend.",
    price: 8,
    hunger: 20,
    happiness: 5,
    energy: 0,
    cleanliness: 0,
    icon: "🍓"
  },
  {
    id: "cloud",
    name: "Cloud Cookie",
    description: "A fluffy treat to brighten their day.",
    price: 12,
    hunger: 10,
    happiness: 18,
    energy: 0,
    cleanliness: 0,
    icon: "🍪"
  },
  {
    id: "star",
    name: "Starry Snack",
    description: "A magical little energy boost.",
    price: 15,
    hunger: 10,
    happiness: 5,
    energy: 20,
    cleanliness: 0,
    icon: "⭐"
  }
];

export function getWellnessScore(pet) {
  if (!pet) return 0;

  const values = [
    pet.hunger ?? 70,
    pet.happiness ?? 75,
    pet.energy ?? 80,
    pet.cleanliness ?? 80
  ];

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length
  );
}

function getWellnessStatus(score) {
  if (score >= 85) {
    return {
      title: "Feeling wonderful!",
      description: "Your little companion is doing amazing. Keep up the love!",
      color: "great"
    };
  }

  if (score >= 65) {
    return {
      title: "Doing pretty well!",
      description: "A little extra care will make today even sweeter.",
      color: "good"
    };
  }

  if (score >= 40) {
    return {
      title: "Needs some attention",
      description: "Your pet could use a few cozy moments together.",
      color: "okay"
    };
  }

  return {
    title: "Time for extra love",
    description: "Your little friend needs some care and attention.",
    color: "low"
  };
}

export default function PetWellness({
  pet,
  onTreat,
  onClose
}) {
  const [showReport, setShowReport] = useState(false);

  if (!pet) return null;

  const score = getWellnessScore(pet);
  const status = getWellnessStatus(score);

  const recommendations = careStats
    .filter((stat) => (pet[stat.key] ?? 80) < 65)
    .map((stat) => {
      if (stat.key === "hunger") {
        return "A tasty meal would help with fullness.";
      }

      if (stat.key === "happiness") {
        return "Play a mini-game or give your pet some cuddles.";
      }

      if (stat.key === "energy") {
        return "A cozy nap would help restore energy.";
      }

      return "A relaxing bath would make your pet feel fresh.";
    });

  return (
    <main className="wellness-page">
      <button
        className="wellness-back"
        onClick={onClose}
        type="button"
      >
        <ArrowLeft size={18} />
        Back to my pet
      </button>

      <section className="wellness-hero">
        <div className="wellness-hero-content">
          <span className="wellness-eyebrow">
            ✿ THE LITTLE WELLNESS CLUB ✿
          </span>

          <div className="wellness-hero-icon">
            <HeartPulse size={34} strokeWidth={1.6} />
          </div>

          <h2>{pet.name}'s Wellness Center</h2>
          <p>
            A cozy place to check on your little friend
            and give them some extra love.
          </p>
        </div>
      </section>

      <div className="wellness-grid">
        <section className="wellness-card wellness-score-card">
          <div className="wellness-card-heading">
            <HeartPulse size={19} />
            <span>Health & Happiness</span>
          </div>

          <div
            className={`wellness-score-circle wellness-${status.color}`}
            style={{ "--score": `${score}%` }}
          >
            <div className="wellness-score-inner">
              <strong>{score}%</strong>
              <span>WELLNESS</span>
            </div>
          </div>

          <h3>{status.title}</h3>
          <p>{status.description}</p>

          <button
            className="wellness-report-button"
            onClick={() => setShowReport((value) => !value)}
            type="button"
          >
            <ClipboardList size={17} />
            {showReport ? "Hide care report" : "View care report"}
          </button>
        </section>

        <section className="wellness-card wellness-checkup-card">
          <div className="wellness-card-heading">
            <Stethoscope size={19} />
            <span>Little Checkup</span>
          </div>

          <h3>How is {pet.name} feeling?</h3>

          <div className="wellness-stat-list">
            {careStats.map((stat) => {
              const value = pet[stat.key] ?? 80;

              return (
                <div className="wellness-stat" key={stat.key}>
                  <div className="wellness-stat-top">
                    <span>
                      <span className="wellness-stat-symbol">
                        {stat.icon}
                      </span>
                      {stat.name}
                    </span>
                    <strong>{value}%</strong>
                  </div>

                  <div className="wellness-stat-track">
                    <div
                      className="wellness-stat-fill"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wellness-tip">
            {recommendations.length === 0 ? (
              <>
                <CheckCircle2 size={19} />
                <span>
                  Everything looks lovely! Your pet is well cared for.
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={19} />
                <span>{recommendations[0]}</span>
              </>
            )}
          </div>
        </section>
      </div>

      {showReport && (
        <section className="wellness-report">
          <div className="wellness-card-heading">
            <ClipboardList size={19} />
            <span>Personal Care Report</span>
          </div>

          <h3>{pet.name}'s Care Notes</h3>

          {recommendations.length === 0 ? (
            <p>
              All four care stats are in a comfortable range.
              Keep feeding, playing, resting, and bathing regularly!
            </p>
          ) : (
            <ul>
              {recommendations.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}

          <p className="wellness-report-footnote">
            This is a playful in-game wellness score based on your
            pet's four care stats.
          </p>
        </section>
      )}

      <section className="wellness-treat-section">
        <div className="wellness-section-heading">
          <div>
            <span className="wellness-eyebrow">SOMETHING SWEET</span>
            <h3>Special Treats</h3>
            <p>
              Little snacks to make {pet.name}'s day brighter.
            </p>
          </div>

          <div className="wellness-wallet">
            <Coins size={18} />
            <strong>{pet.coins}</strong>
            <span>coins</span>
          </div>
        </div>

        <div className="wellness-treat-grid">
          {wellnessTreats.map((treat) => (
            <article className="wellness-treat" key={treat.id}>
              <div className="wellness-treat-icon">
                {treat.icon}
              </div>

              <h4>{treat.name}</h4>
              <p>{treat.description}</p>

              <div className="wellness-treat-benefits">
                {treat.hunger > 0 && (
                  <span>+{treat.hunger} fullness</span>
                )}

                {treat.happiness > 0 && (
                  <span>+{treat.happiness} happy</span>
                )}

                {treat.energy > 0 && (
                  <span>+{treat.energy} energy</span>
                )}
              </div>

              <button
                type="button"
                disabled={pet.coins < treat.price}
                onClick={() => onTreat?.(treat)}
              >
                <Cookie size={16} />
                {pet.coins < treat.price
                  ? "Not enough coins"
                  : `Give treat · ${treat.price} coins`}
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="wellness-footer-note">
        <Heart size={15} fill="currentColor" />
        <span>A happy little pet is a loved little pet.</span>
        <Sparkles size={15} />
      </div>
    </main>
  );
}
