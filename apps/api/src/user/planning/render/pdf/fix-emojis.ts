import type { Content } from "pdfmake/interfaces";

const EMOJI_REGEX =
  // eslint-disable-next-line security/detect-unsafe-regex
  /(\p{Extended_Pictographic}(\u200d\p{Extended_Pictographic})*)+/gu;

export function fixEmojis(content: Content, emojiFont = "NotoEmoji"): Content {
  if (typeof content === "string")
    return splitTextWithEmojis(content, emojiFont);
  if (typeof content === "number") return content;
  if (Array.isArray(content))
    return content.map((item) => fixEmojis(item, emojiFont));

  const textProps = ["text", "stack", "ul", "ol", "table", "columns"];
  textProps.forEach((prop) => {
    if (prop in content)
      content[`${prop}`] = fixEmojis(content[`${prop}`], emojiFont);
  });

  return content;
}

export function splitTextWithEmojis(text: string, font: string): Content {
  const parts: Content[] = [];
  let lastIndex = 0;
  const regex = new RegExp(EMOJI_REGEX);

  let match: RegExpExecArray;
  while ((match = regex.exec(text)) !== null) {
    const [emoji] = match;
    const index = match.index;

    if (index > lastIndex) parts.push(text.slice(lastIndex, index));
    parts.push({ text: emoji, font });

    lastIndex = index + emoji.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts.length === 1 ? parts[0] : parts;
}
