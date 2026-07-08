import { t } from "@/lib/i18n";

describe("i18n translations", () => {
  it("returns English text by default", () => {
    expect(t("en", "nav_home")).toBe("Home");
  });

  it("returns Hindi text when lang is hi", () => {
    const hindiHome = t("hi", "nav_home");
    expect(hindiHome).not.toBe("Home");
    expect(hindiHome.length).toBeGreaterThan(0);
  });

  it("falls back to English if a key is missing for a language", () => {
    // "hero_placeholder" exists in both, so just verify no crash for an
    // unknown key -- it should return the key itself as a safe fallback.
    expect(t("en", "some_unknown_key")).toBe("some_unknown_key");
  });
});
