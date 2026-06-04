export function getFriendImage(name: string): string {
  const nameWithoutAccents = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  try {
    return new URL(`../assets/${nameWithoutAccents}.png`, import.meta.url).href;
  } catch {
    // Fallback to a placeholder if image doesn't exist
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nameWithoutAccents
    )}&size=400&background=667eea&color=fff&bold=true`;
  }
}
