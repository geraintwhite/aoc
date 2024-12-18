const fs = require('fs')

const example = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`.split('\n')

const example2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`.split('\n')

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
  let queue = [{
    x: startX,
    y: startY,
    d: 1,
    s: 0,
    p: '',
  }]

  const scores = {}
  const paths = {}

  while (queue.length) {
    const newQueue = []

    for (const { x, y, d, s, p } of queue) {
      if (input[y][x] === '#' || scores[getKey({ x, y, d })] < s) continue
      scores[getKey({ x, y, d })] = s

      if (input[y][x] === 'E') {
        paths[s] = [...paths[s] || [], `${p}${getKey({ x, y })}`]
        score = Math.min(score, s)
        continue
      }

      const dirs = [d, (d + 1) % 4, (d + 3) % 4]
      for (const dir of dirs) {
        const { dx, dy } = directions[dir]
        newQueue.push({
          x: x + dx,
          y: y + dy,
          d: dir, 
          s: s + (dir === d ? 1 : 1001),
          p: `${p}${getKey({ x, y })}|`
        })
      }
    }

    queue = newQueue
  }

  return { score, paths: paths[score] }
}

const part1 = (input) => {
  const { score } = getLowestScore(input)
  return score
}

const part2 = (input) => {
  const { paths } = getLowestScore(input)
  return new Set(paths.reduce((arr, path) => [...arr, ...path.split('|')], [])).size
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(example2))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(example2))
console.log(part2(getInput()))
