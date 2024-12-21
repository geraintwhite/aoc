const fs = require('fs')

const example = `029A
980A
179A
456A
379A`.split('\n')

const getKey = ({ x, y }) => `${y}-${x}`
const getKeypad = (str) => str.split('\n').reduce((acc, row, y) => {
  return row.split('').reduce((iacc, c, x) => c === ' ' ? iacc : ({ ...iacc, [c]: { x, y, v: getKey({ x, y }) }}), acc)
}, {})

const keypad = getKeypad('789\n456\n123\n 0A')
const dirpad = getKeypad(' ^A\n<v>')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const findPaths = (pad, from, to) => {
  const queue = [[pad[from], '']]
  const paths = []
  while (queue.length) {
    const [pos, path] = queue.pop()
    if (getKey(pos) === getKey(pad[to])) {
      paths.push(path)
      continue
    }
    dx = pad[to].x - pos.x
    if (dx !== 0) {
      const next = { x: pos.x + (dx > 0 ? 1 : -1), y: pos.y }
      if (Object.values(pad).find(({ v }) => v === getKey(next))) {
        queue.push([next, `${path}${dx > 0 ? '>' : '<'}`])
      }
    }
    dy = pad[to].y - pos.y
    if (dy !== 0) {
      const next = { x: pos.x, y: pos.y + (dy > 0 ? 1 : -1) }
      if (Object.values(pad).find(({ v }) => v === getKey(next))) {
        queue.push([next, `${path}${dy > 0 ? 'v' : '^'}`])
      }
    }
  }
  return paths
}

const getSequence = (pad, code, steps, cache) => {
  const key = `${code}-${steps}`
  if (key in cache) return cache[key]
  if (steps === 0) return cache[key] = code.length
  let a = 0, l = 'A'
  for (const c of code.split('')) {
    a += Math.min(...findPaths(pad, l, c).map((path) => getSequence(dirpad, `${path}A`, steps - 1, cache)))
    l = c
  }
  return cache[key] = a
}

const part1 = (input) => {
  let a = 0
  for (const row of input) {
    a += getSequence(keypad, row, 3, {}) * parseInt(row)
  }
  return a
}

const part2 = (input) => {
  let a = 0
  for (const row of input) {
    a += getSequence(keypad, row, 26, {}) * parseInt(row)
  }
  return a
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
