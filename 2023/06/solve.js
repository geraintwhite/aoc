const fs = require('fs')

const example = `Time:      7  15   30
Distance:  9  40  200`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const waysToWin = (time, record) => {
  const wins = []
  for (let wait = 0; wait <= time; wait++) {
    const distance = (time - wait) * wait
    if (distance > record) {
      wins.push({ wait, distance })
    }
  }
  return wins.length
}

const part1 = (input) => {
  const [time, distance] = input
  const times = time.split(/:\s+/)[1].split(/\s+/).map(Number)
  const distances = distance.split(/:\s+/)[1].split(/\s+/).map(Number)
  return times.reduce((total, _, index) => {
    return total * waysToWin(times[index], distances[index])
  }, 1)
}

const part2 = (input) => {
  const [times, distances] = input
  const time = Number(times.split(/:\s+/)[1].replace(/\s+/g, ''))
  const distance = Number(distances.split(/:\s+/)[1].replace(/\s+/g, ''))
  return waysToWin(time, distance)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
