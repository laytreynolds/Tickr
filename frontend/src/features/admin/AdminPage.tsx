import { type FormEvent, useMemo, useState } from 'react'
import axios from 'axios'
import { apiClient } from '../../lib/apiClient'

type AdminValidationErrors = Partial<{
  phoneNumber: string
  password: string
  confirmPassword: string
}>

function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

function validatePhoneNumber(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Phone number is required.'
  if (trimmed.includes('@')) return 'Email is not supported. Use a phone number.'
  return null
}

export function AdminPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<AdminValidationErrors>({})

  const timezone = useMemo(() => getLocalTimezone(), [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const nextFieldErrors: AdminValidationErrors = {}
    const phoneNumberError = validatePhoneNumber(phoneNumber)
    if (phoneNumberError) nextFieldErrors.phoneNumber = phoneNumberError

    const trimmedPassword = password
    if (trimmedPassword.length < 8) {
      nextFieldErrors.password = 'Password must be at least 8 characters.'
    }
    if (trimmedPassword !== confirmPassword) {
      nextFieldErrors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(nextFieldErrors)
    if (Object.keys(nextFieldErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await apiClient.post('/api/v1/user/adduser', {
        phoneNumber: phoneNumber.trim(),
        timezone,
        password,
      })

      setPhoneNumber('')
      setPassword('')
      setConfirmPassword('')
      setSuccessMessage('User created.')
    } catch (err: unknown) {
      let message = 'Could not create user. Please try again.'
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 409) message = 'A user with that phone number already exists.'
        else if (status === 401) message = 'Session expired. Please sign in again.'
        else if (status === 400) message = 'Please check the details and try again.'
        else if (status != null && status >= 500) message = 'Server error. Please try again in a moment.'
      }

      setError(message)
      if (import.meta.env.DEV) {
        console.error('Create user failed', err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create user accounts. Only logged-in users can access this page.
          </p>
        </div>
      </header>

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {successMessage}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Create user
        </h2>

        <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="admin-phone"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Phone number
            </label>
            <input
              id="admin-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="07585585585"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:border-tickr-500 focus:ring-2 focus:ring-tickr-200"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              aria-invalid={fieldErrors.phoneNumber ? 'true' : undefined}
              aria-describedby={fieldErrors.phoneNumber ? 'admin-phone-error' : undefined}
            />
            {fieldErrors.phoneNumber && (
              <p id="admin-phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {fieldErrors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:border-tickr-500 focus:ring-2 focus:ring-tickr-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={fieldErrors.password ? 'true' : undefined}
              aria-describedby={fieldErrors.password ? 'admin-password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="admin-password-error" className="mt-1 text-sm text-red-600" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="admin-confirm-password"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Confirm password
            </label>
            <input
              id="admin-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:border-tickr-500 focus:ring-2 focus:ring-tickr-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={fieldErrors.confirmPassword ? 'true' : undefined}
              aria-describedby={fieldErrors.confirmPassword ? 'admin-confirm-password-error' : undefined}
            />
            {fieldErrors.confirmPassword && (
              <p
                id="admin-confirm-password-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Timezone: {timezone}
          </p>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg border border-tickr-500 bg-tickr-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-tickr-600 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tickr-500 focus-visible:ring-offset-2"
          >
            {isSubmitting ? 'Creating…' : 'Create user'}
          </button>
        </form>
      </section>
    </div>
  )
}
