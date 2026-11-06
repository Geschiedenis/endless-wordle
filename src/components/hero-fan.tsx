"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { DemoBoard, EMPTY_ROW, type DemoRow } from "@/components/demo-board";
import { Flag } from "@/components/flag";
import type { Locale } from "@/i18n/config";
import { HOW_TO_PLAY_EXAMPLES, TIP_EXAMPLES } from "@/lib/game/examples";
import { computeFeedback } from "@/lib/game/feedback";

/**
 * Five example games fanned out like cards above the title on the home page. Hovering
 * spreads the fan and lifts the card under the cursor, and the fan leans towards the
 * cursor. Decorative only, so it's hidden from screen readers, and it stays still for
 * people who prefer reduced motion (see .hero-fan in globals.css).
 *
 * Every board is a real game in its language, scored by the game's own rules.
 */
const CARDS: { locale: Locale; rows: (locale: Locale) => DemoRow[] }[] = [
  { locale: "fr", rows: (l) => game(TIP_EXAMPLES[l].answer, [TIP_EXAMPLES[l].weak, TIP_EXAMPLES[l].explore]) },
  { locale: "de", rows: (l) => game(HOW_TO_PLAY_EXAMPLES[l].answer, [HOW_TO_PLAY_EXAMPLES[l].first, HOW_TO_PLAY_EXAMPLES[l].second, HOW_TO_PLAY_EXAMPLES[l].answer]) },
  { locale: "en", rows: (l) => game(HOW_TO_PLAY_EXAMPLES[l].answer, [HOW_TO_PLAY_EXAMPLES[l].first, HOW_TO_PLAY_EXAMPLES[l].second, HOW_TO_PLAY_EXAMPLES[l].answer]) },
  { locale: "nl", rows: (l) => game(TIP_EXAMPLES[l].answer, [TIP_EXAMPLES[l].weak, TIP_EXAMPLES[l].explore, TIP_EXAMPLES[l].mover, TIP_EXAMPLES[l].answer]) },
  { locale: "es", rows: (l) => game(TIP_EXAMPLES[l].answer, [TIP_EXAMPLES[l].explore, TIP_EXAMPLES[l].answer]) },
];

/** Where each card sits in the fan: sideways offset, drop and tilt, from left to right. */
const FAN = [
  { x: -150, y: 26, r: -22 },
  { x: -78, y: 6, r: -11 },
  { x: 0, y: 0, r: 0 },
  { x: 78, y: 6, r: 11 },
  { x: 150, y: 26, r: 22 },
];

/** Guesses scored against the answer, followed by empty rows up to six. */
function game(answer: string, guesses: string[]): DemoRow[] {
  const rows: DemoRow[] = guesses.map((word) => ({ word, states: computeFeedback(word, answer) }));
  while (rows.length < 6) rows.push(EMPTY_ROW);
  return rows;
}

export function HeroFan() {
  const fan = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  /** Passes the cursor position, from -1 to 1 on each axis, to the CSS as --mx and --my. */
  function follow(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const mx = ((event.clientX - box.left) / box.width) * 2 - 1;
    const my = ((event.clientY - box.top) / box.height) * 2 - 1;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      fan.current?.style.setProperty("--mx", mx.toFixed(3));
      fan.current?.style.setProperty("--my", my.toFixed(3));
    });
  }

  function reset() {
    cancelAnimationFrame(frame.current);
    fan.current?.style.setProperty("--mx", "0");
    fan.current?.style.setProperty("--my", "0");
  }

  return (
    <div className="hero-stage relative flex items-center justify-center" onPointerMove={follow} onPointerLeave={reset}>
      <div ref={fan} aria-hidden="true" className="hero-fan">
        {CARDS.map(({ locale, rows }, index) => (
          <div
            key={locale}
            className="hero-card"
            style={{ "--x": FAN[index].x, "--y": FAN[index].y, "--r": FAN[index].r, "--depth": index - 2, zIndex: index === 2 ? 3 : 2 - Math.abs(index - 2) } as CSSProperties}
          >
            <Flag locale={locale} className="h-3 w-[18px]" />
            <div className="hero-card-board">
              <DemoBoard rows={rows(locale)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
