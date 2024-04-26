import { Boleto } from "./dist/index.cjs";
import { defaultArgs } from "./src/templates/Boleto/default-args";
import { describe, it, expect } from "vitest";

describe("Boleto Package Tests", () => {
  it("should be defined", () => {
    expect(Boleto.stories.default.args).toStrictEqual(defaultArgs);
  });
});
