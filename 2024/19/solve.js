const fs = require('fs')

const example = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const isDesignPossible = (towels, design, n, cache) => {
  if (design in cache) return cache[design]
  if (design.length === 0) return 1
  let possible = 0
  for (const towel of towels) {
    if (design.startsWith(towel)) {
      const newDesign = design.slice(towel.length)
      const designPossible = isDesignPossible(towels, newDesign, n + 1, cache)
      cache[newDesign] = designPossible
      possible += designPossible
    }
  }
  return possible
}

const getPossibleDesigns = (towels, designs, cache = {}) => {
  return designs.map((design) => isDesignPossible(towels, design, 0, cache))
}

const part1 = (input) => {
  const [towels, _, ...designs] = input
  return getPossibleDesigns(towels.split(', '), designs).filter(Boolean).length
}

const part2 = (input) => {
  const [towels, _, ...designs] = input
  return getPossibleDesigns(towels.split(', '), designs).reduce((a, b) => a + b)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
