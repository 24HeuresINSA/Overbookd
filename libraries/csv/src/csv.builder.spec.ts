import { describe, it, expect } from "vitest";
import { CSVBuilder } from "./csv.builder";

describe("CSVBuilder", () => {
  describe("when data is empty", () => {
    it("returns an empty string", () => {
      const csv = CSVBuilder.from([]).build();
      expect(csv).toBe("");
    });
  });

  describe("when data is not empty", () => {
    it("should return a CSV string", () => {
      const data = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
      ];
      const csv = CSVBuilder.from(data).build();
      expect(csv).toBe("id,name,age\n1,John Doe,30\n2,Jane Smith,25");
    });

    describe.each`
      type           | data                                     | expected
      ${"string"}    | ${[{ id: 1, name: "John Doe" }]}         | ${"id,name\n1,John Doe"}
      ${"number"}    | ${[{ id: 1, name: 30 }]}                 | ${"id,name\n1,30"}
      ${"boolean"}   | ${[{ id: 1, name: true }]}               | ${"id,name\n1,true"}
      ${"null"}      | ${[{ id: 1, name: null }]}               | ${"id,name\n1,"}
      ${"undefined"} | ${[{ id: 1, name: undefined }]}          | ${"id,name\n1,"}
      ${"undefined"} | ${[{ id: 1, name: undefined, age: 30 }]} | ${"id,name,age\n1,,30"}
    `("when data contains a $type value", ({ data, expected }) => {
      it("should handle the value correctly", () => {
        const csv = CSVBuilder.from(data).build();
        expect(csv).toBe(expected);
      });
    });

    describe.each`
      character            | data                                | expected
      ${"comma"}           | ${[{ id: 1, name: "John, Doe" }]}   | ${'id,name\n1,"John, Doe"'}
      ${"newline"}         | ${[{ id: 1, name: "John\nDoe" }]}   | ${'id,name\n1,"John\nDoe"'}
      ${"carriage return"} | ${[{ id: 1, name: "John\rDoe" }]}   | ${'id,name\n1,"John\rDoe"'}
      ${"double quote"}    | ${[{ id: 1, name: 'John "Doe"' }]}  | ${'id,name\n1,"John ""Doe"""'}
      ${"backslash"}       | ${[{ id: 1, name: "John \\ Doe" }]} | ${'id,name\n1,"John \\ Doe"'}
    `("when data contains a $character", ({ data, expected }) => {
      it("should escape the value with double quotes", () => {
        const csv = CSVBuilder.from(data).build();
        expect(csv).toBe(expected);
      });
    });

    describe("when headers are provided", () => {
      it("should use the provided headers", () => {
        const data = [
          { id: 1, name: "John Doe", age: 30 },
          { id: 2, name: "Jane Smith", age: 25 },
        ];
        const csv = CSVBuilder.from(data).select(["age", "name"]).build();
        expect(csv).toBe("age,name\n30,John Doe\n25,Jane Smith");
      });
      describe("when headers are translated", () => {
        it("should use translation", () => {
          const data = [
            { id: 1, name: "John Doe", age: 30 },
            { id: 2, name: "Jane Smith", age: 25 },
          ];
          const csv = CSVBuilder.from(data)
            .select(["age", "name"])
            .translate([["name", "nom"]])
            .build();

          expect(csv).toBe("age,nom\n30,John Doe\n25,Jane Smith");
        });
      });
    });

    describe("when delimiter is provided", () => {
      it("should use the custom delimiter", () => {
        const data = [
          { id: 1, name: "John Doe", age: 30 },
          { id: 2, name: "Jane Smith", age: 25 },
        ];
        const csv = CSVBuilder.from(data).delimitWith(";").build();
        expect(csv).toBe("id;name;age\n1;John Doe;30\n2;Jane Smith;25");
      });

      describe("when data contains the delimiter", () => {
        it("should escape the value with double quotes", () => {
          const data = [
            { id: 1, name: "John; Doe" },
            { id: 2, name: "Jane; Smith" },
          ];
          const csv = CSVBuilder.from(data).delimitWith(";").build();
          expect(csv).toBe('id;name\n1;"John; Doe"\n2;"Jane; Smith"');
        });
      });
    });
  });
  describe("when data has nested objects", () => {
    it("should flatten the data", () => {
      const data = [
        { id: 1, civil: { firstName: "John", lastName: "Doe" }, age: 30 },
        { id: 2, civil: { firstName: "Jane", lastName: "Smith" }, age: 25 },
      ];
      const csv = CSVBuilder.from(data).build();
      expect(csv).toBe(
        "id,civil.firstName,civil.lastName,age\n1,John,Doe,30\n2,Jane,Smith,25",
      );
    });
  });
  describe("when manipulating realistic data for signage", () => {
    it("should generate a CSV with the right headers and data", () => {
      const data = [
        {
          preview: { id: 1, name: "Test", status: "DRAFT" },
          signage: { quantity: 2, text: "Test", size: "XL" },
        },
        {
          preview: { id: 1, name: "Test", status: "DRAFT" },
          signage: {
            quantity: 10,
            text: "Small indication",
            size: "S",
            comment: "Attention",
          },
        },
        {
          preview: { id: 2, name: "Nearly done", status: "IN REVIEW" },
          signage: { quantity: 1, text: "Here", size: "XL", comment: "Test" },
        },
      ];
      expect(
        CSVBuilder.from(data)
          .select([
            "preview.status",
            "signage.size",
            "signage.text",
            "signage.quantity",
          ])
          .translate([
            ["preview.status", "task status"],
            ["signage.size", "size"],
            ["signage.text", "text"],
            ["signage.quantity", "quantity"],
          ])
          .build(),
      ).toBe(
        "task status,size,text,quantity\nDRAFT,XL,Test,2\nDRAFT,S,Small indication,10\nIN REVIEW,XL,Here,1",
      );
    });
  });
});
