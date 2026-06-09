'use client'

import { createContext, useContext } from 'react'

interface WorkspaceContext {
  workspaceId: string
  workspaceName: string
  workspacePlan: string
  userId: string
  userEmail: string
  userFullName: string | null
  role: string
}

const WorkspaceContext = createContext<WorkspaceContext | null>(null)

export function WorkspaceProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: WorkspaceContext
}) {
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace(): WorkspaceContext {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}
