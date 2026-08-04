import { useState } from "react";
import content from "../content";
import { BLESSINGS_WALL_HASH } from "../lib/routes";
import ConfettiBurst from "./ConfettiBurst";
import "./BlessingsRSVP.css";

const SIDES = ["Bride Side", "Groom Side"];

function submitToSheet(appsScriptUrl, payload) {
  // Posting with Content-Type: text/plain keeps this a CORS "simple request"
  // so the browser doesn't send a preflight OPTIONS request — Apps Script
  // web apps don't handle OPTIONS, so a preflight would just fail.
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

function BlessingForm({ appsScriptUrl, onBlessingSent, onCelebrate }) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [form, setForm] = useState({ name: "", side: SIDES[0], message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!appsScriptUrl) {
      setStatus("not-configured");
      return;
    }
    setStatus("submitting");
    try {
      const res = await submitToSheet(appsScriptUrl, { type: "blessing", ...form });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      onBlessingSent({ name: form.name, side: form.side, message: form.message });
      onCelebrate();
      setForm({ name: "", side: SIDES[0], message: "" });
      // Hold on the success message briefly so it's actually readable, then
      // take the guest straight to the wall to see their blessing land.
      setTimeout(() => {
        window.location.hash = BLESSINGS_WALL_HASH;
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="form-status form-status--success">
        Thank you for your blessing! 💛 Taking you to the wall…
      </p>
    );
  }

  return (
    <form className="rsvp-form-fields" onSubmit={handleSubmit}>
      <label>
        Your name
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <fieldset>
        <legend>Which side are you on?</legend>
        {SIDES.map((side) => (
          <label className="radio-label" key={side}>
            <input
              type="radio"
              name="blessing-side"
              value={side}
              checked={form.side === side}
              onChange={() => setForm({ ...form, side })}
            />
            {side}
          </label>
        ))}
      </fieldset>
      <label>
        Your message
        <textarea
          required
          rows={4}
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
          This form isn't connected yet. (See README.md to set up the backend.)
        </p>
      )}
      <button type="submit" className="button button--primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Blessing"}
      </button>
    </form>
  );
}

function RsvpForm({ appsScriptUrl, whatsappNumber, onCelebrate }) {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    name: "",
    side: SIDES[0],
    attending: "Yes",
    guests: 1,
    parkingRequired: "No",
  });
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!appsScriptUrl) {
      setStatus("not-configured");
      return;
    }
    setStatus("submitting");
    try {
      const res = await submitToSheet(appsScriptUrl, { type: "rsvp", ...form });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setSubmittedData(form);
      onCelebrate();
      setForm({ name: "", side: SIDES[0], attending: "Yes", guests: 1, parkingRequired: "No" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="form-status form-status--success">
        <p>Thank you — your RSVP is in! 🎉</p>
        <a
          className="button button--primary"
          href={buildWhatsAppUrl(submittedData, whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share via WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className="rsvp-form-fields" onSubmit={handleSubmit}>
      <label>
        Your name
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <fieldset>
        <legend>Which side are you on?</legend>
        {SIDES.map((side) => (
          <label className="radio-label" key={side}>
            <input
              type="radio"
              name="rsvp-side"
              value={side}
              checked={form.side === side}
              onChange={() => setForm({ ...form, side })}
            />
            {side}
          </label>
        ))}
      </fieldset>
      <label>
        Will you attend?
        <select
          value={form.attending}
          onChange={(e) => setForm({ ...form, attending: e.target.value })}
        >
          <option value="Yes">Joyfully accept</option>
          <option value="No">Regretfully decline</option>
        </select>
      </label>
      <label>
        Number of guests (including yourself)
        <input
          type="number"
          min={1}
          max={10}
          value={form.guests}
          onChange={(e) => setForm({ ...form, guests: e.target.value })}
        />
      </label>
      <label>
        Parking required?
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
          This form isn't connected yet. (See README.md to set up the backend.)
        </p>
      )}
      <button type="submit" className="button button--primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}

export default function BlessingsRSVP({ onBlessingSent }) {
  const { blessingsRsvp, integrations } = content;
  const [activeTab, setActiveTab] = useState("blessings");
  const [celebrateTrigger, setCelebrateTrigger] = useState(0);
  const celebrate = () => setCelebrateTrigger((t) => t + 1);

  return (
    <section id="blessings-rsvp" className="section section--surface">
      <ConfettiBurst trigger={celebrateTrigger} />
      <div className="section__inner">
        <div className="section__heading">
          <span className="eyebrow">Join The Celebration</span>
          <h2>{blessingsRsvp.heading}</h2>
          <p>{blessingsRsvp.subtext}</p>
        </div>

        <div className="rsvp-tabs">
          <div className="rsvp-tabs__list" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "blessings"}
              className={`rsvp-tabs__tab ${activeTab === "blessings" ? "is-active" : ""}`}
              onClick={() => setActiveTab("blessings")}
            >
              Send Blessings
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "rsvp"}
              className={`rsvp-tabs__tab ${activeTab === "rsvp" ? "is-active" : ""}`}
              onClick={() => setActiveTab("rsvp")}
            >
              RSVP
            </button>
          </div>

          <div className="rsvp-tabs__panel">
            {activeTab === "blessings" ? (
              <BlessingForm
                appsScriptUrl={integrations.appsScriptUrl}
                onBlessingSent={onBlessingSent}
                onCelebrate={celebrate}
              />
            ) : (
              <RsvpForm
                appsScriptUrl={integrations.appsScriptUrl}
                whatsappNumber={integrations.whatsappNumber}
                onCelebrate={celebrate}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
