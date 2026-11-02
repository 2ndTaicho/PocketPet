import { CalendarDays, Check, Coins, Gift, Sparkles } from "lucide-react";
import "./DailyRewards.css";

export const dailyPrizes = [10, 15, 20, 25, 30, 40, 75];

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDailyStatus(rewards, today = localDateKey()) {
  const lastClaim = rewards?.lastClaim || null;
  const streak = rewards?.streak || 0;

  if (lastClaim === today) {
    return { canClaim: false, streak, nextDay: streak % 7 };
  }

  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);

  const consecutive = lastClaim === localDateKey(yesterday);
  const nextStreak = consecutive ? streak + 1 : 1;

  return {
    canClaim: true,
    streak,
    nextStreak,
    nextDay: (nextStreak - 1) % 7
  };
}

export default function DailyRewards({ rewards, onClaim }) {
  const today = localDateKey();
  const status = getDailyStatus(rewards, today);
  const currentDay = status.canClaim
    ? status.nextDay
    : (status.streak - 1) % 7;

  return (
    <section className="daily-card">
      <div className="daily-title">
        <Gift size={21} />
        <div>
          <span>THE DAILY GIFT BOX</span>
          <h3>A Little Present</h3>
        </div>
      </div>

      <p className="daily-description">
        Visit each day to collect coins for your little family.
        Seven days of gifts unlocks a special bonus!
      </p>

      <div className="daily-streak">
        <CalendarDays size={17} />
        <strong>{status.streak} day streak</strong>
        <span>{status.canClaim ? "Gift ready!" : "Claimed today"}</span>
      </div>

      <div className="daily-prize-grid">
        {dailyPrizes.map((amount, index) => {
          const isCurrent = index === currentDay;
          const isClaimed = !status.canClaim && isCurrent;

          return (
            <div
              key={index}
              className={`daily-prize ${isCurrent ? "current" : ""}`}
            >
              <span>DAY {index + 1}</span>
              {index === 6
                ? <Sparkles size={22} />
                : <Coins size={21} />}
              <strong>{amount}</strong>
              {isClaimed && <Check size={13} className="daily-check" />}
            </div>
          );
        })}
      </div>

      <button
        className="daily-claim-button"
        type="button"
        disabled={!status.canClaim}
        onClick={onClaim}
      >
        {status.canClaim
          ? <Gift size={19} />
          : <Check size={19} />}
        {status.canClaim
          ? `Claim ${dailyPrizes[status.nextDay]} coins`
          : "Today's gift collected"}
      </button>

      <p className="daily-footnote">
        Gifts reset at midnight on your device. Missing a day
        starts a new streak, but you keep your coins.
      </p>
    </section>
  );
}
