const fs = require('fs')

const example = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getHash = (ch) => {
  return ch.split('').reduce((t, c) => {
    return ((t + c.charCodeAt(0)) * 17) % 256
  }, 0)
}

const getHashes = ([line]) => {
  return line.split(',').reduce((total, ch) => {
    return total + getHash(ch)
  }, 0)
}

const getHashMap = ([line]) => {
  return line.split(',').reduce((acc, ch) => {
    const [_, l, o, n] = ch.match(/([a-z]+)([-=])([0-9]*)/)
    const b = getHash(l)
    acc[b] ||= {}
    if (o === '-') delete acc[b][l]
    if (o === '=') acc[b][l] = Number(n)
    return acc
  }, {})
}

const part1 = (input) => {
  return getHashes(input)
}

const part2 = (input) => {
  const map = getHashMap(input)
  return Object.keys(map).reduce((total, k) => {
    return total + Object.values(map[k]).reduce((t, n, i) => {
      return t + (Number(k) + 1) * (i + 1) * n
    }, 0)
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
