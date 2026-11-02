import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Play,
  RotateCcw,
  Coins,
  Clock3,
  Trophy,
  Star,
  Grid2X2,
  Gamepad2,
  Check
} from "lucide-react";
import "./MiniGame.css";
import "./MiniGamePhase13.css";

const GAME_LENGTH = 20;
const MAX_COINS = 30;

const games = [
  {
    id: "hearts",
    title: "Catch the Hearts",
    subtitle: "Collect floating hearts before time runs out.",
    Icon: Heart,
    color: "pink"
  },
  {
    id: "memory",
    title: "Memory Match",
    subtitle: "Find six matching pairs of cozy pictures.",
    Icon: Grid2X2,
    color: "lavender"
  },
  {
    id: "stars",
    title: "Star Catcher",
    subtitle: "Catch the falling stars before they disappear.",
    Icon: Star,
    color: "blue"
  }
];

const memorySymbols = ["✿", "♡", "★", "☾", "❀", "✦"];

function randomItem() {
  return {
    id: crypto.randomUUID(),
    x: 10 + Math.random() * 80,
    y: 12 + Math.random() * 72,
    size: 34 + Math.random() * 20,
    rotation: -20 + Math.random() * 40
  };
}

function makeMemoryCards() {
  return [...memorySymbols, ...memorySymbols]
    .map((symbol) => ({
      id: crypto.randomUUID(),
      symbol
    }))
    .sort(() => Math.random() - 0.5);
}

function makeStar() {
  return {
    id: crypto.randomUUID(),
    x: 8 + Math.random() * 84,
    duration: 2.5 + Math.random() * 1.5
  };
}

