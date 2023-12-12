const fs = require('fs')

const example = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

// from https://gist.github.com/cybercase/db7dde901d7070c98c48?permalink_comment_id=2400061#gistcomment-2400061
const product = (pattern, repeat = 1) => {
  return Array(repeat).fill(pattern).reduce((acc, value) => {
    const result = []
    acc.forEach((arr) => {
      value.forEach((item) => {
        result.push(arr.concat(item))
      })
    })
    return result
  }, [[]])
}

const getCombinations = (s, chars) => {
  const combinations = []
  for (let p of product(chars.split(''), s.match(/\?/g).length)) {
    combinations.push(s.split('').map((c) => c === '?' ? p.shift() : c).join(''))
  }
  return combinations
}

const getGroups = (input) => {
  return input.map((line) => {
    const [pattern, groups] = line.split(' ')
    const g = groups.split(',').map(Number)
    const combinations = getCombinations(pattern, '#.')
    return combinations.filter((comb) => {
      return comb.match(new RegExp(`^\\.*${g.map((x) => '#'.repeat(x)).join('\\.+')}\\.*$`))
    })
  })
}

const getGroupsRepeat = (input) => {
  return input.map((line) => {
    const parts = line.split(' ')
    const pattern = Array(5).fill(parts[0]).join('?') + '?'
    const groups = [0, ...Array(5).fill(parts[1]).join(',').split(',').map(Number)]
    const counts = [...Array(pattern.length)].map(() => [])
    const getCount = (i, j) => (i == -1 && j === 0) ? 1 : counts[i]?.[j] ?? 0
    for (let j = 0; j < groups.length; j++) {
      for (let i = 0; i < pattern.length; i++) {
        let x = 0
        if (pattern[i] !== '#') x += getCount(i - 1, j)
        if (j > 0 && pattern[i] != '#' && !pattern.slice(i - groups[j], i).includes('.')) {
          x += getCount(i - groups[j] - 1, j - 1)
        }
        counts[i][j] = x
      }
    }
    return counts[pattern.length - 1][groups.length - 1]
  })
}

const part1 = (input) => {
  const groups = getGroups(input)
  return groups.reduce((a, g) => a + g.length, 0)
}

const part2 = (input) => {
  const groups = getGroupsRepeat(input)
  return groups.reduce((a, g) => a + g)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
