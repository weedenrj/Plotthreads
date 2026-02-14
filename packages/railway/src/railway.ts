import { execFile as execFileCb } from 'node:child_process'
import { promisify } from 'node:util'
import {
  projectStatusSchema,
  serviceSchema,
  deploymentSchema,
  environmentSchema,
  volumeSchema,
  logEntrySchema,
  domainSchema,
  variablesSchema,
} from './railway.validators'
import type { ZodSchema } from 'zod'

const execFile = promisify(execFileCb)

type Scope = {
  service?: string
  environment?: string
}

export class RailwayError extends Error {
  constructor(
    public readonly command: string,
    public readonly exitCode: number | null,
    public readonly stderr: string
  ) {
    super(`railway ${command} failed (exit ${exitCode}): ${stderr.trim()}`)
    this.name = 'RailwayError'
  }
}

async function exec(args: readonly string[], scope?: Scope & { json?: boolean }): Promise<string> {
  const fullArgs = [...args]
  if (scope?.json !== false) fullArgs.push('--json')
  if (scope?.service) fullArgs.push('--service', scope.service)
  if (scope?.environment) fullArgs.push('--environment', scope.environment)

  try {
    const { stdout } = await execFile('railway', fullArgs)
    return stdout.trim()
  } catch (err: unknown) {
    const e = err as { code?: number; stderr?: string }
    throw new RailwayError(args.join(' '), e.code ?? null, e.stderr ?? String(err))
  }
}

async function execJson<T>(args: readonly string[], schema: ZodSchema<T>, scope?: Scope): Promise<T> {
  const raw = await exec(args, { ...scope, json: true })
  return schema.parse(JSON.parse(raw))
}

async function execRaw(args: readonly string[], scope?: Scope): Promise<string> {
  return exec(args, { ...scope, json: false })
}

export const railway = {
  status: () =>
    execJson(['status'], projectStatusSchema),

  services: {
    list: () =>
      execJson(['service', 'status'], serviceSchema.array()),

    link: (name: string) =>
      execRaw(['service', 'link', name]),

    redeploy: (scope?: Scope) =>
      execRaw(['service', 'redeploy'], scope),

    restart: (scope?: Scope) =>
      execRaw(['service', 'restart'], scope),
  },

  deployments: {
    list: (options?: Scope & { limit?: number }) => {
      const args = ['deployment', 'list']
      if (options?.limit) args.push('--limit', String(options.limit))
      return execJson(args, deploymentSchema.array(), options)
    },

    up: (options?: Scope & { detach?: boolean; message?: string }) => {
      const args = ['up']
      if (options?.detach) args.push('--detach')
      if (options?.message) args.push('--message', options.message)
      return execRaw(args, options)
    },

    redeploy: (scope?: Scope) =>
      execRaw(['deployment', 'redeploy'], scope),
  },

  variables: {
    list: (scope?: Scope) =>
      execJson(['variable', 'list'], variablesSchema, scope),

    set: (key: string, value: string, scope?: Scope) =>
      execRaw(['variable', 'set', `${key}=${value}`], scope),

    remove: (key: string, scope?: Scope) =>
      execRaw(['variable', 'delete', key], scope),
  },

  logs: (options?: Scope & { lines?: number; filter?: string; since?: string; until?: string; build?: boolean }) => {
    const args = ['logs']
    if (options?.lines) args.push('--lines', String(options.lines))
    if (options?.filter) args.push('--filter', options.filter)
    if (options?.since) args.push('--since', options.since)
    if (options?.until) args.push('--until', options.until)
    if (options?.build) args.push('--build')

    if (options?.lines) {
      return execJson(args, logEntrySchema.array(), options)
    }
    return execRaw(args, options)
  },

  domains: {
    generate: (options?: { service?: string; port?: number; domain?: string }) => {
      const args = ['domain']
      if (options?.domain) args.push(options.domain)
      if (options?.port) args.push('--port', String(options.port))
      return execJson(args, domainSchema, { service: options?.service })
    },
  },

  environments: {
    list: () =>
      execJson(['environment'], environmentSchema.array()),

    create: (name: string) =>
      execRaw(['environment', 'new', name]),

    remove: (name: string) =>
      execRaw(['environment', 'delete', name]),

    link: (name: string) =>
      execRaw(['environment', 'link', name]),
  },

  volumes: {
    list: (scope?: Scope) =>
      execJson(['volume', 'list'], volumeSchema.array(), scope),

    add: (scope?: Scope) =>
      execRaw(['volume', 'add'], scope),

    remove: (id: string) =>
      execRaw(['volume', 'delete', id]),
  },
} as const