export default function MiniGame({
  petName = "Mochi",
  onClose,
  onFinish
}) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [phase, setPhase] = useState("ready");
  const [seconds, setSeconds] = useState(GAME_LENGTH);
  const [score, setScore] = useState(0);
  const [reward, setReward] = useState(0);
  const [heart, setHeart] = useState(null);
  const [stars, setStars] = useState([]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);

  const scoreRef = useRef(0);
  const completedRef = useRef(false);
  const matchTimeoutRef = useRef(null);

  const currentGame = games.find(
    (game) => game.id === selectedGame
  );

  const isTimedGame =
    selectedGame === "hearts" || selectedGame === "stars";

  const potentialCoins =
    selectedGame === "memory"
      ? Math.min(MAX_COINS, matched.length * 5)
      : Math.min(MAX_COINS, score * 2);

  function clearMatchTimeout() {
    if (matchTimeoutRef.current !== null) {
      window.clearTimeout(matchTimeoutRef.current);
      matchTimeoutRef.current = null;
    }
  }

  function resetRound() {
    clearMatchTimeout();
    scoreRef.current = 0;
    completedRef.current = false;

    setPhase("ready");
    setSeconds(GAME_LENGTH);
    setScore(0);
    setReward(0);
    setHeart(null);
    setStars([]);
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setLocked(false);
  }

  function chooseGame(id) {
    resetRound();
    setSelectedGame(id);
  }

  function returnToArcade() {
    resetRound();
    setSelectedGame(null);
  }

  function startGame() {
    clearMatchTimeout();

    scoreRef.current = 0;
    completedRef.current = false;

    setScore(0);
    setReward(0);
    setSeconds(GAME_LENGTH);
    setFlipped([]);
    setMatched([]);
    setLocked(false);
    setStars([]);

    if (selectedGame === "hearts") {
      setHeart(randomItem());
    } else {
      setHeart(null);
    }

    if (selectedGame === "memory") {
      setCards(makeMemoryCards());
    } else {
      setCards([]);
    }

    setPhase("playing");
  }

  function finishGame(finalScore) {
    if (completedRef.current) return;

    completedRef.current = true;

    const earnedCoins =
      selectedGame === "memory"
        ? Math.min(MAX_COINS, finalScore * 5)
        : Math.min(MAX_COINS, finalScore * 2);

    setReward(earnedCoins);
    setScore(finalScore);
    setHeart(null);
    setStars([]);
    setPhase("finished");

    onFinish?.(earnedCoins, finalScore);
  }

  function catchHeart() {
    if (phase !== "playing" || selectedGame !== "hearts") {
      return;
    }

    scoreRef.current += 1;
    setScore(scoreRef.current);
    setHeart(randomItem());
  }

  function catchStar(id) {
    if (phase !== "playing" || selectedGame !== "stars") {
      return;
    }

    if (!stars.some((star) => star.id === id)) return;

    scoreRef.current += 1;
    setScore(scoreRef.current);

    setStars((current) =>
      current.filter((star) => star.id !== id)
    );
  }

  function flipCard(index) {
    if (
      phase !== "playing" ||
      selectedGame !== "memory" ||
      locked ||
      flipped.includes(index) ||
      matched.includes(index)
    ) {
      return;
    }

    if (flipped.length === 0) {
      setFlipped([index]);
      return;
    }

    const firstIndex = flipped[0];
    const firstCard = cards[firstIndex];
    const secondCard = cards[index];

    if (!firstCard || !secondCard) return;

    setFlipped([firstIndex, index]);
    setLocked(true);

    if (firstCard.symbol === secondCard.symbol) {
      const nextMatched = [...matched, firstIndex, index];
      const pairs = nextMatched.length / 2;

      setMatched(nextMatched);
      setScore(pairs);

      matchTimeoutRef.current = window.setTimeout(() => {
        setFlipped([]);
        setLocked(false);
        matchTimeoutRef.current = null;

        if (nextMatched.length === cards.length) {
          finishGame(pairs);
        }
      }, 450);
    } else {
      matchTimeoutRef.current = window.setTimeout(() => {
        setFlipped([]);
        setLocked(false);
        matchTimeoutRef.current = null;
      }, 850);
    }
  }

  useEffect(() => {
    if (phase !== "playing" || !isTimedGame) return;

    const timer = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, isTimedGame]);

  useEffect(() => {
    if (
      phase !== "playing" ||
      selectedGame !== "stars"
    ) {
      return;
    }

    const spawn = window.setInterval(() => {
      const nextStar = makeStar();

      setStars((current) => [
        ...current.slice(-7),
        nextStar
      ]);
    }, 650);

    return () => window.clearInterval(spawn);
  }, [phase, selectedGame]);

  useEffect(() => {
    if (
      phase !== "playing" ||
      !isTimedGame ||
      seconds > 0
    ) {
      return;
    }

    finishGame(scoreRef.current);
  }, [phase, seconds, isTimedGame]);

  useEffect(() => {
    return () => clearMatchTimeout();
  }, []);

  return (
    <main className="mini-game-page arcade-page">
      <div className="mini-game-heading">
        <button
          className="mini-back-button"
          onClick={onClose}
          type="button"
        >
          <ArrowLeft size={18} />
          Back to cottage
        </button>

        <span className="mini-eyebrow">
          ✿ THE LITTLE ARCADE ✿
        </span>

        <h2>
          {currentGame
            ? currentGame.title
            : "A Little Fun Together"}
        </h2>

        <p>
          {currentGame
            ? `Let's play with ${petName}!`
            : `Pick a game to play with ${petName}.`}
        </p>
      </div>

      {!selectedGame ? (
        <div className="arcade-selection">
          <div className="arcade-welcome">
            <Gamepad2 size={28} />
            <h3>Welcome to the arcade!</h3>
            <p>
              Three cozy games, lots of fun,
              and sweet rewards for your pet.
            </p>
          </div>

          <div className="arcade-game-grid">
            {games.map(({ id, title, subtitle, Icon, color }) => (
              <button
                key={id}
                type="button"
                className={`arcade-game-card arcade-${color}`}
                onClick={() => chooseGame(id)}
              >
                <span className="arcade-game-icon">
                  <Icon size={38} strokeWidth={1.7} />
                </span>

                <strong>{title}</strong>
                <span>{subtitle}</span>

                <span className="arcade-card-play">
                  <Play size={15} />
                  Choose game
                </span>
              </button>
            ))}
          </div>

          <div className="arcade-reward-banner">
            <Coins size={19} />
            Earn up to 30 coins and 15 XP per completed game!
          </div>
        </div>
      ) : (
        <>
          <button
            className="arcade-change-game"
            type="button"
            onClick={returnToArcade}
          >
            <ArrowLeft size={16} />
            Choose another game
          </button>

          <div className="mini-scoreboard">
            <div className="mini-score-item">
              {selectedGame === "hearts" ? (
                <Heart size={19} />
              ) : selectedGame === "stars" ? (
                <Star size={19} />
              ) : (
                <Grid2X2 size={19} />
              )}

              <span>
                {selectedGame === "memory" ? "Pairs" : "Score"}
              </span>

              <strong>
                {score}
                {selectedGame === "memory" ? "/6" : ""}
              </strong>
            </div>

            <div className="mini-score-item">
              <Clock3 size={19} />
              <span>
                {selectedGame === "memory" ? "Mode" : "Time"}
              </span>
              <strong>
                {selectedGame === "memory"
                  ? "Relaxed"
                  : `${seconds}s`}
              </strong>
            </div>

            <div className="mini-score-item">
              <Coins size={19} />
              <span>Potential coins</span>
              <strong>{potentialCoins}</strong>
            </div>
          </div>

          <div className="mini-game-board arcade-board">
            <div className="mini-board-cloud mini-cloud-one" />
            <div className="mini-board-cloud mini-cloud-two" />

            <span className="mini-board-sparkle mini-sparkle-one">
              ✦
            </span>
            <span className="mini-board-sparkle mini-sparkle-two">
              ✧
            </span>
            <span className="mini-board-sparkle mini-sparkle-three">
              ✦
            </span>

            {phase === "ready" && (
              <div className="mini-overlay arcade-overlay">
                <div className="mini-overlay-icon">
                  {currentGame && (
                    <currentGame.Icon size={43} />
                  )}
                </div>

                <h3>Ready to play?</h3>

                <p>
                  {selectedGame === "hearts"
                    ? "Catch as many hearts as you can in 20 seconds. Each heart earns 2 coins!"
                    : selectedGame === "stars"
                    ? "Catch falling stars before they disappear. You have 20 seconds!"
                    : "Flip the cards and find all six matching pairs. Take your time!"}
                </p>

                <button
                  className="mini-primary-button"
                  type="button"
                  onClick={startGame}
                >
                  <Play size={18} fill="currentColor" />
                  Start Game
                </button>
              </div>
            )}

            {phase === "playing" &&
              selectedGame === "hearts" &&
              heart && (
                <button
                  key={heart.id}
                  className="mini-floating-heart"
                  type="button"
                  aria-label="Catch heart"
                  style={{
                    left: `${heart.x}%`,
                    top: `${heart.y}%`,
                    width: heart.size,
                    height: heart.size,
                    transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`
                  }}
                  onClick={catchHeart}
                >
                  <Heart
                    size={heart.size}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                </button>
              )}

            {phase === "playing" &&
              selectedGame === "stars" && (
                <div className="arcade-star-field">
                  {stars.map((star) => (
                    <button
                      key={star.id}
                      className="arcade-falling-star"
                      type="button"
                      aria-label="Catch star"
                      style={{
                        left: `${star.x}%`,
                        animationDuration: `${star.duration}s`
                      }}
                      onAnimationEnd={() => {
                        setStars((current) =>
                          current.filter(
                            (item) => item.id !== star.id
                          )
                        );
                      }}
                      onClick={() => catchStar(star.id)}
                    >
                      <Star
                        size={35}
                        fill="currentColor"
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              )}

            {phase === "playing" &&
              selectedGame === "memory" && (
                <div className="arcade-memory-wrap">
                  <div className="arcade-memory-grid">
                    {cards.map((card, index) => {
                      const isMatched = matched.includes(index);
                      const isVisible =
                        isMatched || flipped.includes(index);

                      return (
                        <button
                          key={card.id}
                          type="button"
                          className={`arcade-memory-card ${
                            isVisible ? "revealed" : ""
                          } ${isMatched ? "matched" : ""}`}
                          onClick={() => flipCard(index)}
                          disabled={isMatched || locked}
                          aria-label={
                            isVisible
                              ? `Card ${index + 1}: ${card.symbol}`
                              : `Flip card ${index + 1}`
                          }
                        >
                          {isVisible ? (
                            <>
                              <span>{card.symbol}</span>
                              {isMatched && (
                                <Check
                                  className="arcade-match-check"
                                  size={14}
                                />
                              )}
                            </>
                          ) : (
                            <Heart
                              size={23}
                              strokeWidth={1.5}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {phase === "finished" && (
              <div className="mini-overlay arcade-overlay">
                <div className="mini-overlay-icon">
                  <Trophy size={44} />
                </div>

                <h3>Lovely job!</h3>

                <p>
                  {selectedGame === "memory"
                    ? `You found all ${score} matching pairs!`
                    : `You caught ${score} ${
                        selectedGame === "hearts"
                          ? score === 1 ? "heart" : "hearts"
                          : score === 1 ? "star" : "stars"
                      }!`}
                </p>

                <div className="mini-reward">
                  <Coins size={24} />
                  <strong>+{reward} coins</strong>
                </div>

                <p className="mini-reward-note">
                  {petName} earned 15 XP, too!
                </p>

                <button
                  className="mini-primary-button"
                  onClick={startGame}
                  type="button"
                >
                  <RotateCcw size={18} />
                  Play Again
                </button>

                <button
                  className="mini-secondary-button"
                  onClick={returnToArcade}
                  type="button"
                >
                  Choose another game
                </button>

                <button
                  className="mini-secondary-button"
                  onClick={onClose}
                  type="button"
                >
                  Return to cottage
                </button>
              </div>
            )}
          </div>

          <div className="mini-game-instructions">
            {selectedGame === "hearts" ? (
              <Heart size={18} />
            ) : selectedGame === "stars" ? (
              <Star size={18} />
            ) : (
              <Grid2X2 size={18} />
            )}

            <p>
              {selectedGame === "hearts"
                ? "Click or tap each heart to catch it."
                : selectedGame === "stars"
                ? "Click or tap falling stars before they reach the bottom."
                : "Click two cards to reveal their pictures. Match every pair to win!"}
            </p>
          </div>
        </>
      )}
    </main>
  );
}
