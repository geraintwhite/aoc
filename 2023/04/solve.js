const fs = require('fs')

const example = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

let scratchcards = {}

const matchingNumbers = (winning, card) => {
  return winning.filter((number) => card.includes(number)).length
}

const scoreLine = (line) => {
  const parts = line.split(/:\s+/)
  const numbers = parts[1].split(/\s+\|\s+/)
  const winning = numbers[0].split(/\s+/).map(Number)
  const card = numbers[1].split(/\s+/).map(Number)
  scratchcards[Number(parts[0].split(/\s+/)[1])] = matchingNumbers(winning, card)
  return Math.floor(winning.reduce((total, number) => {
    return card.includes(number) ? total * 2 : total
  }, 0.5))
}

const part1 = (input) => {
  scratchcards = {}
  return input.reduce((total, line) => {
    return total + scoreLine(line)
  }, 0)
}

const part2 = (input) => {
  part1(input)
  const cards = Object.keys(scratchcards).map(Number)
  let winning = cards.length
  while (cards.length) {
    const card = cards.shift()
    winning += scratchcards[card]
    for (let i = 1; i <= scratchcards[card]; i++) {
      cards.push(card + i)
    }
  }
  return winning
}

const part2b = (input) => {
  part1(input)
  const winning = Array(input.length).fill(1)
  for (const card of Object.keys(scratchcards).map(Number)) {
    for (let j = 0; j < winning[card]; j++) {
      for (let i = 0; i < scratchcards[card]; i++) {
        winning[i + card + 1] = (winning[i + card + 1] || 0) + 1
      }
    }
  }
  return winning.reduce((a, b) => a + b, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2b(example))
console.log(part2b(getInput()))
