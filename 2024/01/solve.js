const fs = require('fs')

const example = `3   4
4   3
2   5
1   3
3   9
3   3`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getLists = (input) => {
  return input.reduce(([a, b], line) => {
    const [x, y] = line.split(/\s+/).map(Number)
    return [[...a, x], [...b, y]]
  }, [[], []])
}

const part1 = (input) => {
  const lists = getLists(input)
  lists.forEach(l => l.sort())
  return lists[0].reduce((total, n, i) => total + Math.abs(n - lists[1][i]), 0)
}

const part2 = (input) => {
  const lists = getLists(input)
  const freqs = lists[1].reduce((acc, n) => ({ ...acc, [n]: (acc[n] || 0) + 1 }), {})
  return lists[0].reduce((total, n) => total + n * (freqs[n] || 0), 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
