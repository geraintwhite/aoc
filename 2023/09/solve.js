const fs = require('fs')

const example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const findNextValue = (numbers) => {
  let curr = [...numbers]
  const result = [numbers[numbers.length - 1]]
  while (!curr.every((x) => x === 0)) {
    curr = curr.slice(1).map((x, i) => x - curr[i])
    result.push(curr[curr.length - 1])
  }
  return result.reduce((a, x) => a + x)
}

const findFirstValue = (numbers) => {
  let curr = [...numbers]
  const result = [numbers[0]]
  while (!curr.every((x) => x === 0)) {
    curr = curr.slice(1).map((x, i) => x - curr[i])
    result.push(curr[0])
  }
  const reversed = result.slice().reverse()
  const output = reversed.reduce((a, x) => [...a, x - a[a.length - 1]], reversed.slice(0, 1))
  return output[output.length - 1]
}

const part1 = (input) => {
  return input.reduce((acc, line) => {
    return acc + findNextValue(line.split(' ').map(Number))
  }, 0)
}

const part2 = (input) => {
  return input.reduce((acc, line) => {
    return acc + findFirstValue(line.split(' ').map(Number))
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
