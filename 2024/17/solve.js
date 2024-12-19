const fs = require('fs')

const example = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`.split('\n')

const example2 = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const process = (input) => {
  const [a, b, c, _, i] = input

  return {
    a: Number(a.split(': ')[1]),
    b: Number(b.split(': ')[1]),
    c: Number(c.split(': ')[1]),
    i: i.split(': ')[1].split(',').map(Number),
  }
}

const combo = ({ a, b, c }, n) => {
  if (n === 4) return a
  if (n === 5) return b
  if (n === 6) return c
  return n
}

const compute = ({ a, b, c, i }) => {
  const r = { a, b, c }
  const o = []
  let p = 0
  while (p < i.length) {
    const n = i[p]
    if (n === 0) r.a = Math.floor(r.a / (2 ** combo(r, i[p + 1])))
    if (n === 1) r.b = r.b ^ i[p + 1]
    if (n === 2) r.b = combo(r, i[p + 1]) % 8
    if (n === 3) p = r.a === 0 ? p : i[p + 1] - 2
    if (n === 4) r.b = r.b ^ r.c
    if (n === 5) o.push(combo(r, i[p + 1]) % 8)
    if (n === 6) r.b = Math.floor(r.a / (2 ** combo(r, i[p + 1])))
    if (n === 7) r.c = Math.floor(r.a / (2 ** combo(r, i[p + 1])))
    p += 2
  }
  return o
}

const part1 = (input) => {
  const { a, b, c, i } = process(input)
  return compute({ a, b, c, i }).join(',')
}

const part2 = (input) => {
  const { a, b, c, i } = process(input)
  const p = i.join(',')
  let o = '', n = a
  while (o !== p) {
    n++
    o = compute({ a: n, b, c, i }).join(',')
  }
  return n
}

const part2b = (input) => {
  const { a, b, c, i } = process(input)
  const t = i.slice().reverse().join('')
  const o = compute({ a, b, c, i }).slice().reverse().join('')
  return n = (parseInt(t, 8) - parseInt(o, 8)) * 8 + a
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example2))
console.log(part2b(example2))
console.log(part2b(getInput())) // 119136809579051 too high
