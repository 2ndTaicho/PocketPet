import {
  Star,
  Trophy,
  Heart,
  Gamepad2,
  Coins,
  Sparkles,
  Bath,
  Gift
} from "lucide-react";
import "./PetProgress.css";

export const XP_PER_LEVEL = 50;

export const achievements = [
  {
    id: "firstSteps",
    name: "First Steps",
    description: "Complete your first care activity",
    icon: Heart
  },
  {
    id: "playful",
    name: "Playful Pal",
    description: "Finish 5 mini-games",
    icon: Gamepad2
  },
  {
    id: "collector",
    name: "Little Collector",
    description: "Earn 100 coins from mini-games",
    icon: Coins
  },
  {
    id: "sparkling",
    name: "Sparkling Clean",
    description: "Take 5 baths",
    icon: Bath
  },
  {
    id: "growing",
    name: "Growing Up",
    description: "Reach Level 5",
    icon: Star
  },
  {
    id: "superstar",
    name: "Superstar",
    description: "Reach Level 10",
    icon: Trophy
  }
];

export function getLevelProgress(pet) {
  const level = Math.max(1, pet.level || 1);
  const xp = Math.max(0, pet.xp || 0);

  return {
    level,
    xp,
    required: XP_PER_LEVEL,
    percent: Math.min(100, (xp / XP_PER_LEVEL) * 100)
  };
}

export function getUnlockedAchievements(pet) {
  const stats = pet.progressStats || {};

  return {
    firstSteps: (pet.actions || 0) >= 1,
    playful: (stats.games || 0) >= 5,
    collector: (stats.gameCoins || 0) >= 100,
    sparkling: (stats.baths || 0) >= 5,
    growing: (pet.level || 1) >= 5,
    superstar: (pet.level || 1) >= 10
  };
}

export default function PetProgress({ pet }) {
  const progress = getLevelProgress(pet);
  const unlocked = getUnlockedAchievements(pet);
  const count = achievements.filter(
    (item) => unlocked[item.id]
  ).length;

  return (
    <div className="pet-progress">
      <div className="progress-title">
        <Star size={19} />
        <span>Growing Together</span>
      </div>

      <div className="level-heading">
        <div className="level-medallion">
          <Sparkles size={17} />
          <strong>{progress.level}</strong>
        </div>

        <div className="level-description">
          <span>LEVEL {progress.level}</span>
          <h3>
            {progress.level >= 10
              ? "Little Superstar"
              : progress.level >= 5
              ? "Growing Sweetheart"
              : "Tiny Companion"}
          </h3>
        </div>
      </div>

      <div className="xp-labels">
        <span>Experience points</span>
        <strong>
          {progress.xp} / {progress.required} XP
        </strong>
      </div>

      <div
        className="xp-track"
        role="progressbar"
        aria-label="Experience points"
        aria-valuenow={progress.xp}
        aria-valuemin={0}
        aria-valuemax={progress.required}
      >
        <div
          className="xp-fill"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <p className="xp-hint">
        <Gift size={15} />
        Earn 20 bonus coins every time you level up!
      </p>

      <div className="achievement-heading">
        <Trophy size={18} />
        <strong>Little Achievements</strong>
        <span>{count} / {achievements.length}</span>
      </div>

      <div className="achievement-grid">
        {achievements.map((item) => {
          const Icon = item.icon;
          const isUnlocked = unlocked[item.id];

          return (
            <div
              key={item.id}
              className={`achievement-item ${
                isUnlocked ? "unlocked" : "locked"
              }`}
              title={item.description}
            >
              <div className="achievement-icon">
                <Icon size={20} />
              </div>
              <strong>{item.name}</strong>
              <small>
                {isUnlocked
                  ? "Unlocked!"
                  : item.description}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
