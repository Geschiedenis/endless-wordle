import { describe, expect, it } from "vitest";
import { findUsernameProblem, normalizeUsername } from "./username";

describe("findUsernameProblem", () => {
  it.each(["abc", "Player_1", "a".repeat(20), "___", "Zed99"])("accepts %s", (name) => {
    expect(findUsernameProblem(name)).toBeNull();
  });

  it.each([
    ["too short", "ab"],
    ["too long", "a".repeat(21)],
    ["empty", ""],
    ["a space", "john doe"],
    ["a hyphen", "john-doe"],
    ["an accent", "josé"],
    ["a Kelvin sign", "Kevin"],
    ["a trailing newline", "john\n"],
    ["markup", "<b>x</b>"],
  ])("rejects the format of %s", (_label, name) => {
    expect(findUsernameProblem(name)).toBe("format");
  });

  it.each(["admin", "ADMIN", "A_d_m_i_n", "adm1n", "Support", "wordle", "null"])(
    "rejects the reserved name %s",
    (name) => {
      expect(findUsernameProblem(name)).toBe("not_allowed");
    },
  );

  it.each(["shit", "xXshitXx", "sh1t_lord", "F_U_C_K", "pu55y"])(
    "rejects the offensive name %s",
    (name) => {
      expect(findUsernameProblem(name)).toBe("not_allowed");
    },
  );

  it("only reserves whole names, so longer ones stay available", () => {
    expect(findUsernameProblem("admiral")).toBeNull();
    expect(findUsernameProblem("rootbeer")).toBeNull();
  });
});

describe("normalizeUsername", () => {
  it("lowercases, drops underscores and maps lookalikes", () => {
    expect(normalizeUsername("A_d_M_1_n")).toBe("admin");
    expect(normalizeUsername("5h0ut")).toBe("shout");
  });
});
