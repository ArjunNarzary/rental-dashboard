export type TAudit = {
  id: string
  action: string
  User: {
    id: string
    name: string
    email: string
  }
  List: {
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
}

export type TAuditResponse = {
  error: boolean
  audits: TAudit[]
}
