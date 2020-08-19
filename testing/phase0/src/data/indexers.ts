import * as fs from 'fs'
import * as Papa from 'papaparse'

export interface Indexer {
  kind: 'individual' | 'organization'
  normalizedName: string
  name: string
  contactName: string
  contactEmail: string
  graphNode: URL
  prometheus: URL
  oldDuplicate: boolean
  teamMembers: string
  githubAccounts: string[]
  npmAccounts: string[]
  dockerAccounts: string[]
  rinkebyAddress: string
  passedPhase0Tests: boolean
}

const normalizeURL = (s: string): URL => {
  s = s.split(' ')[0]
  const url = new URL(s.startsWith('http') ? s : `http://${s}`)
  if (url.pathname.match('subgraphs')) {
    url.pathname = '/'
  }
  return url
}

const normalizeName = (name: string): string =>
  name.toLowerCase().replace(/ /g, '-').trim()

const parseList = (lst: string | undefined): string[] => {
  if (lst === undefined) {
    return []
  }
  if (lst.trim() === '' || lst === '-') {
    return []
  } else {
    return lst
      .trim()
      .split(/[ ,\n]/)
      .map((value) => value.trim())
  }
}

const parseIndexer = (line: any): Indexer | undefined => {
  let {
    'Contact Full Name': contactName,
    'Contact Email': contactEmail,
    Organization: organization,
    'Graph node endpoint': graphNode,
    'Prometheus endpoint': prometheus,
    'Old duplicate': duplicate,
    'Team members email': teamMembers,
    'GitHub accounts': githubAccounts,
    'NPM Username': npmAccounts,
    'Docker Username': dockerAccounts,
    'Ethereum Rinkeby Address': rinkebyAddress,
    'Passed phase 0 tests': passedPhase0Tests,
  } = line

  // For some reason the above cannot destructure `Name`
  const name = Object.values(line)[0] as string

  if (graphNode === '' || prometheus === '') {
    return undefined
  }

  graphNode = normalizeURL(graphNode)
  prometheus = normalizeURL(prometheus)

  prometheus.pathname = prometheus.pathname.match('prometheus')
    ? '/prometheus/federate'
    : '/federate'

  teamMembers = parseList(teamMembers)
  githubAccounts = parseList(githubAccounts)
  npmAccounts = parseList(npmAccounts)
  dockerAccounts = parseList(dockerAccounts)

  return {
    kind: organization ? 'organization' : 'individual',
    normalizedName: normalizeName(organization ? name : contactName),
    name: organization ? name : contactName,
    contactName,
    contactEmail,
    graphNode,
    prometheus,
    oldDuplicate: duplicate ? true : false,
    rinkebyAddress,
    teamMembers,
    githubAccounts,
    npmAccounts,
    dockerAccounts,
    passedPhase0Tests: passedPhase0Tests ? true : false,
  }
}

export const parseIndexers = (file: string): Indexer[] => {
  const result = Papa.parse(fs.readFileSync(file, 'utf-8'), {
    header: true,
  })
  if (result.errors.length > 0) {
    throw new Error(JSON.stringify(result.errors))
  }

  const indexers: Indexer[] = result.data
    .map(parseIndexer)
    .filter((x: Indexer) => x !== undefined)

  indexers.sort((a, b) => a.name.localeCompare(b.name))

  return indexers
}
