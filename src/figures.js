
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
  ]
});
