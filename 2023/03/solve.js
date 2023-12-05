const fs = require('fs')

const example = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

let gearLocations = {}

const countGears = (adj, part, input) => {
  for (const [y, x] of adj) {
    if (input[y]?.[x] === '*') {
      gearLocations[`${y}:${x}`] = [...(gearLocations[`${y}:${x}`] || []), Number(part)]
    }
  }
}

const countEnginePart = (input, part, row) => {
  const number = part[0]
  const column = part.index
  const line = part.input
  const adjacents = [
    [row, column - 1], // left
    [row, column + number.length], // right
    ...Array.from(number).map((_, i) => [row - 1, column + i]), // up
    ...Array.from(number).map((_, i) => [row + 1, column + i]), // down
    [row - 1, column - 1], // up-left
    [row - 1, column + number.length], // up-right
    [row + 1, column - 1], // down-left
    [row + 1, column + number.length], // down-right
  ]
  countGears(adjacents, number, input)
  return adjacents.every(([y, x]) => '.1234567890'.includes(input[y]?.[x] ?? '.')) ? 0 : Number(number)
}

const countEngineParts = (input, line, index) => {
  const parts = [...line.matchAll(/\d+/g)]
  return parts.reduce((total, part) => {
    return total + countEnginePart(input, part, index)
  }, 0)
}

const part1 = (input) => {
  gearLocations = {}
  return input.reduce((total, line, index) => {
    return total + countEngineParts(input, line, index)
  }, 0)
}

const part2 = (input) => {
  part1(input)
  return Object.values(gearLocations).reduce((total, gear) => {
    return gear.length === 2 ? total + (gear[0] * gear[1]) : total
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
