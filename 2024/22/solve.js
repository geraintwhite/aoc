const fs = require('fs')

const example = `1
10
100
2024`.split('\n')

const example2 = `1
2
3
2024`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const mod = (a, b) => ((a % b) + b) % b
const mix = (x, n) => x ^ n
const prune = (n) => mod(n, 16777216)

const getNextNumber = (n) => {
  const step1 = prune(mix(n * 64, n))
  const step2 = prune(mix(Math.floor(step1 / 32), step1))
  return prune(mix(step2 * 2048, step2))
}

const findNthNumber = (x, l) => {
  let n = x
  for (let i = 0; i < l; i++) {
    n = getNextNumber(n)
  }
  return n
}

const part1 = (input) => {
  let o = 0
  for (const x of input) {
    const n = findNthNumber(Number(x), 2000)
    o += n
  }
  return o
}

const getPriceChanges = (x, l) => {
  const priceChanges = {}
  const changes = []
  let n = x
  for (let i = 0; i < l; i++) {
    const next = getNextNumber(n)
    const price = mod(next, 10)
    changes.push(price - mod(n, 10))
    if (changes.length === 4) {
      if (!(changes.join(',') in priceChanges)) priceChanges[changes.join(',')] = price
      changes.shift()
    }
    n = next
  }
  return priceChanges
}

const part2 = (input) => {
  const priceChanges = {}
  for (const x of input) {
    for (const [changes, price] of Object.entries(getPriceChanges(Number(x), 2000))) {
      priceChanges[changes] = [...priceChanges[changes] || [], price]
    }
  }
  return Math.max(...Object.values(priceChanges).map((prices) => prices.reduce((a, b) => a + b)))
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example2))
console.log(part2(getInput()))
