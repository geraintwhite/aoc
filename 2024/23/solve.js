const fs = require('fs')

const example = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`.split('\n')

const getInput = () => {
  const input = fs.readFileSync(__dirname + '/input.txt')
  return input.toString().split('\n').slice(0, -1)
}

const getNodes = (pairs, all) => {
  return pairs.reduce((acc, [a, b]) => {
    if (all) return { ...acc, [a]: [...acc[a] || [], b], [b]: [...acc[b] || [], a] }
    return a < b ?
      { ...acc, [a]: [...acc[a] || [], b] } :
      { ...acc, [b]: [...acc[b] || [], a] }
  }, {})
}

const getGroups = (pairs, predicate=()=>true) => {
  const nodes = getNodes(pairs)
  return pairs.reduce((acc, [a, b]) => {
    const common = nodes[a]?.filter(v => nodes[b]?.includes(v)) || []
    return [...acc, ...common.map(c => [a, b, c]).filter(x => x.some(predicate))]
  }, [])
}

const getMaximumSubgraph = (nodes, n, g=[]) => {
  if (!nodes[n]) return g
  if (!g.every(x => nodes[n].includes(x))) return g
  let graph = []
  for (const nn of nodes[n]) {
    const gg = getMaximumSubgraph(nodes, nn, [...g, n])
    if (gg.length > graph.length) graph = gg
  }
  return graph
}

const getGraph = (pairs) => {
  const nodes = getNodes(pairs, true)
  let graph = []
  for (const n in nodes) {
    const g = getMaximumSubgraph(nodes, n)
    if (g.length > graph.length) graph = g
  }
  return graph
}

const getMaxConnectedGraph = (groups) => {
  const triangles = {}
  for (const group of groups) {
    for (const x of group) {
      triangles[x] = (triangles[x] || 0) + 1
    }
  }
  const maxCount = Math.max(...Object.values(triangles))
  return [...new Set(groups.filter(g => g.every(t => triangles[t] === maxCount)).flat())]
}

const part1 = (input) => {
  const groups = getGroups(input.map(line => line.split('-')), x => x.startsWith('t'))
  return groups.length
}

const part2 = (input) => {
  const graph = getGraph(input.map(line => line.split('-')))
  return graph.sort().join(',')
}

const part2b = (input) => {
  const groups = getGroups(input.map(line => line.split('-')))
  const graph = getMaxConnectedGraph(groups)
  return graph.sort().join(',')
}

console.log('\nPart 1\n')

console.log(part1(example))
console.log(part1(getInput()))

console.log('\nPart 2\n')

console.log(part2(example))
console.log(part2b(example))
console.log(part2b(getInput()))
