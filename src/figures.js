
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
