const fs = require('fs')

const example = ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet']
const example2 = ['two1nine', 'eightwothree', 'abcone2threexyz', 'xtwone3four', '4nineeightseven2', 'zoneight234', '7pqrstsixteen']

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

const digit = (text) => {
  return (digits.indexOf(text) + 1) || text
}

const replaceDigits = (line) => {
  return digits.reduce((output, digit, index) => {
    return output.replaceAll(digit, `${digit[0]}${index + 1}${digit.slice(2)}`)
  }, line)
}

const part1 = (input) => {
  return input.reduce((total, line) => {
    const [x, ...rest] = [...line.match(/\d/g)]
    const y = rest.length ? rest[rest.length - 1] : x
    return total + Number(`${x}${y}`)
  }, 0)
}

const part2 = (input) => {
  return input.reduce((total, line) => {
    const [x, ...rest] = [...line.matchAll(new RegExp(`\\d|${digits.join('|')}`, 'g'))]
    const y = rest.length ? rest[rest.length - 1] : x
    return total + Number(`${digit(x[0])}${digit(y[0])}`)
  }, 0)
}

const part2b = (input) => {
  return input.reduce((total, line) => {
    const [x, ...rest] = [...replaceDigits(line).match(/\d/g)]
    const y = rest.length ? rest[rest.length - 1] : x
    return total + Number(`${x}${y}`)
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example2))
console.log(part2(getInput()))

console.log('\nPart 2b\n')

console.log(part2b(example2))
console.log(part2b(getInput()))
