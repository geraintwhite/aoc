const fs = require('fs')

const example = `125 17`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const blink = (stones) => {
  return stones.reduce((arr, stone) => {
    if (stone === 0) return [...arr, 1]
    const s = String(stone)
    if (s.length % 2 === 0) {
      return [...arr, Number(s.slice(0,s.length/2)), Number(s.slice(s.length/2))]
    }
    return [...arr, stone * 2024]
  }, [])
}

const cache = {}

const simulate = (stone, n) => {
  if (n == 0) return 1
  const key = `${stone}:${n}`
  if (cache[key]) return cache[key]
  if (stone === 0) {
    cache[key] = simulate(1, n - 1)
  }
  else if (String(stone).length % 2 === 0) {
    const s = String(stone)
    cache[key] = simulate(Number(s.slice(0, s.length / 2)), n - 1) + simulate(Number(s.slice(s.length / 2)), n - 1)
  }
  else cache[key] = simulate(stone * 2024, n - 1)
  return cache[key]
}

const part1 = (input) => {
  let stones = input[0].split(' ').map(Number)
  for (let i = 0; i < 25; i++) {
    stones = blink(stones)
  }
  return stones.length
}

const part1a = (input) => {
  const stones = input[0].split(' ').map(Number)
  let count = 0
  for (const stone of stones) {
    count += simulate(stone, 25)
  }
  return count
}

const part2 = (input) => {
  const stones = input[0].split(' ').map(Number)
  let count = 0
  for (const stone of stones) {
    count += simulate(stone, 75)
  }
  return count
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1a(example))
console.log(part1a(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
