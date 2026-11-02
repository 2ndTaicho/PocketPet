import { useEffect, useState } from "react";
import {
  Heart, Utensils, Gamepad2, Moon, Coins, RotateCcw,
  Plus, PawPrint, ArrowLeft, Check, Pencil, Bath,
  Home, ChefHat, BedDouble, ChevronLeft, ChevronRight,
  ShoppingBag, Sparkles, BookHeart, HeartPulse, Settings2
} from "lucide-react";
import PetIllustration from "./components/PetIllustration";
import RoomScene, { rooms } from "./components/RoomScene";
import PetShop, { shopItems, starterItems } from "./components/PetShop";
import MiniGame from "./components/MiniGame";
import PetProgress, { XP_PER_LEVEL } from "./components/PetProgress";
import DailyRewards, {
  dailyPrizes,
  getDailyStatus,
  localDateKey
} from "./components/DailyRewards";
import PetInteractions from "./components/PetInteractions";
import PetDiary from "./components/PetDiary";
import PetWellness from "./components/PetWellness";
import WeatherSystem from "./components/WeatherSystem";
import GameSettings from "./components/GameSettings";
import { playGameSound } from "./components/gameSound";
import "./App.css";

const SETTINGS_KEY = "pocketpet_settings_v1";
const STORAGE_KEY = "pocketpet_collection_v1";
const DIARY_STORAGE_KEY = "pocketpet_diary_v1";
const OLD_STORAGE_KEY = "pocketpet_save_v1";
const OLD_ACCESSORY_KEY = "pocketpet_accessory_v1";

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    const volume = Number(saved.volume ?? 45);

    return {
      sound: saved.sound !== false,
      volume: Number.isFinite(volume)
        ? Math.max(0, Math.min(100, volume))
        : 45,
      reduceMotion: saved.reduceMotion === true
    };
  } catch {
    return { sound: true, volume: 45, reduceMotion: false };
  }
}

const petTypes = [
  { id: "cat", label: "Kitten", description: "A cuddly little sweetheart" },
  { id: "dog", label: "Puppy", description: "A playful bundle of joy" },
  { id: "bunny", label: "Bunny", description: "A gentle, fluffy friend" }
];

const defaultNames = {
  cat: "Mochi",
  dog: "Biscuit",
  bunny: "Clover"
};

const roomIcons = {
  living: Home,
  kitchen: ChefHat,
  bedroom: BedDouble,
  bathroom: Bath
};

const personalities = {
  cat: {
    name: "Curious Dreamer",
    description: "Loves cozy naps, quiet corners, and discovering little surprises.",
    idle: [
      "is watching the butterflies outside.",
      "is wondering what's inside that box.",
      "wants to curl up somewhere cozy."
    ],
    feed: "purrs happily after a delicious snack!",
    sleep: "is curled up in a tiny fluffy ball.",
    bath: "looks extra fluffy after bath time!",
    play: "had a wonderful time chasing hearts!",
    pet: "purrs softly. More cuddles, please!"
  },
  dog: {
    name: "Playful Sunshine",
    description: "Always excited to play, explore, and make new friends.",
    idle: [
      "is wagging their tail excitedly!",
      "wants to explore the cottage.",
      "is waiting for another adventure!"
    ],
    feed: "is wagging their tail after that yummy meal!",
    sleep: "is dreaming about running through flowers.",
    bath: "is sparkling clean and ready to play!",
    play: "had the best time catching hearts!",
    pet: "wags their tail with excitement!"
  },
  bunny: {
    name: "Gentle Sweetheart",
    description: "Enjoys peaceful days, soft blankets, and little treats.",
    idle: [
      "is twitching their tiny nose.",
      "is looking for a peaceful spot.",
      "is making the cutest little hops."
    ],
    feed: "is happily nibbling their favorite treat!",
    sleep: "is dreaming in a soft little nest.",
    bath: "is looking extra soft and adorable!",
    play: "is doing happy little hops after playing!",
    pet: "does a happy little hop!"
  }
};

function createPet(type, name) {
  return {
    id: crypto.randomUUID(),
    type,
    name: name.trim().slice(0, 20),
    hunger: 70,
    happiness: 75,
    energy: 80,
    cleanliness: 80,
    coins: 50,
    actions: 0,
    accessory: "none",
    room: "living",
    level: 1,
    xp: 0,
    progressStats: {
      games: 0,
      gameCoins: 0,
      baths: 0
    },
    adoptedAt: new Date().toISOString()
  };
}

