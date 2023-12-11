const fs = require('fs')

const example = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`.split('\n')

const expand = (grid) => {
  return grid.reduce((acc, line) => {
    return line.includes('#') ? [...acc, line] : [...acc, line, line]
  }, [])
}

const transpose = (grid) => {
  return grid[0].split('').map((_, x) => grid.map((l) => l[x]).join(''));
}

const pairs = (arr) => {
  return arr.flatMap((v, i) => arr.flatMap((w, j) => i > j ? [[v, w]] : []))
}

const manhattan = ([a, b]) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

const expandUniverse = (grid) => {
  return transpose(expand(transpose(expand(grid))))
}

const getGalaxies = (universe) => {
  const galaxies = []
  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[y].length; x++) {
      if (universe[y][x] === '#') galaxies.push({ x, y })
    }
  }
  return galaxies
}

const getExpansion = (input) => {
  const cols = []
  const rows = []
  for (let row = 0; row < input.length; row++) {
    if (!input[row].includes('#')) rows.push(row)
  }
  for (let col = 0; col < input[0].length; col++) {
    if (!input.map((_, i) => input[i][col]).join('').includes('#')) cols.push(col)
  }
  return { cols, rows }
}

const expandedDistance = ([a, b], { rows, cols }, mul) => {
  let distance = manhattan([a, b])
  for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y++) {
    if (rows.includes(y)) distance += mul - 1
  }
  for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x++) {
    if (cols.includes(x)) distance += mul - 1
  }
  return distance
}

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const part1 = (input) => {
  const universe = expandUniverse(input)
  const galaxies = getGalaxies(universe)
  return pairs(galaxies).reduce((acc, pair) => acc + manhattan(pair), 0)
}

const part2 = (input, mul) => {
  const expansion = getExpansion(input)
  const galaxies = getGalaxies(input)
  return pairs(galaxies).reduce((acc, pair) => acc + expandedDistance(pair, expansion, mul), 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example, 10))
console.log(part2(example, 100))
console.log(part2(getInput(), 1000000))
