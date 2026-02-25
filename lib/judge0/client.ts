const JUDGE0_API_URL =
  process.env.JUDGE0_API_URL || 'https://judge0-ce.p.sulu.sh'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || ''

// Octave language ID in Judge0 CE
export const OCTAVE_LANGUAGE_ID = 32

const MAX_CODE_LENGTH = 10000
const EXECUTION_TIMEOUT_SECONDS = 10
const MAX_POLL_ATTEMPTS = 20
const POLL_INTERVAL_MS = 500

// Functions that should never be allowed in user code
const FORBIDDEN_PATTERNS = [
  /\bsystem\s*\(/,
  /\bunix\s*\(/,
  /\bdos\s*\(/,
  /\bperl\s*\(/,
  /\bpython\s*\(/,
  /\bjava\s*\(/,
  /\bfopen\s*\(.*(\/etc|\/proc|\/sys)/,
  /\bdelete\s*\(/,
  /\brmdir\s*\(/,
  /\bpkg\s+(install|uninstall)/,
]

export interface ExecutionResult {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  status: {
    id: number
    description: string
  }
  time: string | null
  memory: number | null
}

export interface SubmissionResponse {
  token: string
}

export class Judge0Error extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'Judge0Error'
  }
}

/**
 * Validate user code before submission.
 * Returns null if valid, or an error message if invalid.
 */
export function validateCode(code: string): string | null {
  if (!code.trim()) {
    return 'Code cannot be empty'
  }

  if (code.length > MAX_CODE_LENGTH) {
    return `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      return 'Code contains forbidden system commands'
    }
  }

  return null
}

/**
 * Wrap code with plot-saving logic for exercises that require plots.
 * Octave can save figures to files which we then return as base64.
 */
export function wrapCodeForPlot(code: string): string {
  return `graphics_toolkit("gnuplot");
figure("visible", "off");
${code}
print("/tmp/output.png", "-dpng", "-S640,480");
`
}

/**
 * Submit code to Judge0 for execution.
 */
export async function submitCode(
  code: string,
  options?: { requiresPlot?: boolean }
): Promise<string> {
  const finalCode = options?.requiresPlot ? wrapCodeForPlot(code) : code

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (JUDGE0_API_KEY) {
    headers['X-Auth-Token'] = JUDGE0_API_KEY
  }

  const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: finalCode,
      language_id: OCTAVE_LANGUAGE_ID,
      cpu_time_limit: EXECUTION_TIMEOUT_SECONDS,
      wall_time_limit: EXECUTION_TIMEOUT_SECONDS * 2,
      memory_limit: 128000, // 128 MB
    }),
  })

  if (!response.ok) {
    throw new Judge0Error(
      `Failed to submit code: ${response.statusText}`,
      response.status
    )
  }

  const data: SubmissionResponse = await response.json()
  return data.token
}

/**
 * Poll Judge0 for the result of a submission.
 */
export async function getResult(token: string): Promise<ExecutionResult> {
  const headers: Record<string, string> = {}
  if (JUDGE0_API_KEY) {
    headers['X-Auth-Token'] = JUDGE0_API_KEY
  }

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const response = await fetch(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,status,time,memory`,
      { headers }
    )

    if (!response.ok) {
      throw new Judge0Error(
        `Failed to get result: ${response.statusText}`,
        response.status
      )
    }

    const result: ExecutionResult = await response.json()

    // Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer, 5=TLE, 6=Compilation Error, etc.
    if (result.status.id > 2) {
      return result
    }

    // Still processing — wait and poll again
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  throw new Judge0Error('Execution timed out waiting for result')
}

/**
 * Submit code and wait for the result (convenience wrapper).
 */
export async function executeCode(
  code: string,
  options?: { requiresPlot?: boolean }
): Promise<ExecutionResult> {
  const validationError = validateCode(code)
  if (validationError) {
    return {
      stdout: null,
      stderr: validationError,
      compile_output: null,
      status: { id: -1, description: 'Validation Error' },
      time: null,
      memory: null,
    }
  }

  const token = await submitCode(code, options)
  return getResult(token)
}
