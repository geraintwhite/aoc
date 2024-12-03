const fs = require('fs')

const example = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`.split('\n')
const example2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const part1 = (input) => {
  const matches = input.join('\n').matchAll(/mul\((\d+),(\d+)\)/g)
  return [...matches].reduce((total, [_, x, y]) => total + Number(x) * Number(y), 0)
}

const part2 = (input) => {
  const matches = input.join('\n').matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)
  return [...matches].reduce(({total,enabled}, [o, x, y]) => {
    return {
      total: o.startsWith('mul') && enabled ? total + Number(x) * Number(y) : total,
      enabled: o === `do()` ? true : o === `don't()` ? false : enabled,
    }
  }, {total:0,enabled:true}).total
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example2))
console.log(part2(getInput()))
