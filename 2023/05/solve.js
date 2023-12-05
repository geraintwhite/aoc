const fs = require('fs')

const example = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getMappings = (input) => {
  const seeds = input[0].split(': ')[1].split(' ').map(Number)
  const mappings = input.slice(2).reduce((maps, line) => {
    if (line === '') {
      return maps
    }
    if (line.endsWith('map:')) {
      const [from, _, to] = line.replace(' map:', '').split('-')
      maps.current = from
      maps[from] = { to, ranges: [] }
      return maps
    }
    const [dst, src, len] = line.split(' ').map(Number)
    maps[maps.current].ranges.push({ dst, src, len })
    return maps
  }, {})
  return { seeds, mappings }
}

const getLocation = (number, mappings, type) => {
  const { ranges, to } = mappings[type]
  const range = ranges.find(({ src, len }) => number >= src && number <= src + len)
  const mapped = range ? range.dst + (number - range.src) : number
  return to === 'location' ? mapped : getLocation(mapped, mappings, to)
}

const part1 = (input) => {
  const { seeds, mappings } = getMappings(input)
  const locations = seeds.map((seed) => getLocation(seed, mappings, 'seed'))
  return Math.min(...locations)
}

const part2 = (input) => {
  const { seeds, mappings } = getMappings(input)
  let result = Infinity
  for (let i = 0; i < seeds.length; i += 2) {
    const [start, len] = seeds.slice(i, i+2)
    for (let x = start; x < start + len; x++) {
      const location = getLocation(x, mappings, 'seed')
      if (location < result) {
        result = location
      }
    }
  }
  return result
}

const part2b = (input) => {
  const { seeds, mappings } = getMappings(input)
  let result = Infinity
  for (let i = 0; i < seeds.length; i += 2) {
    const [start, len] = seeds.slice(i, i+2)
    let x = start, y = start + len
    let min = Infinity
    while (x < y) {
      const n = (x + y) / 2
      const location = getLocation(n, mappings, 'seed')
      if (location < min) {
        min = location
        y = n - 1
      } else {
        x = n + 1
      }
    }
    result = Math.min(result, min)
  }
  return Math.floor(result)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2b(example))
console.log(part2b(getInput()))
