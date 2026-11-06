"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { DemoBoard, EMPTY_ROW, type DemoRow } from "@/components/demo-board";
import { Flag } from "@/components/flag";
import type { Locale } from "@/i18n/config";
import { HOW_TO_PLAY_EXAMPLES, TIP_EXAMPLES } from "@/lib/game/examples";
import { computeFeedback } from "@/lib/game/feedback";

/**
 * Five example games fanned out like cards, rising from the bottom edge of the home
 * page. The fan leans gently towards the cursor. Decorative only, so it's hidden from
 * screen readers, and it stays still for people who prefer reduced motion (see
 * .hero-card in globals.css).
 *
 * Every board is a real game in its language, scored by the game's own rules.
 */
const CARDS: { locale: Locale; rows: DemoRow[] }[] = [
  { locale: "fr", rows: game(TIP_EXAMPLES.fr.answer, [TIP_EXAMPLES.fr.weak, TIP_EXAMPLES.fr.explore]) },
  { locale: "de", rows: howToPlayGame("de") },
  { locale: "en", rows: howToPlayGame("en") },
  {
    locale: "nl",
    rows: game(TIP_EXAMPLES.nl.answer, [TIP_EXAMPLES.nl.weak, TIP_EXAMPLES.nl.explore, TIP_EXAMPLES.nl.mover, TIP_EXAMPLES.nl.answer]),
  },
  { locale: "es", rows: game(TIP_EXAMPLES.es.answer, [TIP_EXAMPLES.es.explore, TIP_EXAMPLES.es.answer]) },
];

/** Where each card sits in the fan, from left to right: sideways offset, drop and tilt. */
const FAN = [
  { x: -150, y: 26, r: -22 },
  { x: -78, y: 6, r: -11 },
  { x: 0, y: 0, r: 0 },
  { x: 78, y: 6, r: 11 },
  { x: 150, y: 26, r: 22 },
];

/**
 * The chosen layout, as tuned in a dev panel: the fan's box, centered on the bottom edge,
 * scaled up, with only part of it showing above the edge. Arc scales the tilt, height
 * the steps between cards, and spacing the gaps.
 */
const LAYOUT = { size: 1.75, arc: 1.35, spacing: 0.75, height: 2, visible: 0.35 };
const BOX = { width: 480, height: 260 };

function game(answer: string, guesses: string[]): DemoRow[] {
  const rows: DemoRow[] = guesses.map((word) => ({ word, states: computeFeedback(word, answer) }));
  while (rows.length < 6) rows.push(EMPTY_ROW);
  return rows;
}

function howToPlayGame(locale: Locale): DemoRow[] {
  const { first, second, answer } = HOW_TO_PLAY_EXAMPLES[locale];
  return game(answer, [first, second, answer]);
}

export function HeroFan() {
  const fan = useRef<HTMLDivElement>(null);

  // The page content sits on top of the fan, so follow the cursor across the whole window.
  useEffect(() => {
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const mx = (event.clientX / innerWidth) * 2 - 1;
      const my = (event.clientY / innerHeight) * 2 - 1;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        fan.current?.style.setProperty("--mx", mx.toFixed(3));
        fan.current?.style.setProperty("--my", my.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Pushes the box below the edge so that only `visible` of it shows.
  const drop = (1 - LAYOUT.visible) * BOX.height;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={fan}
        className="hero-fan"
        style={
          {
            "--arc": LAYOUT.arc,
            "--spacing": LAYOUT.spacing,
            "--height": LAYOUT.height,
            left: "50%",
            bottom: 0,
            width: BOX.width,
            height: BOX.height,
            transformOrigin: "50% 100%",
            transform: `translateX(-50%) translateY(${drop}px) scale(${LAYOUT.size})`,
          } as CSSProperties
        }
      >
        {CARDS.map(({ locale, rows }, index) => (
          <div
            key={locale}
            className="hero-card"
            style={
              {
                "--x": FAN[index].x,
                "--y": FAN[index].y,
                "--r": FAN[index].r,
                "--depth": index - 2,
                "--order": Math.abs(index - 2),
                zIndex: index === 2 ? 3 : 2 - Math.abs(index - 2),
              } as CSSProperties
            }
          >
            <Flag locale={locale} className="h-3 w-[18px]" />
            <div className="hero-card-board">
              <DemoBoard rows={rows} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
