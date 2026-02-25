import { describe, it, expect } from 'vitest'
import { validateCode, wrapCodeForPlot, OCTAVE_LANGUAGE_ID } from '@/lib/judge0/client'

describe('Judge0 Client', () => {
  describe('validateCode', () => {
    it('rejects empty code', () => {
      expect(validateCode('')).toBe('Code cannot be empty')
      expect(validateCode('   ')).toBe('Code cannot be empty')
    })

    it('rejects code exceeding max length', () => {
      const longCode = 'x'.repeat(10001)
      expect(validateCode(longCode)).toContain('maximum length')
    })

    it('accepts valid code within length limit', () => {
      expect(validateCode('disp("hello")')).toBeNull()
      expect(validateCode('x = 1:10; plot(x, x.^2);')).toBeNull()
    })

    it('rejects code with system() calls', () => {
      expect(validateCode('system("ls")')).toContain('forbidden')
      expect(validateCode('x = system("rm -rf /")')).toContain('forbidden')
    })

    it('rejects code with unix() calls', () => {
      expect(validateCode('unix("whoami")')).toContain('forbidden')
    })

    it('rejects code with dos() calls', () => {
      expect(validateCode('dos("dir")')).toContain('forbidden')
    })

    it('rejects code accessing sensitive paths via fopen', () => {
      expect(validateCode('fopen("/etc/passwd")')).toContain('forbidden')
    })

    it('allows normal fopen usage', () => {
      expect(validateCode('fopen("data.csv")')).toBeNull()
    })

    it('rejects pkg install commands', () => {
      expect(validateCode('pkg install signal')).toContain('forbidden')
    })

    it('allows loading datasets from the neuroscience data path', () => {
      expect(
        validateCode("data = load('/usr/share/neuroscience-data/spike_data.mat');")
      ).toBeNull()
      expect(
        validateCode("NEURO_DATA = '/usr/share/neuroscience-data';\ndata = load([NEURO_DATA '/ssvep_data.mat']);")
      ).toBeNull()
    })

    it('blocks directory traversal in load()', () => {
      expect(
        validateCode("load('../../etc/passwd')")
      ).toContain('forbidden')
      expect(
        validateCode("load('../../../etc/shadow')")
      ).toContain('forbidden')
    })

    it('allows normal code with math operations', () => {
      const code = `
        x = linspace(0, 2*pi, 100);
        y = sin(x);
        plot(x, y);
        title("Sine Wave");
      `
      expect(validateCode(code)).toBeNull()
    })
  })

  describe('wrapCodeForPlot', () => {
    it('wraps code with gnuplot setup and print command', () => {
      const code = 'plot(1:10, rand(1,10))'
      const wrapped = wrapCodeForPlot(code)

      expect(wrapped).toContain('graphics_toolkit("gnuplot")')
      expect(wrapped).toContain('figure("visible", "off")')
      expect(wrapped).toContain(code)
      expect(wrapped).toContain('print("/tmp/output.png"')
    })

    it('preserves original code in the middle', () => {
      const code = `x = 1:10;
y = x.^2;
plot(x, y);
title("Quadratic");`
      const wrapped = wrapCodeForPlot(code)
      expect(wrapped).toContain(code)
    })
  })

  describe('constants', () => {
    it('uses correct Octave language ID', () => {
      expect(OCTAVE_LANGUAGE_ID).toBe(32)
    })
  })
})
