// Native pixel grid the room is laid out on. Matches the sprite sheets'
// 16x16 slice size, so one grid unit = one native pixel-art tile.
export const UNIT = 16
export const COLS = 20
export const ROWS = 12
export const SCALE = 3

export const NATIVE_WIDTH = COLS * UNIT
export const NATIVE_HEIGHT = ROWS * UNIT

// Rows counted from the top. Everything from FLOOR_ROW down is floor.
// 4 of 12 rows = 1/3 wall, 2/3 floor.
export const FLOOR_ROW = 4