function normalizePet(pet) {
  return {
    cleanliness: 80,
    room: "living",
    accessory: "none",
    level: 1,
    xp: 0,
    ...pet,
    progressStats: {
      games: 0,
      gameCoins: 0,
      baths: 0,
      ...(pet.progressStats || {})
    }
  };
}

function loadCollection() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Array.isArray(saved.pets)) {
      return {
        pets: saved.pets.map(normalizePet),
        activeId: saved.activeId,
        owned: Array.isArray(saved.owned)
          ? saved.owned
          : [...starterItems],
        decorations: Array.isArray(saved.decorations)
          ? saved.decorations
          : [],
        dailyRewards: saved.dailyRewards || {
          lastClaim: null,
          streak: 0
        }
      };
    }
  } catch {}

  try {
    const oldPet = JSON.parse(localStorage.getItem(OLD_STORAGE_KEY));

    if (oldPet && typeof oldPet === "object") {
      const migrated = normalizePet({
        ...createPet("cat", oldPet.name || "Mochi"),
        ...oldPet,
        type: "cat",
        accessory: localStorage.getItem(OLD_ACCESSORY_KEY) || "none"
      });

      return {
        pets: [migrated],
        activeId: migrated.id,
        owned: [...starterItems],
        decorations: [],
        dailyRewards: { lastClaim: null, streak: 0 }
      };
    }
  } catch {}

  return {
    pets: [],
    activeId: null,
    owned: [...starterItems],
    decorations: [],
    dailyRewards: { lastClaim: null, streak: 0 }
  };
}

function loadDiaryEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(DIARY_STORAGE_KEY));

    return saved && typeof saved === "object" && !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function addExperience(pet, amount) {
  const totalXP = (pet.xp || 0) + amount;
  const levelsGained = Math.floor(totalXP / XP_PER_LEVEL);

  return {
    ...pet,
    level: (pet.level || 1) + levelsGained,
    xp: totalXP % XP_PER_LEVEL,
    coins: pet.coins + levelsGained * 20
  };
}

function Meter({ label, value, color }) {
  return (
    <div className="meter">
      <div className="meter-heading">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="meter-track">
        <div
          className="meter-fill"
          style={{
            width: `${value}%`,
            background: color
          }}
        />
      </div>
    </div>
  );
}

