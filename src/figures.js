
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
    [-1, -0.6],
    [1, -0.6],
    [1, 0.6],
    [-1, 0.6],
  ],
  lineSegments: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ]
});
