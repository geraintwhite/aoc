const fs = require('fs')

const example = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`.split('\n')

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

const getKey = ({ x, y, d = 0 }) => `${y}-${x}-${d}`

const getLowestScore = (input) => {
  const startY = input.findIndex((line) => line.includes('S'))
  const startX = input[startY].indexOf('S')

  let score = Infinity
  let queue = [{ x: startX, y: startY, s: 0 }]

  const scores = {}

  while (queue.length) {
    const newQueue = []

    for (const { x, y, d, s, p } of queue) {
      if (input[y][x] === '#' || scores[getKey({ x, y })] < s) continue
      scores[getKey({ x, y, d })] = s

      if (input[y][x] === 'E') {
        score = Math.min(score, s)
        continue
      }

      const dirs = [d, (d + 1) % 4, (d + 3) % 4]
      for (const { dx, dy } of directions) {
        newQueue.push({ x: x + dx, y: y + dy, s: s + 1 })
      }
    }

    queue = newQueue
  }

  return { score }
}

const part1 = (input, saving) => {
  const { score: base } = getLowestScore(input)
  const scores = []
  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input[y].length - 1; x++) {
      if (input[y][x] !== '#') continue
      const newInput = input.slice()
      newInput[y] = input[y].substring(0, x) + '.' + input[y].substring(x + 1)
      const { score } = getLowestScore(newInput)
      scores.push(score)
    }
  }
  return scores.filter((s) => base - s >= saving).length
}

const part2 = (input) => {
}

console.log('\nPart 1\n')

console.log(part1(example, 20))
console.log(part1(getInput(), 100))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
