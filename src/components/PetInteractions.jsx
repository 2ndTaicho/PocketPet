import { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import "./PetInteractions.css";

const thoughts = {
  cat: [
    "A little nap sounds lovely...",
    "Is that a butterfly?",
    "I wonder what's in that box!",
    "You're my favorite human."
  ],
  dog: [
    "Can we play again?",
    "You're my best friend!",
    "Everything is an adventure!",
    "I love this cozy home!"
  ],
  bunny: [
    "Such a lovely day...",
    "Do you have a little treat?",
    "I feel so cozy here.",
    "Happy little hops!"
  ]
};

export default function PetInteractions({
  pet,
  mood,
  reaction,
  onPet,
  children
}) {
  const [bubble, setBubble] = useState("");
  const [hearts, setHearts] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!pet) return;

    const messages = thoughts[pet.type] || thoughts.cat;
    setBubble(messages[Math.floor(Math.random() * messages.length)]);

    const interval = window.setInterval(() => {
      setBubble(messages[Math.floor(Math.random() * messages.length)]);
    }, 12000);

    return () => window.clearInterval(interval);
  }, [pet?.id, pet?.type]);

  useEffect(() => {
    if (!reaction?.id) return;

    if (reaction.text) {
      setBubble(reaction.text);
    }

    setAnimationKey((current) => current + 1);

    if (reaction.kind === "happy" || reaction.kind === "pet") {
      setHearts(
        Array.from({ length: 5 }, (_, index) => ({
          id: `${reaction.id}-${index}`,
          left: 35 + Math.random() * 30,
          delay: index * 0.12
        }))
      );

      const timeout = window.setTimeout(() => {
        setHearts([]);
      }, 1800);

      return () => window.clearTimeout(timeout);
    }
  }, [reaction]);

  function handlePet() {
    onPet?.();
  }

  return (
    <div className="pet-interaction-scene">
      {children}

      <div
        key={`${pet?.id}-${animationKey}`}
        className={`pet-reaction-motion ${
          reaction?.kind === "happy" || reaction?.kind === "pet"
            ? "is-happy"
            : reaction?.kind === "sleep"
            ? "is-sleepy"
            : ""
        }`}
        aria-hidden="true"
      >
        {reaction?.kind === "happy" && (
          <Sparkles size={26} />
        )}
      </div>

      {bubble && (
        <div className="pet-thought-bubble">
          <Heart size={14} />
          <span>{bubble}</span>
        </div>
      )}

      <div className="pet-floating-hearts" aria-hidden="true">
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            className="pet-floating-heart"
            size={20}
            fill="currentColor"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`
            }}
          />
        ))}
      </div>

      <button
        className="pet-petting-target"
        type="button"
        onClick={handlePet}
        aria-label={`Pet ${pet?.name || "your pet"}`}
        title={`Give ${pet?.name || "your pet"} some love`}
      >
        <span className="pet-petting-label">
          <Heart size={14} />
          Pet me!
        </span>
      </button>
    </div>
  );
}
