const fs = require('fs')

const example = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const part1 = (input) => {
}

const part2 = (input) => {
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
