const fs = require('fs')

const example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const process = (input) => {
  const gap = input.indexOf('')
  const rules = input.slice(0, gap).map((row) => row.split('|').map(Number))
  const updates = input.slice(gap + 1).map((row) => row.split(',').map(Number))
  return { rules, updates }
}

const checkRule = (update, [a, b]) => {
  return !update.includes(a) || !update.includes(b) || update.indexOf(a) < update.indexOf(b)
}

const part1 = (input) => {
  const { rules, updates } = process(input)
  const valid = updates.filter((update) => rules.every((rule) => checkRule(update, rule)))
  return valid.reduce((total, update) => total + update[Math.floor(update.length / 2)], 0)
}

const part2 = (input) => {
  const { rules, updates } = process(input)
  const invalid = updates.filter((update) => !rules.every((rule) => checkRule(update, rule)))
  const sorted = invalid.map((update) => update.sort((a, b) => rules.find(([x, y]) => a === x && b === y) ? 1 : -1))
  return sorted.reduce((total, update) => total + update[Math.floor(update.length / 2)], 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
