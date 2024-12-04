const fs = require('fs')

const example = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const directions = [
 {x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1}
]

const checkWord = (grid, {y, x}, word) => {
  const chars = word.split('')
  return directions.filter((dir) => chars.every((c, i) => grid[y+dir.y*i]?.[x+dir.x*i] === c)).length
}

const crossWords = [
  [{x:1,y:1},{x:0,y:0},{x:-1,y:-1}],
  [{x:-1,y:1},{x:0,y:0},{x:1,y:-1}],
]

const checkCross = (grid, {y, x}, word) => {
  return crossWords.every((pos) => 
    pos.every((p, i) => grid[y+p.y]?.[x+p.x] === word[i]) ||
    [...pos].reverse().every((p, i) => grid[y+p.y]?.[x+p.x] === word[i])
  )
}

const part1 = (input) => {
  return input.reduce((total, row, y) => {
    return total + row.split('').reduce((t, c, x) => t + checkWord(input, {y, x}, 'XMAS'), 0)
  }, 0)
}

const part2 = (input) => {
  return input.reduce((total, row, y) => {
    return total + row.split('').reduce((t, c, x) => t + checkCross(input, {y, x}, 'MAS'), 0)
  }, 0)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2(getInput()))
