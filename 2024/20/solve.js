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

const getKey = ({ x, y }) => `${y}-${x}`

const getLowestScore = (input) => {
  const startY = input.findIndex((line) => line.includes('S'))
  const startX = input[startY].indexOf('S')

  let score = Infinity
  let queue = [{ x: startX, y: startY, s: 0, p: [] }]

  const scores = {}
  const paths = []

  while (queue.length) {
    const newQueue = []

    for (const { x, y, s, p } of queue) {
      if (input[y][x] === '#' || scores[getKey({ x, y })] < s) continue
      scores[getKey({ x, y })] = s

      if (input[y][x] === 'E') {
        score = Math.min(score, s)
        paths.push([...p, { x, y }])
        continue
      }

      for (const { dx, dy } of directions) {
        newQueue.push({ x: x + dx, y: y + dy, s: s + 1, p: [...p, { x, y }] })
      }
    }

    queue = newQueue
  }

  return { score, paths }
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

const manhattan = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

const getShortcuts = (path, limit) => {
  const shortcuts = []
  for (let i = 0; i < path.length; i++) {
    for (let j = i + 1; j < path.length; j++) {
      const a = path[i], b = path[j]
      const dist = manhattan(a, b)
      if (dist <= limit) {
        shortcuts.push({ a, b, s: Math.abs(path.indexOf(a) - path.indexOf(b)) - dist })
      }
    }
  }
  return shortcuts
}

const part1b = (input, saving) => {
  const { paths } = getLowestScore(input)
  const shortcuts = getShortcuts(paths[0], 2)
  return shortcuts.filter(({ s }) => s >= saving).length
}

const part2 = (input, saving) => {
  const { paths } = getLowestScore(input)
  const shortcuts = getShortcuts(paths[0], 20)
  return shortcuts.filter(({ s }) => s >= saving).length
}

console.log('\nPart 1\n')

console.log(part1(example, 20))
console.log(part1b(getInput(), 100))

console.log('\nPart 2\n')

console.log(part2(example, 74))
console.log(part2(getInput(), 100))
