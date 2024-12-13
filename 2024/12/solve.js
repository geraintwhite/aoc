const fs = require('fs')

const example = `AAAA
BBCD
BBCC
EEEC`.split('\n')

const example2 = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const dirs = [
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
]

const getFence = (input, { y, x }, fence) => {
  if (!input[y][x] || fence.includes(`${y}-${x}`)) return []
  fence.push(`${y}-${x}`)
  for (const { dx, dy } of dirs) {
    if (input[y][x] === input[y + dy]?.[x + dx]) {
      getFence(input, { y: y + dy, x: x + dx }, fence)
    }
  }
  return fence
}

const getPrice = (fence) => {
  let perimeter = 0
  for (const p of fence) {
    const [y, x] = p.split('-').map(Number)
    for (const { dx, dy } of dirs) {
      if (!fence.includes(`${y + dy}-${x + dx}`)) perimeter++
    }
  }
  return perimeter * fence.length
}

const getDiscountedPrice = (fence) => {
  const edges = {}
  for (const p of fence) {
    const [y, x] = p.split('-').map(Number)
    for (const di in dirs) {
      const { dx, dy } = dirs[di]
      if (!fence.includes(`${y + dy}-${x + dx}`)) {
        const horizontal = (di === '0' || di === '1')
        const j = horizontal ? y : x
        const i = horizontal ? x : y
        edges[di] = edges[di] || {}
        edges[di][j] = edges[di][j] || []
        edges[di][j].push(i)
      }
    }
  }
  let n = 0
  for (const d of Object.values(edges)) {
    for (const dd of Object.values(d)) {
      n++
      const sorted = dd.slice().sort()
      for (const x in sorted) {
        if (sorted[x] - sorted[x-1] > 1) n++
      }
    }
  }
  return n * fence.length
}

const getFences = (input, getPrice) => {
  const fences = []
  const visited = []
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (visited.includes(`${y}-${x}`)) continue
      const fence = getFence(input, { y, x }, [])
      fences.push(getPrice(fence))
      visited.push(...fence)
    }
  }
  return fences
}

const part1 = (input) => {
  const fences = getFences(input, getPrice)
  return Object.values(fences).reduce((total, price) => total + price, 0)
}

const part2 = (input) => {
  const fences = getFences(input, getDiscountedPrice)
  return Object.values(fences).reduce((total, price) => total + price, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(example2))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(example2))
console.log(part2(getInput())) // 888039 is too low
