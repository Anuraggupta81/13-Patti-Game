/**
 * Responsive layout helpers. Sizes come from the real window width, so the
 * screens fit small and large phones and tablets.
 */

export const SCREEN_PADDING = 16;

export interface AvatarGridLayout {
  columns: number;
  /** Width of each grid cell, in dp. */
  cellWidth: number;
  /** Diameter of each avatar circle, in dp. */
  size: number;
}

/**
 * Chooses how many avatars fit across the screen. Each cell aims for about
 * 80 dp so names fit. Columns stay between 3 and 6.
 */
export function avatarGridLayout(windowWidth: number): AvatarGridLayout {
  const available = Math.max(0, windowWidth - SCREEN_PADDING * 2);
  const columns = Math.min(6, Math.max(3, Math.floor(available / 80)));
  const cellWidth = Math.floor(available / columns);
  const size = Math.min(72, cellWidth - 12);
  return { columns, cellWidth, size };
}
