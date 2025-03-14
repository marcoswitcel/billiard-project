
/**
 * 
 * @returns {{ points: any[][], lineSegments: number[][], }}
 */
export const triangleShape = () => ({
  points: [
    [0, -1],
    [1, 1],
    [-1, 1],
  ],
  lineSegments: [
    [0,1],
    [1,2],
    [2,0]
  ]
});


export const squareShape = () => ({
  points: [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ],
  lineSegments: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ]
});

export const table01Shape = () => ({
  points: [
    [-0.9, -0.5],
    [0.9, -0.5],
    [0.9, 0.5],
    [-0.9, 0.5],
    // borda 1 (b1)
    [-0.9, -0.4],
    [-0.8, -0.3],
    [-0.8, 0.3],
    [-0.9, 0.4],
    // borda 4 (b4)
    [0.9, -0.4],
    [0.8, -0.3],
    [0.8, 0.3],
    [0.9, 0.4],
    // borda 2 (b2)
    [-0.8, -0.5],
    [-0.7, -0.4],
    [-0.15, -0.4],
    [-0.05, -0.5],
    // borda 6 (b6)
    [-0.8, 0.5],
    [-0.7, 0.4],
    [-0.15, 0.4],
    [-0.05, 0.5],
    // borda 3 (b3)
    [0.8, -0.5],
    [0.7, -0.4],
    [0.15, -0.4],
    [0.05, -0.5],
    // borda 5 (b5)
    [0.8, 0.5],
    [0.7, 0.4],
    [0.15, 0.4],
    [0.05, 0.5],
  ],
  lineSegments: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // borda 1 (b1)
    [4, 5],
    [5, 6],
    [6, 7],
    // borda 4 (b4)
    [8, 9],
    [9, 10],
    [10, 11],
    // borda 2 (b2)
    [12, 13],
    [13, 14],
    [14, 15],
    // borda 6 (b6)
    [16, 17],
    [17, 18],
    [18, 19],
    // borda 3 (b3)
    [20, 21],
    [21, 22],
    [22, 23],
    // borda 5 (b5)
    [24, 25],
    [25, 26],
    [26, 27],
  ]
});

export const tableBordersPolygonShape = () => ({
  polygons: [
    // borda 1 (b1)
    [
      [-0.9, -0.4],
      [-0.8, -0.3],
      [-0.8, 0.3],
      [-0.9, 0.4],
    ],
    // borda 4 (b4)
    [
      [0.9, -0.4],
      [0.8, -0.3],
      [0.8, 0.3],
      [0.9, 0.4],
    ],
    // borda 2 (b2)
    [
      [-0.8, -0.5],
      [-0.7, -0.4],
      [-0.15, -0.4],
      [-0.05, -0.5],
    ],
    // borda 6 (b6)
    [
      [-0.8, 0.5],
      [-0.7, 0.4],
      [-0.15, 0.4],
      [-0.05, 0.5],
    ],
    // borda 3 (b3)
    [
      [0.8, -0.5],
      [0.7, -0.4],
      [0.15, -0.4],
      [0.05, -0.5],
    ],
    // borda 5 (b5)
    [
      [0.8, 0.5],
      [0.7, 0.4],
      [0.15, 0.4],
      [0.05, 0.5],
    ],
  ]
});
