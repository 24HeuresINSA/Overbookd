import { Content } from "pdfmake/interfaces";
import { describe, expect, it } from "vitest";
import { fixEmojis, splitTextWithEmojis } from "./fix-emojis";

const font = "NotoEmoji";

const SOME_TEXT_WITHOUT_EMOJIS =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
const SOME_TEXT_WITH_EMOJIS =
  "Lorem ipsum dolor sit amet 😎, consectetur adipiscing elit 🤯👨‍👩‍👧‍👦, sed do eiusmod tempor incididunt 😇 ut labore et dolore magna aliqua 🤫🧏";
const textWithEmojisSplit: Content = [
  "Lorem ipsum dolor sit amet ",
  { text: "😎", font },
  ", consectetur adipiscing elit ",
  { text: "🤯👨‍👩‍👧‍👦", font },
  ", sed do eiusmod tempor incididunt ",
  { text: "😇", font },
  " ut labore et dolore magna aliqua ",
  { text: "🤫🧏", font },
];

const someContentWithoutEmojis: Content = [
  { text: "Lorem ipsum dolor sit amet, " },
  { stack: ["consectetur ", "adipiscing ", "elit, "] },
  {
    ul: [
      "sed do eiusmod tempor ",
      "incididunt ut labore et dolore magna aliqua",
    ],
  },
];
const someContentWithEmojis: Content = [
  { text: "Lorem ipsum dolor sit amet 😎, " },
  { stack: ["consectetur ", "🤫🧏", "adipiscing ", "elit, "] },
  {
    ul: [
      "sed do eiusmod 😇 tempor ",
      "incididunt ut labore et dolore magna aliqua",
      "🤯",
    ],
  },
];
const contentWithEmojisSplit: Content = [
  { text: ["Lorem ipsum dolor sit amet ", { text: "😎", font }, ", "] },
  { stack: ["consectetur ", { text: "🤫🧏", font }, "adipiscing ", "elit, "] },
  {
    ul: [
      ["sed do eiusmod ", { text: "😇", font }, " tempor "],
      "incididunt ut labore et dolore magna aliqua",
      { text: "🤯", font },
    ],
  },
];

describe("FixEmojis", () => {
  describe("split emojis in a text", () => {
    describe("when there are no emojis in the text", () => {
      it("should do nothing", () => {
        const splitText = splitTextWithEmojis(SOME_TEXT_WITHOUT_EMOJIS, font);
        expect(splitText).toStrictEqual(SOME_TEXT_WITHOUT_EMOJIS);
      });
    });
    describe("when there are emojis in the text", () => {
      it("should split the text accordingly", () => {
        const splitText = splitTextWithEmojis(SOME_TEXT_WITH_EMOJIS, font);
        expect(splitText).toStrictEqual(textWithEmojisSplit);
      });
    });
  });
  describe("fix emojis in pdfmake content", () => {
    describe("when there are no emojis in the text", () => {
      it("should do nothing", () => {
        const splitContent = fixEmojis(SOME_TEXT_WITHOUT_EMOJIS, font);
        expect(splitContent).toStrictEqual(SOME_TEXT_WITHOUT_EMOJIS);
      });
    });
    describe("when there are no emojis in the content", () => {
      it("should do nothing", () => {
        const splitContent = fixEmojis(someContentWithoutEmojis, font);
        expect(splitContent).toStrictEqual(someContentWithoutEmojis);
      });
    });
    describe("when there are emojis in the text", () => {
      it("should split the text accordingly", () => {
        const splitContent = fixEmojis(SOME_TEXT_WITH_EMOJIS, font);
        expect(splitContent).toStrictEqual(textWithEmojisSplit);
      });
    });
    describe("when there are emojis in the content", () => {
      it("should split the texts accordingly", () => {
        const splitContent = fixEmojis(someContentWithEmojis, font);
        expect(splitContent).toStrictEqual(contentWithEmojisSplit);
      });
    });
  });
});
