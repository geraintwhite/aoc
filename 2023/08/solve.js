const fs = require('fs')

const example = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`.split('\n')

const example2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`.split('\n')

const example3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`.split('\n')

// From https://stackoverflow.com/a/61352020
const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const parseNetwork = (network) => {
  return network.reduce((nodes, node) => {
    const [_, name, left, right] = node.match(/(\w+) = \((\w+), (\w+)\)/)
    return { ...nodes, [name]: { L: left, R: right }}
  }, {})
}

const part1 = (input) => {
  const [steps, _, ...network] = input
  const nodes = parseNetwork(network)
  let node = 'AAA'
  let count = 0
  while (node !== 'ZZZ') {
    node = nodes[node][steps[count % steps.length]]
    count++
  }
  return count
}

const part2 = (input) => {
  const [steps, _, ...network] = input
  const nodes = parseNetwork(network)
  const counts = Object.keys(nodes).filter((node) => node.endsWith('A')).map((node) => {
    let count = 0
    while (!node.endsWith('Z')) {
      node = nodes[node][steps[count % steps.length]]
      count++
    }
    return count
  })
  return counts.reduce((acc, c) => lcm(acc, c))
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(example2))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example3))
console.log(part2(getInput()))
