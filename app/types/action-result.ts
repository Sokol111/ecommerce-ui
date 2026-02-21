import type { Problem } from './problem'

export interface ActionSuccess<T = void> {
  success: true
  data: T
}

export interface ActionFailure {
  success: false
  error: Problem
}

export type ActionResult<T = void> = ActionSuccess<T> | ActionFailure
