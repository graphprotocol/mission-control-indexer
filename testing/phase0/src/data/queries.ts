import * as fs from 'fs'
import * as Papa from 'papaparse'

export interface Query {
  deployment: string
  query: string
}

export const parseQueries = (file: string): Query[] => {
  const result = Papa.parse(fs.readFileSync(file, 'utf-8'))

  if (result.errors.length > 0) {
    throw new Error(JSON.stringify(result.errors))
  }

  return result.data
    .filter((x) => x !== undefined)
    .map((parts) => ({
      deployment: parts[0],
      query: parts[1],
    }))
}
