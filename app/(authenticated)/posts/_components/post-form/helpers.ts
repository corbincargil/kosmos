export const getReadingTime = (content: string) => {
  const words = content.split(/\s+/).filter(Boolean);
  const wpm = 200;
  const minutes = words.length / wpm;
  return Math.ceil(minutes);
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};