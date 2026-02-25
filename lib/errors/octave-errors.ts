const ERROR_PATTERNS: { pattern: RegExp; friendly: string }[] = [
  {
    pattern: /'(\w+)' undefined/,
    friendly:
      "You used a variable that doesn't exist yet. Check your spelling, or make sure you defined it on a line above.",
  },
  {
    pattern: /undefined near line/,
    friendly:
      "Something on this line hasn't been defined yet. Double-check that you created the variable or function before using it.",
  },
  {
    pattern: /parse error.*\n.*\^/,
    friendly:
      "There's a typo or syntax mistake in your code. Look near the ^ symbol — something is off there.",
  },
  {
    pattern: /parse error/i,
    friendly:
      "MATLAB couldn't understand your code. Check for missing parentheses, quotes, or semicolons.",
  },
  {
    pattern: /operator \(\)/,
    friendly:
      "You're trying to call something as a function that isn't one. Check your parentheses — maybe you used () on a variable instead of a function.",
  },
  {
    pattern: /nonconformant arguments/,
    friendly:
      "The sizes of your arrays don't match for this operation. Use size() to check dimensions before combining them.",
  },
  {
    pattern: /subscript indices/,
    friendly:
      "You tried to access an element that doesn't exist. The index is out of bounds — check your array length with length() or size().",
  },
  {
    pattern: /singular matrix/,
    friendly:
      "This matrix can't be inverted. It might have linearly dependent rows/columns. Check your data with det() or rank().",
  },
  {
    pattern: /index \(\d+\): out of bound/,
    friendly:
      "You tried to access position that's beyond the array's size. Check with length() to see how many elements exist.",
  },
  {
    pattern: /binary operator.*with a.*matrix/i,
    friendly:
      "You're mixing incompatible types in an operation. Make sure both sides of the operator are the same type (both numbers, both matrices, etc.).",
  },
  {
    pattern: /product.*nonconformant/,
    friendly:
      "Matrix multiplication requires the inner dimensions to match. For A*B, the number of columns in A must equal the number of rows in B.",
  },
  {
    pattern: /wrong type argument.*'cell'/,
    friendly:
      "You're treating a cell array like a regular array. Use curly braces {i} instead of parentheses (i) to access cell contents.",
  },
  {
    pattern: /invalid call to/,
    friendly:
      "You called a function with the wrong number of inputs. Check the function's expected arguments.",
  },
  {
    pattern: /error: for.*body.*empty/,
    friendly:
      "Your loop body is empty. Make sure you have code between 'for' and 'end'.",
  },
  {
    pattern: /unfinished string/,
    friendly:
      "You started a string with a quote but never closed it. Make sure every opening quote has a matching closing quote.",
  },
]

/**
 * Given raw Octave stderr, return a beginner-friendly explanation.
 * Returns null if no pattern matches (so the caller can fall back to raw text).
 */
export function friendlyError(stderr: string): string | null {
  for (const { pattern, friendly } of ERROR_PATTERNS) {
    if (pattern.test(stderr)) {
      return friendly
    }
  }
  return null
}
