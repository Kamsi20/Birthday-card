import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";

// To use a photo of Mum: put mum.jpeg in your /public folder,
// then uncomment the next two lines (and remove `const BACKGROUND = null;`).
import bg from "/mum.jpeg";
const BACKGROUND = bg;
// const BACKGROUND = null;

/* ---------- Pages ---------- */
// Page 1 = cover. Pages 2 and 3 each hold 2 messages from 2 different people.
// Change the names and messages here (the names and text can also be edited on screen).
const PAGES = [
  { kind: "cover" },
  {
    kind: "wishes",
    heading: "Birthday Wishes",
    messages: [
      {
        id: 1,
        name: "Kamsiyochukwu",
        icon: "🌸",
        text: "Happy Birthday to the most amazing, beautiful mother in the world! Your love, guidance, care, advice and  support have shaped me into the person I am today. On this special day, I want to express my deepest gratitude for everything you do. May this year bring you endless joy, good health of mind and body, and countless blessings I wish you long life and prosperity, You shall live to bear the fruit of your labor. You deserve all the happiness in the world. I love you more than words can express.YOU ARE VERY LOVED BY ALL OF US AND WE ARE SO LUCKY TO HAVE YOU. PLEASE STAY WITH US.  Happy Birthday, Mom! 🎉❤️",
      },
      { id: 2, name: "Ifechukwu", icon: "✨", text: "Mama the mama , happy 42nd birthday wishing you long life and prosperity, may you live long to bear the fruit of your labor may God keep on blessing you and grant you heart desires.Mum, on your birthday I always find myself thinking about how lucky I am to have you. You've taught me so much about kindness, resilience, and love ,not just with words, but by the way you live. I hope you know how deeply you're appreciated, today and every day. Happy Birthday. I love you.❤️ "

 },
    ],
  },
  {
    kind: "wishes",
    heading: "More Love For You",
    messages: [
      {
        id: 3,
        name: "Chinenye",
        icon: "💛",
        text: " Hey, mom You’re turning a new age, getting older, wiser and soo beautiful. You’ve had your fair share of life, experienced things you shouldn’t have but you still came out strong, a conqueror. I wish you a very happy birthday today, you’re the strongest lady i know, a sister and mother and a daughter that anyone would be soo proud of. Thank you for taking good care of us, for the sacrifices, for always being there for us, you’re a solution provider. Thank you for loving us this much even when we annoy you, thank you for being such a wonderful person. I hope God grants all your heart desires, may He give you long life soo you reap the fruits of your labor and just be taken care of. I pray you always find happiness in the little things of life and no matter what life throws at you, may you always conquer. I love you soo much mama. HAPPY BIRTHDAY ❤️",
      },
      {
        id: 4,
        name: "Kenechukwu",
        icon: "🎂",
        text: "Happy Birthday to my beautiful Mum! ❤️🎂.   Today, I celebrate one of the greatest blessings God has given me. Mum, words cannot fully express how grateful I am to have you in my life. Thank you for your endless love, care, sacrifices, prayers, support, and everything you do for us I appreciate all the things you’ve had to go through just to make sure we are okay. As you celebrate another year today, may God continues to bless you with long life so that you can rip the fruit of your labor , good health ,happiness, peace of mind, and unlimited blessings. May He protect you wherever you go, answer your prayers, grant you your heart’s desires, and never let you lack anything good. May this new chapter of your life bring more reasons to smile, celebrate, and be happy. I love you so much,Happy Birthday once again, Mummy! ❤️🎉 KENECHUKWU ❤️",
      },
    ],
  },
];
const LAST = PAGES.length - 1;

/* ---------- Decorations ---------- */
const COLORS = [
  "#ffd54f",
  "#4fc3f7",
  "#ff8a80",
  "#b9f6ca",
  "#ffffff",
  "#ce93d8",
];

const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  delay: `${-((i * 1.9) % 12)}s`,
  duration: `${10 + (i % 5) * 2}s`,
  color: COLORS[i % COLORS.length],
  round: i % 3 === 0,
}));

