import { describe, expect, it } from "vitest";
import { renderConfirmationEmail } from "./template";

describe("renderConfirmationEmail", () => {
  it("enthält den Bestätigungslink und keinen Abmelde-Link", () => {
    const url = "https://www.famvaya.com/newsletter/bestaetigen/abc";
    const html = renderConfirmationEmail({ confirmUrl: url });
    expect(html).toContain(`href="${url}"`);
    expect(html).toContain("Anmeldung bestätigen");
    expect(html).not.toContain("abbestellen");
  });
});
