const fs = require('fs')

const example = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`.split('\n')

const example2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

// From https://stackoverflow.com/a/61352020
const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b

const getFlow = (input) => {
  const ff = {}
  const cc = {}
  const flow = {}

  for (const line of input) {
    const [src, dst] = line.split(' -> ')
    if (src[0] === '%') ff[src.slice(1)] = false
    if (src[0] === '&') cc[src.slice(1)] = {}
    flow[src.replace(/[%&]/, '')] = dst.split(', ')
  }

  for (const [src, dst] of Object.entries(flow)) {
    for (const d of dst.filter((x) => cc[x])) {
      cc[d][src] = false
    }
  }

  return { ff, cc, flow }
}

const execute = ({ ff, cc, flow }, { src, dst, p }) => {
  let dd = [], np = p
  if (!flow[dst]) return dd
  if (dst in ff) {
    if (p) return dd
    np = ff[dst] = !ff[dst]
  }
  if (dst in cc) {
    cc[dst][src] = p
    np = !Object.values(cc[dst]).every(Boolean)
  }
  for (const n of flow[dst]) {
    dd.push({ src: dst, dst: n, p: np })
  }
  return dd
}

const pushButton = ({ ff, cc, flow }) => {
  const queue = [{ src: 'start', dst: 'broadcaster', p: false }]
  const pulses = { high: 0, low: 0 }
  while (queue.length) {
    const { src, dst, p } = queue.shift()
    if (p) pulses.high++
    if (!p) pulses.low++
    queue.push(...execute({ ff, cc, flow }, { src, dst, p }))
  }
  return pulses
}

const getCycles = ({ ff, cc, flow }) => {
  const set = new Set(Object.keys(flow).filter(x => flow[x].includes('th')))
  const cycles = []
  for (let i = 1; i; i++) {
    const queue = [{ src: 'start', dst: 'broadcaster', p: false }]
    while (queue.length) {
      const { src, dst, p } = queue.shift()
      if (!p && set.has(dst)) {
        cycles.push(i)
        set.delete(dst)
        if (!set.size) return cycles
      }
      queue.push(...execute({ ff, cc, flow }, { src, dst, p }))
    }
  }
}

const part1 = (input) => {
  const { ff, cc, flow } = getFlow(input)
  const pulses = { high: 0, low: 0 }

  for (let i = 0; i < 1000; i++) {
    const { high, low } = pushButton({ ff, cc, flow })
    pulses.high += high
    pulses.low += low
  }

  return pulses.high * pulses.low
}

const part2 = (input) => {
  const { ff, cc, flow } = getFlow(input)
  const cycles = getCycles({ ff, cc, flow })
  return cycles.reduce((acc, c) => lcm(acc, c))
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(example2))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(getInput()))
