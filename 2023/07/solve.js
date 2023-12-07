const fs = require('fs')

const example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getRank = (hand, joker) => {
  const cards = hand.split('').reduce((total, card) => {
    return { ...total, [card]: (total[card] || 0) + 1 }
  }, {})
  const counts = Object.values(cards).reduce((map, n) => {
    return { ...map, [n]: (map[n] || 0) + 1 }
  }, {})

  if (joker && hand.includes('J')) {
    if (counts[5]) return 7
    if (counts[4]) return 7
    if (counts[3] && counts[2]) return 7
    if (counts[3]) return 6
    if (counts[2] > 1 && cards['J'] > 1) return 6
    if (counts[2] > 1 && cards['J']) return 5
    if (counts[2]) return 4
    return 2
  }

  if (counts[5]) return 7
  if (counts[4]) return 6
  if (counts[3] && counts[2]) return 5
  if (counts[3]) return 4
  if (counts[2] > 1) return 3
  if (counts[2]) return 2
  return 1
}

const getScore = (card, joker) => {
  const cards = joker ? 'J23456789TQKA' : '23456789TJQKA'
  return cards.indexOf(card)
}

const compareHands = ([a], [b], joker = false) => {
  const ranks = [getRank(a, joker), getRank(b, joker)]
  if (ranks[0] < ranks[1]) return -1
  if (ranks[1] < ranks[0]) return 1
  for (let i = 0; i < 5; i++) {
    if (getScore(a[i], joker) < getScore(b[i], joker)) return -1
    if (getScore(b[i], joker) < getScore(a[i], joker)) return 1
  }
}

const parseLine = (line) => {
  const [hand, bid] = line.split(' ')
  return [hand, Number(bid)]
}

const part1 = (input) => {
  const sorted = input.map(parseLine).sort((a, b) => compareHands(a, b))
  const winnings = sorted.reduce((total, [hand, bid], index) => {
    return total + (index + 1) * bid
  }, 0)
  return winnings
}

const part2 = (input) => {
  const sorted = input.map(parseLine).sort((a, b) => compareHands(a, b, true))
  const winnings = sorted.reduce((total, [hand, bid], index) => {
    return total + (index + 1) * bid
  }, 0)
  return winnings
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
