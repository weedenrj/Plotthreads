import { z } from 'zod'

export const projectStatusSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  environmentId: z.string(),
  environmentName: z.string(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
})

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
}).passthrough()

export const deploymentSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  status: z.string(),
  createdAt: z.string(),
}).passthrough()

export const environmentSchema = z.object({
  id: z.string(),
  name: z.string(),
}).passthrough()

export const volumeSchema = z.object({
  id: z.string(),
  name: z.string(),
  mountPath: z.string(),
}).passthrough()

export const logEntrySchema = z.object({
  timestamp: z.string(),
  message: z.string(),
}).passthrough()

export const domainSchema = z.object({
  domain: z.string(),
}).passthrough()

export const variablesSchema = z.record(z.string(), z.string())

export type ProjectStatus = z.infer<typeof projectStatusSchema>
export type Service = z.infer<typeof serviceSchema>
export type Deployment = z.infer<typeof deploymentSchema>
export type Environment = z.infer<typeof environmentSchema>
export type Volume = z.infer<typeof volumeSchema>
export type LogEntry = z.infer<typeof logEntrySchema>
export type Domain = z.infer<typeof domainSchema>
export type Variables = z.infer<typeof variablesSchema>
