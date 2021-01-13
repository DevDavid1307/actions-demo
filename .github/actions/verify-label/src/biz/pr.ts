import * as github from '@actions/github'

interface Label {
  color: string
  default: boolean
  description: string
  id: number
  name: string
  node_id: string
  url: string
}
export default class Pr {
  getLabels(): string[] {
    const pr = github.context.payload.pull_request

    const labels: Label[] = pr?.labels

    if (labels == undefined) {
      return []
    }

    const result: string[] = []

    labels.forEach((v: Label) => result.push(v.name))

    return result
  }
}
