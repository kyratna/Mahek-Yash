import { useCountdown } from "../hooks/useCountdown";
import "./Countdown.css";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export default function Countdown({ targetDate }) {
  const timeLeft = useCountdown(targetDate);

  if (timeLeft.isPast) {
    return <p className="countdown countdown--past">We're married!</p>;
  }

  return (
    <div className="countdown">
      {UNITS.map((unit) => (
        <div className="countdown__unit" key={unit.key}>
          <span className="countdown__value">{timeLeft[unit.key]}</span>
          <span className="countdown__label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
