import { useState } from "react";
import content from "../content";
import { addBlessingToFirestore, addRSVPToFirestore, isFirebaseConfigured } from "../lib/firebase";
import ConfettiBurst from "./ConfettiBurst";
import "./BlessingsRSVP.css";

const SIDES = ["Bride Side", "Groom Side"];

function submitToSheet(appsScriptUrl, payload) {
  return fetch(appsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}

function buildWhatsAppUrl(data, whatsappNumber) {
  const { partner1, partner2 } = content.couple;
  const lines = [
    `RSVP for ${partner1} & ${partner2}'s wedding:`,
    `Name: ${data.name}`,
    `Side: ${data.side}`,
    `Attending: ${data.attending === "Yes" ? "Joyfully accept" : "Regretfully decline"}`,
    `Guests: ${data.guests}`,
    `Parking Required: ${data.parkingRequired}`,
  ];
  const number = whatsappNumber ? whatsappNumber.replace(/\D/g, "") : "";
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function SendingAnimation({ message = "Delivering your blessings to Mahek & Yash..." }) {
  return (
    <div className="sending-animation" aria-live="polite">
      <div className="sending-animation__visual">
        <div className="sending-animation__envelope">
          <svg viewBox="0 0 80 56" className="sending-animation__svg" aria-hidden="true">
            <rect x="2" y="2" width="76" height="52" rx="6" fill="#fdfbf7" stroke="#b08968" strokeWidth="1.5" />
            <path d="M4 6 L40 34 L76 6" fill="none" stroke="#b08968" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M4 50 L30 26" fill="none" stroke="rgba(176, 137, 104, 0.4)" strokeWidth="1.2" />
            <path d="M76 50 L50 26" fill="none" stroke="rgba(176, 137, 104, 0.4)" strokeWidth="1.2" />
            <circle cx="40" cy="33" r="8" fill="#8f3350" />
            <circle cx="40" cy="33" r="6.5" fill="none" stroke="#d4af37" strokeWidth="1" />
            <path d="M37.5 33.5 L39.5 35.5 L43 31" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="sending-animation__sparkles">
            <span className="sending-sparkle sending-sparkle--1">✨</span>
            <span className="sending-sparkle sending-sparkle--2">🌸</span>
            <span className="sending-sparkle sending-sparkle--3">✨</span>
          </div>
        </div>
        <div className="sending-animation__trail" />
      </div>
      <p className="sending-animation__text">{message}</p>
      <div className="sending-animation__bar">
        <div className="sending-animation__progress" />
      </div>
    </div>
  );
}

function BlessingForm({ appsScriptUrl, onBlessingSent, onCelebrate, onSwitchToRsvp, initialName = "", initialSide = SIDES[0] }) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error | not-configured
  const [form, setForm] = useState({ name: initialName, side: initialSide, message: "" });
  const [submittedName, setSubmittedName] = useState("");

  // Sync initial props if they change
  useState(() => {
    if (initialName && form.name !== initialName) {
      setForm((f) => ({ ...f, name: initialName, side: initialSide || f.side }));
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFirebaseConfigured && !appsScriptUrl) {
      setStatus("not-configured");
      return;
    }
    setStatus("submitting");
    const nameToSave = form.name;
    const sideToSave = form.side;
    const startTime = Date.now();

    try {
      if (isFirebaseConfigured) {
        const docRef = await addBlessingToFirestore({ ...form });
        if (appsScriptUrl) {
          submitToSheet(appsScriptUrl, {
            type: "blessing",
            ...form,
            firestoreId: docRef?.id || "",
          }).catch(() => {});
        }
      } else {
        const res = await submitToSheet(appsScriptUrl, { type: "blessing", ...form });
        if (!res.ok) throw new Error("Request failed");
      }

      // Ensure minimum animation duration of 1.4s for smooth visual delight
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1400 - elapsed);
      await new Promise((r) => setTimeout(r, remaining));

      setSubmittedName(nameToSave);
      setStatus("success");
      onBlessingSent({ name: form.name, side: form.side, message: form.message });
      onCelebrate();
      setForm({ name: "", side: sideToSave, message: "" });
    } catch (err) {
      console.error("Blessing submission error:", err);
      setStatus("error");
    }
  };

  if (status === "submitting") {
    return <SendingAnimation message="Delivering your heartfelt blessings to Mahek & Yash…" />;
  }

  if (status === "success") {
    return (
      <div className="form-status form-status--success">
        <div className="form-status__seal">
          <span className="form-status__seal-icon">🌸</span>
        </div>
        <h3 className="form-status__title">Blessings Delivered!</h3>
        <p className="form-status__desc">
          Thank you{submittedName ? `, ${submittedName}` : ""}! Your warm wishes and blessings have reached Mahek &amp; Yash.
        </p>
        <div className="form-status__actions">
          <button
            type="button"
            className="button form-status__btn form-status__btn--primary"
            onClick={() => onSwitchToRsvp?.(submittedName || "", form.side || SIDES[0])}
          >
            <span style={{ marginRight: "0.35rem" }}>💌</span> RSVP for the Wedding
          </button>
          <a href="#blessings" className="button form-status__btn form-status__btn--secondary">
            View on Blessings Wall
          </a>
          <button
            type="button"
            className="button form-status__btn form-status__btn--subtle"
            onClick={() => setStatus("idle")}
          >
            Send Another Blessing
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="rsvp-form-fields" onSubmit={handleSubmit}>
      <label>
        <span className="rsvp-form-fields__label-text">Your Name</span>
        <input
          type="text"
          required
          placeholder="e.g. Rahul & Sunita Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <div className="rsvp-form-fields__side-group">
        <span className="rsvp-form-fields__label-text">Which side are you on?</span>
        <div className="side-selector-pills">
          {SIDES.map((side) => (
            <label
              key={side}
              className={`side-pill ${form.side === side ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="blessing-side"
                value={side}
                checked={form.side === side}
                onChange={() => setForm({ ...form, side })}
              />
              <span className="side-pill__indicator" />
              <span className="side-pill__text">{side}</span>
            </label>
          ))}
        </div>
      </div>

      <label>
        <span className="rsvp-form-fields__label-text">Your Message &amp; Blessings</span>
        <textarea
          required
          rows={4}
          placeholder="Write your heartfelt wishes for the couple…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </label>

      {status === "error" && (
        <p className="form-status form-status--error">
          Something went wrong — please try again.
        </p>
      )}
      {status === "not-configured" && (
        <p className="form-status form-status--error">
          This form isn&apos;t connected yet. (See README.md to set up the backend.)
        </p>
      )}

      <button type="submit" className="button rsvp-submit-btn" disabled={status === "submitting"}>
        <span className="rsvp-submit-btn__icon">✨</span> Send Blessing
      </button>
    </form>
  );
}

function RsvpForm({ appsScriptUrl, whatsappNumber, onCelebrate, onSwitchToBlessings, initialName = "", initialSide = SIDES[0] }) {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    name: initialName,
    side: initialSide,
    attending: "Yes",
    guests: 1,
    parkingRequired: "No",
  });
  const [submittedData, setSubmittedData] = useState(null);

  // Sync initial props if they change
  useState(() => {
    if (initialName && form.name !== initialName) {
      setForm((f) => ({ ...f, name: initialName, side: initialSide || f.side }));
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFirebaseConfigured && !appsScriptUrl) {
      setStatus("not-configured");
      return;
    }
    setStatus("submitting");
    const currentData = { ...form };
    const startTime = Date.now();

    try {
      if (isFirebaseConfigured) {
        const docRef = await addRSVPToFirestore({ ...form });
        if (appsScriptUrl) {
          submitToSheet(appsScriptUrl, {
            type: "rsvp",
            ...form,
            firestoreId: docRef?.id || "",
          }).catch(() => {});
        }
      } else {
        const res = await submitToSheet(appsScriptUrl, { type: "rsvp", ...form });
        if (!res.ok) throw new Error("Request failed");
      }

      // Ensure minimum animation duration of 1.4s
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1400 - elapsed);
      await new Promise((r) => setTimeout(r, remaining));

      setStatus("success");
      setSubmittedData(currentData);
      onCelebrate();
      setForm({ name: "", side: SIDES[0], attending: "Yes", guests: 1, parkingRequired: "No" });
    } catch (err) {
      console.error("RSVP submission error:", err);
      setStatus("error");
    }
  };

  if (status === "submitting") {
    return <SendingAnimation message="Sending your RSVP confirmation to Mahek & Yash…" />;
  }

  if (status === "success") {
    return (
      <div className="form-status form-status--success">
        <div className="form-status__seal">
          <span className="form-status__seal-icon">🎉</span>
        </div>
        <h3 className="form-status__title">RSVP Confirmed!</h3>
        <p className="form-status__desc">
          Thank you{submittedData?.name ? `, ${submittedData.name}` : ""}! Your response has been recorded. We look forward to celebrating together!
        </p>
        <div className="form-status__actions">
          <button
            type="button"
            className="button form-status__btn form-status__btn--primary"
            onClick={() => onSwitchToBlessings?.(submittedData?.name || "", submittedData?.side || SIDES[0])}
          >
            <span style={{ marginRight: "0.35rem" }}>✨</span> Send Blessings
          </button>
          {whatsappNumber && (
            <a
              className="button form-status__btn form-status__btn--secondary"
              href={buildWhatsAppUrl(submittedData, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share via WhatsApp
            </a>
          )}
          <button
            type="button"
            className="button form-status__btn form-status__btn--subtle"
            onClick={() => setStatus("idle")}
          >
            Submit Another RSVP
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="rsvp-form-fields" onSubmit={handleSubmit}>
      <label>
        <span className="rsvp-form-fields__label-text">Your Name</span>
        <input
          type="text"
          required
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <div className="rsvp-form-fields__side-group">
        <span className="rsvp-form-fields__label-text">Which side are you on?</span>
        <div className="side-selector-pills">
          {SIDES.map((side) => (
            <label
              key={side}
              className={`side-pill ${form.side === side ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="rsvp-side"
                value={side}
                checked={form.side === side}
                onChange={() => setForm({ ...form, side })}
              />
              <span className="side-pill__indicator" />
              <span className="side-pill__text">{side}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rsvp-form-fields__row">
        <label className="rsvp-form-fields__col">
          <span className="rsvp-form-fields__label-text">Will you attend?</span>
          <select
            value={form.attending}
            onChange={(e) => setForm({ ...form, attending: e.target.value })}
          >
            <option value="Yes">Joyfully accept</option>
            <option value="No">Regretfully decline</option>
          </select>
        </label>

        <label className="rsvp-form-fields__col">
          <span className="rsvp-form-fields__label-text">Guests (incl. you)</span>
          <input
            type="number"
            min={1}
            max={10}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
          />
        </label>
      </div>

      <label>
        <span className="rsvp-form-fields__label-text">Parking required?</span>
        <select
          value={form.parkingRequired}
          onChange={(e) => setForm({ ...form, parkingRequired: e.target.value })}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </label>

      {status === "error" && (
        <p className="form-status form-status--error">
          Something went wrong — please try again.
        </p>
      )}
      {status === "not-configured" && (
        <p className="form-status form-status--error">
          This form isn&apos;t connected yet. (See README.md to set up the backend.)
        </p>
      )}

      <button type="submit" className="button rsvp-submit-btn" disabled={status === "submitting"}>
        <span className="rsvp-submit-btn__icon">💌</span> Send RSVP
      </button>
    </form>
  );
}

export default function BlessingsRSVP({ onBlessingSent }) {
  const { blessingsRsvp, integrations } = content;
  const [activeTab, setActiveTab] = useState("blessings");
  const [prefilledName, setPrefilledName] = useState("");
  const [prefilledSide, setPrefilledSide] = useState(SIDES[0]);
  const [celebrateTrigger, setCelebrateTrigger] = useState(0);
  const celebrate = () => setCelebrateTrigger((t) => t + 1);

  const handleSwitchToBlessings = (name, side) => {
    if (name) setPrefilledName(name);
    if (side) setPrefilledSide(side);
    setActiveTab("blessings");
  };

  const handleSwitchToRsvp = (name, side) => {
    if (name) setPrefilledName(name);
    if (side) setPrefilledSide(side);
    setActiveTab("rsvp");
  };

  return (
    <section id="blessings-rsvp" className="section section--surface">
      <ConfettiBurst trigger={celebrateTrigger} />
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">Join The Celebration</span>
          <h2>{blessingsRsvp.heading}</h2>
          <p>{blessingsRsvp.subtext}</p>
        </div>

        {/* Royal Luxury Card Enclosure */}
        <div className="blessings-rsvp-card">
          {/* Card Decorative Luxury Frame */}
          <div className="blessings-rsvp-card__frame" aria-hidden="true">
            <span className="blessings-rsvp-card__inner-border" />
          </div>

          <div className="blessings-rsvp-card__content">
            {/* Segmented Royal Tabs */}
            <div className="rsvp-tabs__list" role="tablist" aria-label="Blessings and RSVP options">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "blessings"}
                className={`rsvp-tabs__tab ${activeTab === "blessings" ? "is-active" : ""}`}
                onClick={() => setActiveTab("blessings")}
              >
                <span className="rsvp-tabs__tab-icon">✨</span>
                <span>Send Blessings</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "rsvp"}
                className={`rsvp-tabs__tab ${activeTab === "rsvp" ? "is-active" : ""}`}
                onClick={() => setActiveTab("rsvp")}
              >
                <span className="rsvp-tabs__tab-icon">💌</span>
                <span>RSVP</span>
              </button>
            </div>

            {/* Panel Area */}
            <div className="rsvp-tabs__panel">
              {activeTab === "blessings" ? (
                <BlessingForm
                  key={`blessing-${prefilledName}`}
                  initialName={prefilledName}
                  initialSide={prefilledSide}
                  appsScriptUrl={integrations?.googleSheets?.appsScriptUrl}
                  onBlessingSent={onBlessingSent}
                  onCelebrate={celebrate}
                  onSwitchToRsvp={handleSwitchToRsvp}
                />
              ) : (
                <RsvpForm
                  key={`rsvp-${prefilledName}`}
                  initialName={prefilledName}
                  initialSide={prefilledSide}
                  appsScriptUrl={integrations?.googleSheets?.appsScriptUrl}
                  whatsappNumber={integrations?.whatsapp?.rsvpNumber}
                  onCelebrate={celebrate}
                  onSwitchToBlessings={handleSwitchToBlessings}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
