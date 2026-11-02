import { useState } from "react";
import {
  ArrowLeft,
  BookHeart,
  CalendarDays,
  Heart,
  Pencil,
  Plus,
  Trash2
} from "lucide-react";
import "./PetDiary.css";

const MAX_ENTRIES = 100;

function formatDate(value) {
  if (!value) return "A special day";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "A special day";

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

export default function PetDiary({
  pet,
  entries = [],
  onAdd,
  onDelete,
  onClose
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const memories = Array.isArray(entries) ? entries : [];

  function saveMemory(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) return;
    if (memories.length >= MAX_ENTRIES) return;

    onAdd?.({
      id: crypto.randomUUID(),
      title: cleanTitle.slice(0, 60),
      content: cleanContent.slice(0, 600),
      createdAt: new Date().toISOString()
    });

    setTitle("");
    setContent("");
    setShowForm(false);
  }

  function removeMemory(id) {
    if (!window.confirm("Delete this memory?")) return;
    onDelete?.(id);
  }

  return (
    <main className="diary-page">
      <button
        className="diary-back"
        type="button"
        onClick={onClose}
      >
        <ArrowLeft size={18} />
        Back to my pet
      </button>

      <div className="diary-cover">
        <span className="diary-cover-label">
          THE POCKET PET COLLECTION
        </span>

        <div className="diary-cover-icon">
          <BookHeart size={39} strokeWidth={1.6} />
        </div>

        <h2>{pet.name}'s Little Diary</h2>
        <p>
          A collection of sweet memories, tiny adventures,
          and everything worth remembering.
        </p>

        <div className="diary-cover-footer">
          <span>EST. {new Date(pet.adoptedAt || Date.now()).getFullYear()}</span>
          <span>{memories.length} MEMORIES</span>
        </div>
      </div>

      <div className="diary-toolbar">
        <div>
          <span className="diary-eyebrow">♡ OUR LITTLE STORY ♡</span>
          <h3>Memory Pages</h3>
        </div>

        <button
          className="diary-add-button"
          type="button"
          onClick={() => setShowForm((value) => !value)}
          disabled={memories.length >= MAX_ENTRIES && !showForm}
        >
          {showForm ? <Pencil size={17} /> : <Plus size={17} />}
          {showForm ? "Close editor" : "Write a memory"}
        </button>
      </div>

      {showForm && (
        <form className="diary-form" onSubmit={saveMemory}>
          <label htmlFor="diary-title">Memory title</label>
          <input
            id="diary-title"
            type="text"
            value={title}
            maxLength={60}
            placeholder="A wonderful afternoon..."
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="diary-content">What happened?</label>
          <textarea
            id="diary-content"
            value={content}
            maxLength={600}
            rows={5}
            placeholder={`Write something sweet about ${pet.name}...`}
            onChange={(event) => setContent(event.target.value)}
            required
          />

          <div className="diary-form-footer">
            <span>{content.length}/600 characters</span>
            <button type="submit">
              <Heart size={17} />
              Save memory
            </button>
          </div>
        </form>
      )}

      {memories.length === 0 ? (
        <div className="diary-empty">
          <BookHeart size={38} strokeWidth={1.5} />
          <h3>A story waiting to begin</h3>
          <p>
            {pet.name}'s diary is empty for now.
            Write your first memory together!
          </p>
        </div>
      ) : (
        <div className="diary-entries">
          {[...memories]
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            )
            .map((entry, index) => (
              <article className="diary-entry" key={entry.id}>
                <div className="diary-entry-top">
                  <span className="diary-entry-number">
                    MEMORY {String(memories.length - index).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    className="diary-delete"
                    onClick={() => removeMemory(entry.id)}
                    aria-label={`Delete ${entry.title}`}
                    title="Delete memory"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h4>{entry.title}</h4>

                <div className="diary-date">
                  <CalendarDays size={14} />
                  {formatDate(entry.createdAt)}
                </div>

                <p>{entry.content}</p>

                <div className="diary-entry-bottom">
                  <Heart size={14} fill="currentColor" />
                  <span>WITH LOVE, {pet.name.toUpperCase()}</span>
                </div>
              </article>
            ))}
        </div>
      )}

      <div className="diary-bottom-note">
        ✿ Every little moment deserves to be remembered. ✿
      </div>
    </main>
  );
}
