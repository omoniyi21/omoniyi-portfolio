// Observations topic marks. Add a topic here as new kinds of posts appear.
const TOPIC_ICONS = [
  [/culture/i, "culture"],
  [/ui kit|launchkit/i, "uikit"],
  [/remote|work/i, "remote"],
];

export function topicIcon(category = "") {
  return TOPIC_ICONS.find(([pattern]) => pattern.test(category))?.[1] ?? null;
}
