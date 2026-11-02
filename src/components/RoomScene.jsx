import React from "react";
import PetIllustration from "./PetIllustration";

export const rooms = [
  { id: "living", name: "Living Room", subtitle: "The cozy cottage", icon: "⌂" },
  { id: "kitchen", name: "Kitchen", subtitle: "Something smells yummy", icon: "♡" },
  { id: "bedroom", name: "Bedroom", subtitle: "Sweet dreams", icon: "☾" },
  { id: "bathroom", name: "Bathroom", subtitle: "Bubble bath time", icon: "✿" }
];

export default function RoomScene({ room, pet, mood }) {
  return (
    <div className={`room-scene room-${room}`}>
      <div className="room-wallpaper" />

      {room === "living" && (
        <>
          <div className="wall-frame"><span>✿</span></div>
          <div className="window">
            <div className="window-sky">
              <div className="sun" />
              <div className="hill hill-back" />
              <div className="hill hill-front" />
            </div>
            <div className="window-cross vertical" />
            <div className="window-cross horizontal" />
          </div>
          <div className="curtain curtain-left" />
          <div className="curtain curtain-right" />
          <div className="plant">
            <div className="plant-leaf leaf-one" />
            <div className="plant-leaf leaf-two" />
            <div className="plant-leaf leaf-three" />
            <div className="plant-pot" />
          </div>
        </>
      )}

      {room === "kitchen" && (
        <>
          <div className="kitchen-shelf">
            <div className="shelf-cup" />
            <div className="shelf-cup" />
            <div className="shelf-jar" />
          </div>
          <div className="kitchen-picture">♡</div>
          <div className="kitchen-counter">
            <div className="counter-top" />
            <div className="counter-door" />
            <div className="counter-door" />
          </div>
          <div className="food-bowl">
            <div className="food-pieces">● ● ●</div>
          </div>
        </>
      )}

      {room === "bedroom" && (
        <>
          <div className="bedroom-moon">☾</div>
          <div className="bedroom-stars">✦ &nbsp; ✧ &nbsp; ✦</div>
          <div className="bed">
            <div className="bed-headboard" />
            <div className="bed-pillow" />
            <div className="bed-blanket" />
          </div>
          <div className="bedroom-lamp">
            <div className="lamp-shade" />
            <div className="lamp-stem" />
          </div>
        </>
      )}

      {room === "bathroom" && (
        <>
          <div className="bathroom-mirror">✧</div>
          <div className="bathroom-shelf">
            <div className="bath-bottle" />
            <div className="bath-bottle" />
          </div>
          <div className="bathtub">
            <div className="bath-water" />
            <div className="bath-bubbles">
              <span>○</span><span>○</span><span>○</span>
            </div>
          </div>
        </>
      )}

      <div className="room-floor" />
      <div className="rug" />

      <div className="pet-area">
        <PetIllustration
          type={pet.type}
          mood={mood}
          accessory={pet.accessory || "none"}
        />
        <div className="pet-nameplate">♡ {pet.name}</div>
      </div>
    </div>
  );
}
