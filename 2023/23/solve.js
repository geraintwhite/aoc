const fs = require('fs')

const example = `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const key = (args) => JSON.stringify(args)

const getNext = (map, {x,y}, icy) => {
  if (!map[y]?.[x] || map[y]?.[x] === '#') return []
  const dirs = {'>':{x:x+1,y},'<':{x:x-1,y},'^':{x,y:y-1},'v':{x,y:y+1}}
  return icy && dirs[map[y][x]] ? [dirs[map[y][x]]] : Object.values(dirs)
}

const findLongestPath = (map, pos, end, icy = true, longest = 0, path = [], visited = new Set()) => {
  if (pos.x === end.x && pos.y === end.y) {
    return Math.max(longest, path.length)
  }
  for (const next of getNext(map, pos, icy)) {
    if (!visited.has(key(next))) {
      path.push(key(pos))
      visited.add(key(pos))
      longest = findLongestPath(map, next, end, icy, longest, path, visited)
      visited.delete(key(pos))
      path.pop()
    }
  }
  return longest
}

const createGraph = (map) => {
  const edges = {}

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '#') continue
      for ([dy,dx] of [[-1,0],[0,-1],[0,1],[1,0]]) {
        const nx = x+dx, ny = y+dy
        if (!map[ny]?.[nx] || map[ny][nx] === '#') continue
        edges[key({x,y})] ||= new Set()
        edges[key({x,y})].add(key({x:nx,y:ny,l:1}))
        edges[key({x:nx,y:ny})] ||= new Set()
        edges[key({x:nx,y:ny})].add(key({x,y,l:1}))
      }
    }
  }

  while (true) {
    for ([k,v] of Object.entries(edges)) {
      if (v.size === 2) {
        const [a,b] = [...v].map(JSON.parse)
        edges[key({x:a.x,y:a.y})].delete({...JSON.parse(k), l:a.l})
        edges[key({x:b.x,y:b.y})].delete({...JSON.parse(k), l:b.l})
        edges[key({x:a.x,y:a.y})].add(key({x:b.x, y:b.y, l:a.l+b.l}))
        edges[key({x:b.x,y:b.y})].add(key({x:a.x, y:a.y, l:a.l+b.l}))
        return edges
      }
    }
  }
}

const longestPathGraph = (graph, start, end) => {
  const q = [{ x: start.x, y: start.y, l: 0 }]
  const visited = new Set()
  let longest = 0
  while (q.length) {
    const {x,y,l} = q.pop()
    if (l === -1) visited.delete(key({x,y})); continue
    if (x === end.x && y === end.y) longest = Math.max(longest, l); continue
    if (visited.has(key({x,y}))) continue
    visited.add(key({x,y}))
    q.push({x,y,l:-1})
    for (const e of edges[key({x,y})]) {
      const {x:ex,y:ey,l:el} = JSON.parse(e)
      q.push({x:ex,y:ey,l:el+l})
    }
  }
  return longest
}

const part1 = (input) => {
  const start = {y:0,x:input[0].indexOf('.')}
  const end = {y:input.length-1,x:input[input.length - 1].indexOf('.')}
  return findLongestPath(input, start, end)
}

const part2 = (input) => {
  const start = {y:0,x:input[0].indexOf('.')}
  const end = {y:input.length-1,x:input[input.length - 1].indexOf('.')}
  return findLongestPath(input, start, end, false)
}

const part2b = (input) => {
  const graph = createGraph(input)
  const start = {y:0,x:input[0].indexOf('.')}
  const end = {y:input.length-1,x:input[input.length - 1].indexOf('.')}
  return longestPathGraph(graph, start, end)
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2b(example))
console.log(part2b(getInput()))
