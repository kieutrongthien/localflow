export type ProjectMetadata = {
  projectPath: string
  name: string
  description: string
  team: string[]
  startDate: string
  endDate: string
}

export type ProjectMetadataResult = ProjectMetadata | null
