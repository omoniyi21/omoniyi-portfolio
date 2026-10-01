// A thin ink postmark for the postcard's top-right corner, dated the day
// you visit, as if the card was franked when the page was sent to you.
const TODAY = new Date();
const DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format(TODAY).toUpperCase();
const YEAR = TODAY.getFullYear();

export default function Postmark({ className = "" }) {
  return (
    <svg className={`postmark ${className}`.trim()} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <path id="postmark-arc" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
      </defs>
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="27" />
      <text className="postmark__ring">
        <textPath href="#postmark-arc" textLength="224" lengthAdjust="spacing">DALLAS TX ✦ OMONIYI ALIMI ✦</textPath>
      </text>
      <text className="postmark__date" x="50" y="49" textAnchor="middle">{DAY}</text>
      <text className="postmark__date" x="50" y="61" textAnchor="middle">{YEAR}</text>
    </svg>
  );
}
