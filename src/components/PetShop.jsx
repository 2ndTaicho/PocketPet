import { Check, Coins, ShoppingBag, Sparkles } from "lucide-react";
import "./PetShop.css";

export const shopItems = [
  { id: "bow", name: "Sweet Bow", icon: "୨୧", price: 15, kind: "accessory", description: "A soft mauve bow" },
  { id: "flower", name: "Flower Clip", icon: "✿", price: 20, kind: "accessory", description: "A tiny flower for your pet" },
  { id: "crown", name: "Little Crown", icon: "♛", price: 45, kind: "accessory", description: "For cottage royalty" },
  { id: "hat", name: "Cozy Hat", icon: "⌂", price: 35, kind: "accessory", description: "A cute little bonnet" },
  { id: "pillow", name: "Heart Pillow", icon: "♥", price: 30, kind: "decoration", description: "A soft cushion for the living room" },
  { id: "vase", name: "Flower Vase", icon: "❀", price: 25, kind: "decoration", description: "Fresh flowers for the cottage" },
  { id: "lamp", name: "Star Lamp", icon: "✦", price: 40, kind: "decoration", description: "A gentle bedroom glow" }
];

export const starterItems = ["bow", "flower"];

export default function PetShop({
  coins,
  owned,
  equipped,
  decorations,
  onBuy,
  onEquip,
  onToggleDecoration,
  onClose
}) {
  return (
    <section className="shop-page">
      <div className="shop-heading">
        <span className="shop-eyebrow">✿ THE LITTLE BOUTIQUE ✿</span>
        <h2>Pet Shop</h2>
        <p>Little treasures for your furry family.</p>

        <div className="shop-heading-actions">
          <span className="shop-balance">
            <Coins size={18} />
            {coins} coins
          </span>
          <button className="shop-back" onClick={onClose}>
            Back to cottage
          </button>
        </div>
      </div>

      {["accessory", "decoration"].map((kind) => (
        <div className="shop-section" key={kind}>
          <h3>
            {kind === "accessory" ? <ShoppingBag size={19} /> : <Sparkles size={19} />}
            {kind === "accessory" ? "Pet accessories" : "Cottage decorations"}
          </h3>

          <div className="shop-grid">
            {shopItems.filter((item) => item.kind === kind).map((item) => {
              const purchased = owned.includes(item.id);
              const active = kind === "accessory"
                ? equipped === item.id
                : decorations.includes(item.id);

              return (
                <article className="shop-item" key={item.id}>
                  <div className="shop-item-art">
                    <span>{item.icon}</span>
                  </div>

                  <div className="shop-item-content">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>

                    {purchased ? (
                      <button
                        className={`shop-item-button ${active ? "shop-active" : ""}`}
                        onClick={() => kind === "accessory"
                          ? onEquip(active ? "none" : item.id)
                          : onToggleDecoration(item.id)}
                      >
                        {active ? <Check size={16} /> : null}
                        {active ? (kind === "accessory" ? "Equipped" : "Displayed") : (kind === "accessory" ? "Equip" : "Display")}
                      </button>
                    ) : (
                      <button
                        className="shop-item-button"
                        disabled={coins < item.price}
                        onClick={() => onBuy(item)}
                      >
                        <Coins size={15} />
                        {item.price} coins
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