const FLOATERS = [
  { e: "🎈", left: "4%", top: "18%", size: 40, delay: "0s" },
  { e: "🎈", left: "86%", top: "20%", size: 44, delay: "-1.2s" },
  { e: "🧁", left: "6%", top: "70%", size: 32, delay: "-0.6s" },
  { e: "🍰", left: "84%", top: "70%", size: 32, delay: "-2s" },
  { e: "⭐", left: "16%", top: "32%", size: 22, delay: "-1.5s" },
  { e: "✨", left: "76%", top: "34%", size: 24, delay: "-0.3s" },
  { e: "🎀", left: "80%", top: "56%", size: 26, delay: "-2.4s" },
  { e: "🎁", left: "10%", top: "56%", size: 28, delay: "-1s" },
];

const FLAGS = ["#ff8a80", "#ffd54f", "#4fc3f7", "#b9f6ca", "#ce93d8"];

function Bunting() {
  return (
    <div className="bunting" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          style={{
            background: FLAGS[i % FLAGS.length],
            animationDelay: `${-i * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Textarea that grows to fit its text (no inner scrolling) ---------- */
function AutoTextarea(props) {
  const ref = useRef(null);
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useLayoutEffect(resize, [props.value]);
  useEffect(() => {
    resize();
    document.fonts?.ready.then(resize);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return <textarea ref={ref} rows={1} {...props} />;
}

/* ---------- App ---------- */
export default function App() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(
    Object.fromEntries(
      PAGES.flatMap((p) => p.messages ?? []).map((m) => [
        m.id,
        { name: m.name, text: m.text },
      ]),
    ),
  );
  const touchX = useRef(null);

  const next = () => setPage((p) => Math.min(p + 1, LAST));
  const prev = () => setPage((p) => Math.max(p - 1, 0));
  const edit = (id, field, value) =>
    setData((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));

  // swipe left / right to turn the page (ignored while typing)
  const onTouchStart = (e) => {
    touchX.current = e.target.closest("textarea, input")
      ? null
      : e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -60) next();
    if (dx > 60) prev();
    touchX.current = null;
  };

  const current = PAGES[page];

  return (
    <main
      className="card"
      style={BACKGROUND ? { "--bg": `url(${BACKGROUND})` } : undefined}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="overlay" />

      <div className="decor" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <i
            key={i}
            className="confetti"
            style={{
              left: c.left,
              background: c.color,
              animationDelay: c.delay,
              animationDuration: c.duration,
              borderRadius: c.round ? "50%" : "2px",
            }}
          />
        ))}
        {page === 0 &&
          FLOATERS.map((f, i) => (
            <span
              key={i}
              className="floater"
              style={{
                left: f.left,
                top: f.top,
                fontSize: f.size,
                animationDelay: f.delay,
              }}
            >
              {f.e}
            </span>
          ))}
      </div>

      <Bunting />

      {/* key makes the page animate in every time it changes */}
      <section className="page" key={page}>
        {current.kind === "cover" ? (
          <div className="cover">
            <h1>Happy Birthday, Mum!</h1>
            <p>Wishing you a day as wonderful as you are</p>
            <div className="love">With all our love ❤️</div>
            <button className="open" onClick={next}>
              Open your card 💌
            </button>
          </div>
        ) : (
          <div className="wishes">
            <h2 className="wishes-title">🎂 {current.heading} 🎂</h2>
            {current.messages.map((m) => (
              <article className="wish" key={m.id}>
                <label className="from">
                  <span>{m.icon} From</span>
                  <input
                    value={data[m.id].name}
                    onChange={(e) => edit(m.id, "name", e.target.value)}
                    maxLength={24}
                    aria-label="Sender name"
                  />
                </label>
                <AutoTextarea
                  value={data[m.id].text}
                  onChange={(e) => edit(m.id, "text", e.target.value)}
                  maxLength={1500}
                  aria-label={`Message from ${data[m.id].name}`}
                />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* page controls */}
      <nav className="nav">
        <button onClick={prev} disabled={page === 0} aria-label="Previous page">
          ‹ Back
        </button>
        <div className="dots">
          {PAGES.map((_, i) => (
            <button
              key={i}
              className={i === page ? "dot on" : "dot"}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} disabled={page === LAST} aria-label="Next page">
          Next ›
        </button>
      </nav>
    </main>
  );
}