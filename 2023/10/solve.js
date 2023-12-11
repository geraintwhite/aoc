const fs = require('fs')

const example = `.....
.S-7.
.|.|.
.L-J.
.....`.split('\n')

const example2 = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`.split('\n')

const example3 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`.split('\n')

const example4 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`.split('\n')

const example5 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`.split('\n')

let visited = []

const findStart = (grid) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'S') {
        return { x, y }
      }
    }
  }
}

const getDirections = (grid, { x, y }) => {
  const c = grid[y][x]
  if (c === '-') return [{ x: x + 1, y }, { x: x - 1, y }]
  if (c === '|') return [{ x, y: y + 1 }, { x, y: y - 1 }]
  if (c === 'L') return [{ x, y: y - 1 }, { x: x + 1, y }]
  if (c === 'J') return [{ x, y: y - 1 }, { x: x - 1, y }]
  if (c === '7') return [{ x, y: y + 1 }, { x: x - 1, y }]
  if (c === 'F') return [{ x, y: y + 1 }, { x: x + 1, y }]
  if (c === '.') return []
  if (c === 'S') return [{ x, y: y + 1 }, { x: x + 1, y }, { x, y: y - 1 }, { x: x - 1, y }]
}

const findFarthestPoint = ({ x, y }, grid) => {
  if (visited.includes(`${y}-${x}`) || !grid[y]?.[x]) return visited.length
  visited.push(`${y}-${x}`)
  const distances = []
  for (const direction of getDirections(grid, { x, y })) {
    distances.push(findFarthestPoint(direction, grid))
  }
  return Math.max(...distances, 0)
}

const findFarthestPointIterative = (start, grid) => {
  let curr = start
  let distance = 0
  while (true) {
    visited.push(`${curr.y}-${curr.x}`)
    let moved = false
    for (const direction of getDirections(grid, curr)) {
      if (!visited.includes(`${direction.y}-${direction.x}`) && (grid[direction.y]?.[direction.x] ?? '.') !== '.') {
        distance++
        curr = direction
        moved = true
      }
    }
    if (!moved) break
  }
  return distance
}

const getPointsInside = (grid) => {
  const points = []
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (visited.includes(`${y}-${x}`)) continue

      let crosses = 0
      let curr = { x, y }

      while (curr.x < grid[y].length && curr.y < grid.length) {
        if (visited.includes(`${curr.y}-${curr.x}`) && !'L7'.includes(grid[curr.y][curr.x])) {
          crosses++
        }
        curr.x++
        curr.y++
      }

      if (crosses % 2 === 1) {
        points.push({ x, y })
      }
    }
  }
  return points
}

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const part1 = (input) => {
  const { x, y } = findStart(input)
  visited = []
  return Math.floor(findFarthestPoint({ x, y }, input) / 2)
}

const part1b = (input) => {
  const { x, y } = findStart(input)
  visited = []
  return Math.floor(findFarthestPointIterative({ x, y }, input) / 2)
}

const part2 = (input) => {
  part1b(input)
  return getPointsInside(input).length
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(example2))
console.log(part1b(getInput()))

console.log('\nPart 2\n')

console.log(part2(example3))
console.log(part2(example4))
console.log(part2(example5))
console.log(part2(getInput()))