function AdoptionScreen({ onAdopt, onBack, hasPets }) {
  const [type, setType] = useState("cat");
  const [name, setName] = useState(defaultNames.cat);

  function selectType(nextType) {
    setType(nextType);
    setName(defaultNames[nextType]);
  }

  function submit(event) {
    event.preventDefault();
    if (name.trim()) onAdopt(type, name.trim());
  }

  return (
    <main className="adoption-page">
      {hasPets && (
        <button
          className="back-button"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={18} />
          Back to my pets
        </button>
      )}

      <div className="adoption-heading">
        <span className="eyebrow">
          ✿ THE LITTLE ADOPTION HOUSE ✿
        </span>
        <h2>Find your forever friend</h2>
        <p>
          Every little pet deserves a cozy home.
          Who will join your family?
        </p>
      </div>

      <div className="adoption-grid">
        {petTypes.map((option) => (
          <button
            key={option.id}
            className={`adoption-card ${
              type === option.id ? "selected" : ""
            }`}
            onClick={() => selectType(option.id)}
            type="button"
          >
            <div className="adoption-pet-art">
              <PetIllustration type={option.id} />
            </div>

            <div className="adoption-card-bottom">
              <div>
                <h3>{option.label}</h3>
                <p>{option.description}</p>
              </div>

              <span className="adoption-check">
                {type === option.id && <Check size={17} />}
              </span>
            </div>
          </button>
        ))}
      </div>

      <form className="adoption-form" onSubmit={submit}>
        <label htmlFor="pet-name">
          What should we call your new friend?
        </label>

        <div className="adoption-form-row">
          <input
            id="pet-name"
            value={name}
            maxLength={20}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <button className="primary-button" type="submit">
            <Heart size={18} />
            Adopt this pet
          </button>
        </div>

        <p>
          Your new friend starts with 50 coins and lots of love.
        </p>
      </form>
    </main>
  );
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [collection, setCollection] = useState(loadCollection);
  const [diaryEntries, setDiaryEntries] = useState(loadDiaryEntries);
  const [screen, setScreen] = useState("home");
  const [mood, setMood] = useState("idle");
  const [message, setMessage] = useState("");
  const [today, setToday] = useState(localDateKey);
  const [reaction, setReaction] = useState(null);

  const {
    pets,
    activeId,
    owned,
    decorations,
    dailyRewards
  } = collection;

  const pet =
    pets.find((item) => item.id === activeId) ||
    pets[0] ||
    null;

  const currentRoom =
    rooms.find((room) => room.id === pet?.room) ||
    rooms[0];

  const roomIndex = rooms.findIndex(
    (room) => room.id === currentRoom.id
  );

  const personality =
    personalities[pet?.type] || personalities.cat;

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(collection)
    );
  }, [collection]);

  useEffect(() => {
    localStorage.setItem(
      DIARY_STORAGE_KEY,
      JSON.stringify(diaryEntries)
    );
  }, [diaryEntries]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setToday(localDateKey());
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  function changeSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));
  }

  function sound(kind) {
    playGameSound(kind, settings);
  }

  function showReaction(kind, text) {
    setReaction({
      id: crypto.randomUUID(),
      kind,
      text
    });
  }

  function updatePet(updater) {
    if (!pet) return;

    const targetId = pet.id;

    setCollection((current) => ({
      ...current,
      pets: current.pets.map((item) =>
        item.id === targetId ? updater(item) : item
      )
    }));
  }

  function careExperience(current, action) {
    const stats = { ...current.progressStats };

    if (action === "bath") {
      stats.baths = (stats.baths || 0) + 1;
    }

    return addExperience(
      {
        ...current,
        progressStats: stats
      },
      5
    );
  }

  function adoptPet(type, name) {
    const newPet = createPet(type, name);

    setCollection((current) => ({
      ...current,
      pets: [...current.pets, newPet],
      activeId: newPet.id
    }));

    setMood("happy");
    setReaction(null);
    setMessage(`${newPet.name} is so happy to be home!`);
    sound("reward");
    setScreen("home");
  }

  function switchPet(id) {
    const selected = pets.find((item) => item.id === id);
    if (!selected) return;

    setCollection((current) => ({
      ...current,
      activeId: id
    }));

    setMood("idle");
    setReaction(null);

    setMessage(
      `${selected.name} ${
        personalities[selected.type]?.idle[0] || "is happy!"
      }`
    );

    sound("click");
    setScreen("home");
  }

  function changeRoom(roomId) {
    const nextRoom = rooms.find(
      (room) => room.id === roomId
    );

    if (!nextRoom || !pet) return;

    updatePet((current) => ({
      ...current,
      room: roomId
    }));

    sound("click");
    setMood("idle");

    setMessage(
      `${pet.name} is exploring the ${nextRoom.name.toLowerCase()}!`
    );
  }

  function stepRoom(direction) {
    const nextIndex =
      (roomIndex + direction + rooms.length) % rooms.length;

    changeRoom(rooms[nextIndex].id);
  }

  function interact(action) {
    if (!pet) return;

    if (action === "feed") {
      if (pet.coins < 5) {
        setMessage(
          "You need 5 coins for a snack. Play to earn more!"
        );
        return;
      }

      updatePet((current) =>
        careExperience(
          {
            ...current,
            hunger: clamp(current.hunger + 22),
            happiness: clamp(current.happiness + 4),
            coins: current.coins - 5,
            actions: current.actions + 1
          },
          "feed"
        )
      );
    }

    if (action === "sleep") {
      updatePet((current) =>
        careExperience(
          {
            ...current,
            energy: clamp(current.energy + 30),
            hunger: clamp(current.hunger - 5),
            actions: current.actions + 1
          },
          "sleep"
        )
      );
    }

    if (action === "bath") {
      updatePet((current) =>
        careExperience(
          {
            ...current,
            cleanliness: clamp(current.cleanliness + 35),
            happiness: clamp(current.happiness + 5),
            actions: current.actions + 1
          },
          "bath"
        )
      );
    }

    sound(
      action === "sleep"
        ? "rest"
        : action === "bath"
        ? "bath"
        : "feed"
    );

    const nextMood =
      action === "sleep" ? "sleeping" : "happy";

    const text = `${pet.name} ${personality[action]}`;

    setMood(nextMood);
    setMessage(`${text} +5 XP`);

    showReaction(
      action === "sleep" ? "sleep" : "happy",
      text
    );
  }

  function petYourPet() {
    if (!pet) return;

    updatePet((current) => ({
      ...current,
      happiness: clamp(current.happiness + 3)
    }));

    sound("pet");

    const text = `${pet.name} ${personality.pet}`;

    setMood("happy");
    setMessage(`${text} +3 happiness`);
    showReaction("pet", text);
  }

  function openMiniGame() {
    if (!pet) return;

    if (pet.energy < 10) {
      setMessage(
        `${pet.name} needs to rest before playing!`
      );
      return;
    }

    sound("play");
    setScreen("minigame");
  }

  function finishMiniGame(coins, score) {
    updatePet((current) => {
      const stats = {
        ...current.progressStats,
        games: (current.progressStats?.games || 0) + 1,
        gameCoins:
          (current.progressStats?.gameCoins || 0) + coins
      };

      return addExperience(
        {
          ...current,
          coins: current.coins + coins,
          happiness: clamp(
            current.happiness + Math.min(20, score * 2)
          ),
          energy: clamp(current.energy - 10),
          hunger: clamp(current.hunger - 5),
          cleanliness: clamp(current.cleanliness - 8),
          actions: current.actions + 1,
          progressStats: stats
        },
        15
      );
    });

    sound("reward");

    const text = `${pet.name} ${personality.play}`;

    setMood("happy");
    setMessage(
      `${text} +${coins} coins and +15 XP!`
    );

    showReaction("happy", text);
  }

  function claimDailyReward() {
    if (!pet) return;

    const claimDate = localDateKey();

    const status = getDailyStatus(
      collection.dailyRewards,
      claimDate
    );

    if (!status.canClaim) return;

    const prize = dailyPrizes[status.nextDay];
    const targetId = pet.id;

    setCollection((current) => {
      const latest = getDailyStatus(
        current.dailyRewards,
        claimDate
      );

      if (!latest.canClaim) return current;

      return {
        ...current,
        dailyRewards: {
          lastClaim: claimDate,
          streak: latest.nextStreak
        },
        pets: current.pets.map((item) =>
          item.id === targetId
            ? {
                ...item,
                coins:
                  item.coins + dailyPrizes[latest.nextDay]
              }
            : item
        )
      };
    });

    sound("reward");
    setToday(claimDate);
    setMood("happy");

    setMessage(
      `${pet.name} received ${prize} coins from today's gift!`
    );

    showReaction(
      "happy",
      "A present? Just for me? Thank you!"
    );
  }

  function giveWellnessTreat(treat) {
    if (!pet || pet.coins < treat.price) return;

    const targetId = pet.id;

    setCollection((current) => ({
      ...current,
      pets: current.pets.map((item) => {
        if (
          item.id !== targetId ||
          item.coins < treat.price
        ) {
          return item;
        }

        return addExperience(
          {
            ...item,
            coins: item.coins - treat.price,
            hunger: clamp(item.hunger + treat.hunger),
            happiness: clamp(
              item.happiness + treat.happiness
            ),
            energy: clamp(item.energy + treat.energy),
            cleanliness: clamp(
              item.cleanliness + treat.cleanliness
            ),
            actions: item.actions + 1
          },
          5
        );
      })
    }));

    sound("feed");
    setMood("happy");

    setMessage(
      `${pet.name} loved the ${treat.name}! +5 XP`
    );

    showReaction(
      "happy",
      "That was delicious! Thank you!"
    );
  }

  function addDiaryEntry(entry) {
    if (!pet) return;

    const petId = pet.id;

    setDiaryEntries((current) => ({
      ...current,
      [petId]: [
        ...(current[petId] || []),
        entry
      ]
    }));
  }

  function deleteDiaryEntry(entryId) {
    if (!pet) return;

    const petId = pet.id;

    setDiaryEntries((current) => ({
      ...current,
      [petId]: (current[petId] || []).filter(
        (entry) => entry.id !== entryId
      )
    }));
  }

  function renamePet() {
    if (!pet) return;

    const name = window.prompt(
      "Give your pet a new name:",
      pet.name
    );

    if (!name?.trim()) return;

    const cleanName = name.trim().slice(0, 20);

    updatePet((current) => ({
      ...current,
      name: cleanName
    }));

    setMessage(`Hello, ${cleanName}!`);
    sound("click");
  }

  function resetPet() {
    if (!pet) return;

    if (
      !window.confirm(
        `Reset ${pet.name}'s stats, coins, level, and achievements?`
      )
    ) {
      return;
    }

    updatePet((current) => ({
      ...current,
      hunger: 70,
      happiness: 75,
      energy: 80,
      cleanliness: 80,
      coins: 50,
      actions: 0,
      level: 1,
      xp: 0,
      progressStats: {
        games: 0,
        gameCoins: 0,
        baths: 0
      }
    }));

    setMood("idle");
    setReaction(null);

    setMessage(
      `${pet.name} is ready for a fresh start!`
    );
  }

  function setAccessory(accessory) {
    if (
      accessory !== "none" &&
      !owned.includes(accessory)
    ) {
      return;
    }

    updatePet((current) => ({
      ...current,
      accessory
    }));

    sound("click");
  }

  function buyItem(item) {
    if (!pet) return;

    const targetId = pet.id;

    setCollection((current) => {
      const buyer = current.pets.find(
        (entry) => entry.id === targetId
      );

      if (
        !buyer ||
        current.owned.includes(item.id) ||
        buyer.coins < item.price
      ) {
        return current;
      }

      return {
        ...current,
        owned: [...current.owned, item.id],
        pets: current.pets.map((entry) =>
          entry.id === targetId
            ? {
                ...entry,
                coins: entry.coins - item.price
              }
            : entry
        )
      };
    });

    sound("reward");
  }

  function toggleDecoration(id) {
    if (!owned.includes(id)) return;

    setCollection((current) => ({
      ...current,
      decorations: current.decorations.includes(id)
        ? current.decorations.filter(
            (item) => item !== id
          )
        : [...current.decorations, id]
    }));

    sound("click");
  }

  return (
    <div
      className={`pocket-world ${
        settings.reduceMotion ? "pp-reduced-motion" : ""
      }`}
    >
      <header className="game-header">
        <div className="brand">
          <span className="brand-flower">✿</span>

          <div>
            <h1>Pocket Pet</h1>
            <p>YOUR LITTLE COZY COMPANIONS</p>
          </div>
        </div>

        <div className="header-actions">
          {pet && (
            <>
              <div className="coin-pill">
                <Coins size={20} />
                <strong>{pet.coins}</strong>
                <span>coins</span>
              </div>

              <button
                className="shop-launch-button"
                type="button"
                onClick={() => {
                  sound("click");
                  setScreen(
                    screen === "settings"
                      ? "home"
                      : "settings"
                  );
                }}
              >
                <Settings2 size={18} />
                Settings
              </button>

              {screen === "home" && (
                <>
                  <button
                    className="shop-launch-button"
                    onClick={() => {
                      sound("click");
                      setScreen("shop");
                    }}
                    type="button"
                  >
                    <ShoppingBag size={18} />
                    Shop
                  </button>

                  <button
                    className="shop-launch-button"
                    onClick={() => {
                      sound("click");
                      setScreen("diary");
                    }}
                    type="button"
                  >
                    <BookHeart size={18} />
                    Diary
                  </button>

                  <button
                    className="shop-launch-button"
                    onClick={() => {
                      sound("click");
                      setScreen("wellness");
                    }}
                    type="button"
                  >
                    <HeartPulse size={18} />
                    Wellness
                  </button>

                  <button
                    className="icon-button"
                    onClick={resetPet}
                    title="Reset active pet"
                    aria-label="Reset active pet"
                    type="button"
                  >
                    <RotateCcw size={19} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {!pet || screen === "adopt" ? (
        <AdoptionScreen
          onAdopt={adoptPet}
          onBack={() => setScreen("home")}
          hasPets={pets.length > 0}
        />
      ) : screen === "settings" ? (
        <GameSettings
          settings={settings}
          onChange={changeSetting}
          onPreview={() => sound("reward")}
          onClose={() => setScreen("home")}
        />
      ) : screen === "shop" ? (
        <PetShop
          coins={pet.coins}
          owned={owned}
          equipped={pet.accessory || "none"}
          decorations={decorations}
          onBuy={buyItem}
          onEquip={setAccessory}
          onToggleDecoration={toggleDecoration}
          onClose={() => setScreen("home")}
        />
      ) : screen === "diary" ? (
        <PetDiary
          pet={pet}
          entries={diaryEntries[pet.id] || []}
          onAdd={addDiaryEntry}
          onDelete={deleteDiaryEntry}
          onClose={() => setScreen("home")}
        />
      ) : screen === "wellness" ? (
        <PetWellness
          pet={pet}
          onTreat={giveWellnessTreat}
          onClose={() => setScreen("home")}
        />
      ) : screen === "minigame" ? (
        <MiniGame
          petName={pet.name}
          onClose={() => setScreen("home")}
          onFinish={finishMiniGame}
        />
      ) : (
        <main className="game-layout">
          <section className="room-panel">
            <div className="room-topline">
              <span>
                ✦ {currentRoom.name.toUpperCase()}
              </span>
              <span>
                ROOM {String(roomIndex + 1).padStart(2, "0")} / 04
              </span>
            </div>

            <div className="room-navigation">
              <button
                className="room-arrow"
                onClick={() => stepRoom(-1)}
                aria-label="Previous room"
                type="button"
              >
                <ChevronLeft size={19} />
              </button>

              <div className="room-tabs">
                {rooms.map((room) => {
                  const Icon = roomIcons[room.id];

                  return (
                    <button
                      key={room.id}
                      className={`room-tab ${
                        currentRoom.id === room.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() => changeRoom(room.id)}
                      type="button"
                    >
                      <Icon size={17} />
                      <span>{room.name}</span>
                    </button>
                  );
                })}
              </div>

              <button
                className="room-arrow"
                onClick={() => stepRoom(1)}
                aria-label="Next room"
                type="button"
              >
                <ChevronRight size={19} />
              </button>
            </div>

            <WeatherSystem petName={pet.name}>
              <div className="room-with-shop">
                <PetInteractions
                  pet={pet}
                  mood={mood}
                  reaction={reaction}
                  onPet={petYourPet}
                >
                  <RoomScene
                    room={currentRoom.id}
                    pet={pet}
                    mood={mood}
                  />
                </PetInteractions>

                {pet.accessory === "crown" && (
                  <span className="shop-pet-headwear shop-crown">
                    ♛
                  </span>
                )}

                {pet.accessory === "hat" && (
                  <span className="shop-pet-headwear shop-hat">
                    ⌂
                  </span>
                )}

                {currentRoom.id === "living" &&
                  decorations.includes("pillow") && (
                    <span className="shop-decor shop-decor-pillow">
                      ♥
                    </span>
                  )}

                {currentRoom.id === "living" &&
                  decorations.includes("vase") && (
                    <span className="shop-decor shop-decor-vase">
                      ❀
                    </span>
                  )}

                {currentRoom.id === "bedroom" &&
                  decorations.includes("lamp") && (
                    <span className="shop-decor shop-decor-lamp">
                      ✦
                    </span>
                  )}
              </div>
            </WeatherSystem>

            <div className="pet-dialogue">
              <span>♡</span>
              <p>
                {message ||
                  `${pet.name} ${personality.idle[0]}`}
              </p>
            </div>

            <div className="care-buttons">
              <button
                onClick={() => interact("feed")}
                type="button"
              >
                <span className="care-icon">
                  <Utensils size={22} />
                </span>
                <strong>Feed</strong>
                <small>5 coins · +5 XP</small>
              </button>

              <button
                onClick={openMiniGame}
                type="button"
              >
                <span className="care-icon">
                  <Gamepad2 size={23} />
                </span>
                <strong>Play</strong>
                <small>Coins · +15 XP</small>
              </button>

              <button
                onClick={() => interact("sleep")}
                type="button"
              >
                <span className="care-icon">
                  <Moon size={23} />
                </span>
                <strong>Rest</strong>
                <small>+30 energy · +5 XP</small>
              </button>

              <button
                onClick={() => interact("bath")}
                type="button"
              >
                <span className="care-icon">
                  <Bath size={23} />
                </span>
                <strong>Bathe</strong>
                <small>+35 clean · +5 XP</small>
              </button>
            </div>

            <div style={{ marginTop: 20 }}>
              <DailyRewards
                key={today}
                rewards={dailyRewards}
                onClaim={claimDailyReward}
              />
            </div>
          </section>

          <aside className="sidebar">
            <div className="profile-card">
              <div className="sidebar-heading">
                <span>✿ PET JOURNAL</span>
                <span>VOL. 01</span>
              </div>

              <div className="profile-icon">♡</div>

              <span className="tiny-label">
                MY LITTLE FRIEND
              </span>

              <h2>{pet.name}</h2>

              <button
                className="text-button"
                onClick={renamePet}
                type="button"
              >
                <Pencil size={13} />
                change name
              </button>
            </div>

            <div className="personality-card">
              <div className="personality-heading">
                <Sparkles size={17} />
                Pet Personality
              </div>

              <span className="personality-name">
                {personality.name}
              </span>

              <p>{personality.description}</p>
            </div>

            <div className="pet-collection-card">
              <div className="card-title">
                <PawPrint size={18} />
                My little family
              </div>

              <div className="pet-collection-list">
                {pets.map((item) => (
                  <button
                    key={item.id}
                    className={`pet-switch-button ${
                      item.id === pet.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => switchPet(item.id)}
                    type="button"
                  >
                    <span className="pet-switch-avatar">
                      {item.type === "cat"
                        ? "♡"
                        : item.type === "dog"
                        ? "✿"
                        : "❀"}
                    </span>

                    <span className="pet-switch-info">
                      <strong>{item.name}</strong>
                      <small>
                        {petTypes.find(
                          (type) => type.id === item.type
                        )?.label}
                        {" · "}Level {item.level || 1}
                      </small>
                    </span>

                    {item.id === pet.id && (
                      <Check size={17} />
                    )}
                  </button>
                ))}
              </div>

              <button
                className="adopt-more-button"
                onClick={() => setScreen("adopt")}
                type="button"
              >
                <Plus size={17} />
                Adopt another pet
              </button>
            </div>

            <div className="status-card">
              <div className="card-title">
                <Heart size={18} />
                How's your pet?
              </div>

              <Meter
                label="Fullness"
                value={pet.hunger}
                color="#77A39A"
              />

              <Meter
                label="Happiness"
                value={pet.happiness}
                color="#CB96BA"
              />

              <Meter
                label="Energy"
                value={pet.energy}
                color="#B0B3D6"
              />

              <Meter
                label="Cleanliness"
                value={pet.cleanliness ?? 80}
                color="#9BBCAC"
              />

              <p className="status-note">
                Every little moment together counts. ♡
              </p>
            </div>

            <PetProgress pet={pet} />

            <div className="accessory-card">
              <div className="card-title">
                ✿ Dress-up corner
              </div>

              <p>
                Choose an accessory for {pet.name}!
              </p>

              <div className="accessory-options">
                <button
                  className={
                    (pet.accessory || "none") === "none"
                      ? "active"
                      : ""
                  }
                  onClick={() => setAccessory("none")}
                  type="button"
                >
                  <span>×</span>
                  <small>None</small>
                </button>

                {shopItems
                  .filter(
                    (item) =>
                      item.kind === "accessory" &&
                      owned.includes(item.id)
                  )
                  .map((item) => (
                    <button
                      key={item.id}
                      className={
                        pet.accessory === item.id
                          ? "active"
                          : ""
                      }
                      onClick={() => setAccessory(item.id)}
                      type="button"
                    >
                      <span>{item.icon}</span>
                      <small>{item.name}</small>
                    </button>
                  ))}
              </div>

              <p className="shop-inventory-note">
                Your family shares unlocked items.
                Visit the shop to find more!
              </p>
            </div>

            <div className="memory-card">
              <span>✧ LITTLE MILESTONES ✧</span>
              <strong>{pet.actions}</strong>
              <p>
                sweet moments with {pet.name}
              </p>
            </div>
          </aside>
        </main>
      )}

      <footer className="game-footer">
        <span>POCKET PET ♡</span>
        <span>A LITTLE LOVE GOES A LONG WAY</span>
        <span>
          {pets.length} LITTLE FRIEND
          {pets.length === 1 ? "" : "S"}
        </span>
      </footer>
    </div>
  );
}
