const fs = require('fs')

const example = `2333133121414131402`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const expand = (map) => {
  return map.split('').reduce((arr, ch, i) => [...arr, ...Array(Number(ch)).fill(i % 2 ? '.' : i / 2)], [])
}

const compact = (arr) => {
  const compacted = [...arr]
  for (const i in compacted) {
    while (compacted[i] === '.') {
      compacted[i] = compacted.pop()
    }
  }
  return compacted
}

const checksum = (arr) => {
  return arr.reduce((sum, n, i) => sum + n * i, 0)
}

const part1 = (input) => {
  const expanded = expand(input[0])
  const compacted = compact(expanded)
  return checksum(compacted)
}

const part1b = (input) => {
  const map = input[0].split('').reduce((arr, ch, i) => [...arr, ...Array(Number(ch)).fill(i % 2 ? '.' : i / 2)], [])
  const rev = map.slice().reverse().filter((x) => x !== '.')
  const filled = map.slice(0, rev.length)
  for (const i in filled) {
    if (filled[i] === '.' && rev.length) {
      filled[i] = rev.shift()
    }
  }
  return filled.reduce((sum, n, i) => sum + n * i, 0)
}

const part2 = (input) => {
  const { map } = input[0].split('').reduce(({ map, n }, ch, i) => {
    return { map: [...map, { t: i % 2 ? 'e' : 'f', l: Number(ch), n }], n: i % 2 ? n: n + 1 }
  }, { map: [], n: 0 })

  const filled = map.slice()
  for (const i in map) {
    const block = map[map.length - 1 - i]
    if (block.t === 'e') continue
    const spaceIndex = filled.findIndex((x) => x.t === 'e' && x.l >= block.l)
    if (spaceIndex > -1 && spaceIndex < map.length - 1 - i) {
      if (filled[spaceIndex].l > block.l) {
        filled.splice(spaceIndex + 1, 0, { t: 'e', l: filled[spaceIndex].l - block.l })
      }
      filled[spaceIndex] = { ...block }
      block.t = 'e' 
    } 
  }

  const tmp = filled.reduce((arr, block) => [...arr, ...Array(block.l).fill(block.t === 'e' ? '.' : block.n)], [])
  const sum = tmp.reduce((s, n, i) => s + (n === '.' ? 0 : n) * i, 0)

  return filled.reduce(({ sum, index }, block) => ({
    sum: block.t === 'e' ? sum : sum + Array(block.l).fill(block.n).reduce((t, n, x) => t + n * (index + x), 0),
    index: index + block.l
  }), { sum: 0, index: 0 }).sum
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1b(example))
console.log(part1b(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
