const fs = require('fs')

const example = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const isAscending = (row) => {
  return row.every((x, i) => i === 0 || (row[i-1] < x && (x - row[i-1]) < 4))
}

const isSafe = (row) => {
  return isAscending(row) || isAscending([...row].reverse())
}

const getVariations = (row) => {
  return row.map((_, i) => [...row.slice(0, i), ...row.slice(i+1)])
}

const part1 = (input) => {
  return input.filter(row => isSafe(row.split(' ').map(Number))).length
}

const part2 = (input) => {
  return input.filter(row => getVariations(row.split(' ').map(Number)).some(test => isSafe(test))).length
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
