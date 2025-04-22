import { describe, it, expect } from "vitest";
import { CSVBuilder, CSVBuilderB, HEADERS_ERROR_MESSAGE } from "./csv.builder";

describe("CSVBuilder bis", () => {
  describe("when data is empty", () => {
    it("returns an empty string", () => {
      const csv = CSVBuilderB.from([]).build();
      expect(csv).toBe("");
    });
  });

  describe("when data is not empty", () => {
    it("should return a CSV string", () => {
      const data = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
      ];
      const csv = CSVBuilderB.from(data).build();
      expect(csv).toBe("id,name,age\n1,John Doe,30\n2,Jane Smith,25");
    });

    describe.each`
      type           | data                             | expected
      ${"string"}    | ${[{ id: 1, name: "John Doe" }]} | ${"id,name\n1,John Doe"}
      ${"number"}    | ${[{ id: 1, name: 30 }]}         | ${"id,name\n1,30"}
      ${"boolean"}   | ${[{ id: 1, name: true }]}       | ${"id,name\n1,true"}
      ${"null"}      | ${[{ id: 1, name: null }]}       | ${"id,name\n1,"}
      ${"undefined"} | ${[{ id: 1, name: undefined }]}  | ${"id,name\n1,"}
    `("when data contains a $type value", ({ data, expected }) => {
      it("should handle the value correctly", () => {
        const csv = CSVBuilderB.from(data).build();
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
        const csv = CSVBuilderB.from(data).build();
        expect(csv).toBe(expected);
      });
    });

    describe("when headers are provided", () => {
      it("should use the provided headers", () => {
        const data = [
          { id: 1, name: "John Doe", age: 30 },
          { id: 2, name: "Jane Smith", age: 25 },
        ];
        const csv = CSVBuilderB.from(data).select(["age", "name"]).build();
        expect(csv).toBe("age,name\n30,John Doe\n25,Jane Smith");
      });
      describe("when headers are translated", () => {
        it("should use translation", () => {
          const data = [
            { id: 1, name: "John Doe", age: 30 },
            { id: 2, name: "Jane Smith", age: 25 },
          ];
          const csv = CSVBuilderB.from(data)
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
        const csv = CSVBuilderB.from(data).delimitWith(";").build();
        expect(csv).toBe("id;name;age\n1;John Doe;30\n2;Jane Smith;25");
      });

      describe("when data contains the delimiter", () => {
        it("should escape the value with double quotes", () => {
          const data = [
            { id: 1, name: "John; Doe" },
            { id: 2, name: "Jane; Smith" },
          ];
          const csv = CSVBuilderB.from(data).delimitWith(";").build();
          expect(csv).toBe('id;name\n1;"John; Doe"\n2;"Jane; Smith"');
        });
      });
    });
  });
});

describe("CSVBuilder", () => {
  describe("when data is empty", () => {
    it("returns an empty string", () => {
      const csv = new CSVBuilder().build();
      expect(csv).toBe("");
    });
  });

  describe("when data is not empty", () => {
    it("should return a CSV string", () => {
      const data = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
      ];
      const csv = new CSVBuilder().withData(data).build();
      expect(csv).toBe("id,name,age\n1,John Doe,30\n2,Jane Smith,25");
    });

    describe.each`
      type           | data                             | expected
      ${"string"}    | ${[{ id: 1, name: "John Doe" }]} | ${"id,name\n1,John Doe"}
      ${"number"}    | ${[{ id: 1, name: 30 }]}         | ${"id,name\n1,30"}
      ${"boolean"}   | ${[{ id: 1, name: true }]}       | ${"id,name\n1,true"}
      ${"null"}      | ${[{ id: 1, name: null }]}       | ${"id,name\n1,"}
      ${"undefined"} | ${[{ id: 1, name: undefined }]}  | ${"id,name\n1,"}
    `("when data contains a $type value", ({ data, expected }) => {
      it("should handle the value correctly", () => {
        const csv = new CSVBuilder().withData(data).build();
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
        const csv = new CSVBuilder().withData(data).build();
        expect(csv).toBe(expected);
      });
    });
  });

  describe("when headers are provided", () => {
    it("should use the provided headers", () => {
      const data = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
      ];
      const csv = new CSVBuilder()
        .withData(data)
        .withHeaders(["id", "age", "name"])
        .build();
      expect(csv).toBe("id,age,name\n1,30,John Doe\n2,25,Jane Smith");
    });
  });

  describe("when delimiter is provided", () => {
    it("should use the custom delimiter", () => {
      const data = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
      ];
      const csv = new CSVBuilder().withData(data).withDelimiter(";").build();
      expect(csv).toBe("id;name;age\n1;John Doe;30\n2;Jane Smith;25");
    });

    describe("when data contains the delimiter", () => {
      it("should escape the value with double quotes", () => {
        const data = [
          { id: 1, name: "John; Doe" },
          { id: 2, name: "Jane; Smith" },
        ];
        const csv = new CSVBuilder().withData(data).withDelimiter(";").build();
        expect(csv).toBe('id;name\n1;"John; Doe"\n2;"Jane; Smith"');
      });
    });
  });

  describe("when headers and data columns don't match", () => {
    it("should indicate that the number of columns in data doesn't match the number of headers", () => {
      const data = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith" },
      ];
      const csv = new CSVBuilder()
        .withData(data)
        .withHeaders(["id", "name", "age"]);
      expect(() => csv.build()).toThrowError(HEADERS_ERROR_MESSAGE);
    });

    it("should indicate that there are more columns in data than in headers", () => {
      const data = [
        { id: 1, name: "John Doe", age: 30, extra: "extra data" },
        { id: 2, name: "Jane Smith", age: 25, extra: "extra data" },
      ];
      const csv = new CSVBuilder().withData(data).withHeaders(["id", "name"]);
      expect(() => csv.build()).toThrowError(HEADERS_ERROR_MESSAGE);
    });
  });
});
