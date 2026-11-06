import type { LetterFeedback } from "@/lib/game/types";

/**
 * Example boards for the help pages, drawn with the game's own tile styles, so they
 * match the real game in light, dark and high-contrast mode. Put them inside an
 * element with the demo-board class, which sets the tile size.
 */
export type DemoTileState = LetterFeedback | "typed" | "empty";
export type DemoRow = { word?: string; states?: DemoTileState[]; bonus?: boolean };

export const EMPTY_ROW: DemoRow = {};
export const BONUS_ROW: DemoRow = { bonus: true };

export function DemoBoard({ rows }: { rows: DemoRow[] }) {
  return (
    <div className="game-word">
      {rows.map((row, index) => (
        <div key={index} className="game-row flex">
          {Array.from({ length: 5 }, (_, position) => (
            <DemoTile
              key={position}
              letter={row.word ? [...row.word][position] : ""}
              state={row.states?.[position] ?? (row.word ? "typed" : "empty")}
              bonus={row.bonus}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DemoTile({ letter, state, bonus = false }: { letter: string; state: DemoTileState; bonus?: boolean }) {
  return (
    <div data-state={state} data-bonus={bonus} className="tile">
      <span>{letter}</span>
    </div>
  );
}
