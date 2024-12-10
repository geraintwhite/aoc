const fs = require('fs')

const example = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const dirs = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
]

const countPaths = (input, { x, y }, visited) => {
  if (input[y]?.[x] === '9') {
    if (visited?.includes(`${y}-${x}`)) return 0
    visited?.push(`${y}-${x}`)
    return 1
  }
  return dirs.reduce((paths, { dx, dy }) => {
    if (Number(input[y + dy]?.[x + dx]) - Number(input[y][x]) === 1) {
      return paths + countPaths(input, { x: x + dx, y: y + dy }, visited)
    }
    return paths
  }, 0)
}

const part1 = (input) => {
  return input.reduce((total, row, y) => {
    return total + row.split('').reduce((t, c, x) => {
      return t + (c === '0' ? countPaths(input, { y, x }, []) : 0)
    }, 0)
  }, 0)
}

const part2 = (input) => {
  return input.reduce((total, row, y) => {
    return total + row.split('').reduce((t, c, x) => {
      return t + (c === '0' ? countPaths(input, { y, x }) : 0)
    }, 0)
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
