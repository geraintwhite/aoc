const fs = require('fs')

const example = `x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`.split('\n')

const example2 = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const operations = {
  OR: (a, b) => a | b,
  AND: (a, b) => a & b,
  XOR: (a, b) => a ^ b,
}

const process = (input) => {
  const divider = input.indexOf('')
  const { values, instructions } = input.reduce(({ values, instructions }, line, index) => {
    if (index > divider) {
      const [_, a, o, b, c] = line.match(/(\w+)\s([A-Z]+)\s(\w+)\s->\s(\w+)/)
      instructions.push({ a, b, c, o })
    }
    if (index < divider) {
      const [a, n] = line.split(': ')
      values[a] = Number(n)
    }
    return { values, instructions }
  }, { values: {}, instructions: [] })
  return { values, instructions }
}

const simulate = (values, instructions) => {
  while (instructions.length) {
    const { a, b, c, o } = instructions.shift()
    if (a in values && b in values) {
      values[c] = operations[o](values[a], values[b])
      continue
    }
    instructions.push({ a, b, c, o })
  }
}

const output = (values) => {
  const keys = Object.keys(values).filter((k) => k.startsWith('z')).sort().reverse()
  return parseInt(keys.map((k) => values[k]).join(''), 2)
}

const part1 = (input) => {
  const { values, instructions } = process(input)
  simulate(values, instructions)
  return output(values)
}

const part2 = (input) => {
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(example2))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
