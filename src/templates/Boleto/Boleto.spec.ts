import { join } from "node:path";
import { comparePdfToSnapshot } from "pdf-visual-diff";
import { expect, describe, it } from "vitest";

describe("test pdf report visual regression", () => {
  const pathToPdf = join(__dirname, "..", "..", "..", "generated-pdfs", "Basic","default.pdf");
  const snapshotName = "single-page-snapshot";

  it("should pass", () =>
    comparePdfToSnapshot(pathToPdf, __dirname, snapshotName).then((x) =>
      expect(x).toBe(true)
    ));
});
