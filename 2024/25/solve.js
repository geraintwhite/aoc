const fs = require('fs')

const example = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const processBlock = (input) => {
  const entry = [-1,-1,-1,-1,-1]
  while (input[0]?.length) {
    const row = input.shift()
    for (let i = 0; i < entry.length; i++) {
      entry[i] += row[i] === '#' ? 1 : 0
    }
  }
  return entry
}

const process = (input) => {
  const keys = [], locks = []
  while (input.length) {
    if (!input[0].length) input.shift()
    if (input[0]?.match(/^#+$/)) locks.push(processBlock(input))
    if (input[0]?.match(/^\.+$/)) keys.push(processBlock(input))
  }
  return { keys, locks }
}

const checkLocks = (keys, locks) => {
  let valid = 0
  for (const key of keys) {
    for (const lock of locks) {
      valid += key.every((k, i) => k + lock[i] <= 5) ? 1 : 0
    }
  }
  return valid
}

const part1 = (input) => {
  const { keys, locks } = process(input)
  return checkLocks(keys, locks)
}

const part2 = (input) => {
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
