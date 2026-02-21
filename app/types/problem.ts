/**
 * RFC 7807 Problem Details for HTTP APIs
 * https://datatracker.ietf.org/doc/html/rfc7807
 */

import axios from 'axios'
import { z } from 'zod'

export interface ValidationError {
  field?: string
  message: string
}

export interface Problem {
  type?: string
  title: string
  status: number
  detail?: string
  instance?: string
  traceId?: string
  errors?: ValidationError[]
  fields?: Record<string, string>
}

function isProblem(error: unknown): error is Problem {
  if (typeof error !== 'object' || error === null) return false
  const p = error as Problem
  return typeof p.title === 'string' && typeof p.status === 'number'
}

function errorsToFields(errors?: ValidationError[]): Record<string, string> | undefined {
  if (!errors || errors.length === 0) return undefined

  return errors.reduce(
    (acc, err) => {
      if (err.field) {
        acc[err.field] = err.message
      }
      return acc
    },
    {} as Record<string, string>
  )
}

export function toProblem(error: unknown, fallbackTitle: string = 'An error occurred'): Problem {
  if (isProblem(error)) {
    return {
      ...error,
      fields: error.fields ?? errorsToFields(error.errors)
    }
  }

  if (axios.isAxiosError(error) && isProblem(error.response?.data)) {
    const data = error.response.data
    return {
      ...data,
      fields: data.fields ?? errorsToFields(data.errors)
    }
  }

  if (error instanceof z.ZodError) {
    const fields: Record<string, string> = {}
    error.issues.forEach((issue) => {
      const field = issue.path.join('.')
      fields[field] = issue.message
    })

    return {
      title: 'Validation failed',
      status: 400,
      detail: 'Please check the form fields and try again',
      fields
    }
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Network error',
      status: 0,
      detail: 'Unable to connect to the server. Please check your connection.'
    }
  }

  if (error instanceof Error) {
    return {
      title: fallbackTitle,
      status: 500,
      detail: error.message
    }
  }

  if (typeof error === 'string') {
    return {
      title: fallbackTitle,
      status: 500,
      detail: error
    }
  }

  return {
    title: fallbackTitle,
    status: 500,
    detail: 'An unexpected error occurred'
  }
}
