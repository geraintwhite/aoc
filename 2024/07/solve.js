const fs = require('fs')

const example = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const findSum = (target, [first, ...values], operators) => {
  let sums = [first]
  for (const value of values) {
    const newSums = []
    for (const operator of Object.values(operators)) {
      for (const sum of sums) {
        newSums.push(operator(sum, value))
      }
    }
    sums = [...newSums]
  }
  return sums.includes(target) ? target : 0
}

const part1 = (input) => {
  const operators = {
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
  }
  return input.reduce((total, row) => {
    const [target, values] = row.split(': ')
    return total + findSum(Number(target), values.split(' ').map(Number), operators)
  }, 0)
}

const part2 = (input) => {
  const operators = {
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
    '||': (a, b) => Number(`${a}${b}`),
  }
  return input.reduce((total, row) => {
    const [target, values] = row.split(': ')
    return total + findSum(Number(target), values.split(' ').map(Number), operators)
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
