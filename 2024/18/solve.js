const fs = require('fs')

const example = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const directions = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
]

const getKey = ({ x, y }) => `${x},${y}`

const findShortestPath = (start, end, walls) => {
  let score = Infinity
  let queue = [{ x: start.x, y: start.y, s: 0 }]

  const scores = {}

  while (queue.length) {
    const newQueue = []

    for (const { x, y, s } of queue) {
      const key = getKey({ x, y })

      if (walls.includes(key) || x < start.x || y < start.y || x > end.x || y > end.y || scores[key]) {
        continue
      }

      scores[key] = s

      if (x === end.x && y === end.y) {
        score = Math.min(score, s)
        continue
      }

      for (const { dx, dy } of directions) {
        newQueue.push({ x: x + dx, y: y + dy, s: s + 1 })
      }
    }

    queue = newQueue
  }

  return score
}

const part1 = (input, size, bytes) => {
  const coords = input.slice(0, bytes)

  return findShortestPath({ x: 0, y: 0 }, { x: size, y: size }, coords)
}

const part2 = (input, size, bytes) => {
  for (let i = input.length; i > bytes; i--) {
    const coords = input.slice(0, i)
    const path = findShortestPath({ x: 0, y: 0 }, { x: size, y: size }, coords)
    if (path < Infinity) return input[i]
  }
}

console.log('\nPart 1\n')

console.log(part1(example, 6, 12))
console.log(part1(getInput(), 70, 1024))

console.log('\nPart 2\n')

console.log(part2(example, 6, 12))
console.log(part2(getInput(), 70, 1024))
