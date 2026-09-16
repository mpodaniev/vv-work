import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { submitApplication } from '../../api/applications'
import ApplicationForm from './ApplicationForm'

vi.mock('../../api/applications', () => ({
  submitApplication: vi.fn(),
}))

const mockedSubmitApplication = vi.mocked(submitApplication)

async function fillValidContactInfo(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'John Doe')
  await user.type(screen.getByLabelText('Phone number'), '380671234567')
}

describe('ApplicationForm', () => {
  it('blocks submit and focuses the first invalid field when the form is entirely empty', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm />)

    await user.click(screen.getByRole('button', { name: 'Send application' }))

    expect(screen.getByText('Name must be at least 2 characters.')).toBeInTheDocument()
    expect(screen.getAllByText('Enter a phone number or a Telegram handle.')).toHaveLength(2)
    expect(screen.getByLabelText('Name')).toHaveFocus()
    expect(mockedSubmitApplication).not.toHaveBeenCalled()
  })

  it('focuses the phone field when the name is valid but no contact channel is filled in', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm />)

    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.click(screen.getByRole('button', { name: 'Send application' }))

    expect(screen.queryByText('Name must be at least 2 characters.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Phone number')).toHaveFocus()
    expect(mockedSubmitApplication).not.toHaveBeenCalled()
  })

  it('formats digits typed into the phone field into grouped chunks', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm />)

    await user.type(screen.getByLabelText('Phone number'), '3806712345')

    expect(screen.getByLabelText('Phone number')).toHaveValue('380 671 234 5')
  })

  it('optimistically shows the success state and submits a trimmed, +-prefixed payload', async () => {
    mockedSubmitApplication.mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    render(<ApplicationForm />)

    await fillValidContactInfo(user)
    await user.click(screen.getByRole('button', { name: 'Send application' }))

    expect(await screen.findByText("Thanks — we'll be in touch.")).toBeInTheDocument()
    expect(mockedSubmitApplication).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe', phone: '+380 671 234 567', telegram: undefined, message: undefined }),
    )
  })

  it('rolls back to an error state with a retry when the submission is rejected', async () => {
    mockedSubmitApplication.mockRejectedValueOnce({ message: 'Server exploded.', status: 500 })
    const user = userEvent.setup()
    render(<ApplicationForm />)

    await fillValidContactInfo(user)
    await user.click(screen.getByRole('button', { name: 'Send application' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Server exploded.')
    // Form data must survive the rollback rather than being wiped out.
    expect(screen.getByLabelText('Name')).toHaveValue('John Doe')

    const callsBeforeRetry = mockedSubmitApplication.mock.calls.length
    mockedSubmitApplication.mockResolvedValue(undefined)
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText("Thanks — we'll be in touch.")).toBeInTheDocument()
    // KNOWN BUG (not fixed here — production code is out of scope for this test):
    // ErrorState's "Try again" button doesn't set type="button", so inside this
    // <form> it defaults to type="submit". Clicking it fires both the onClick
    // handler (which calls submit()) AND a native form submission (which calls
    // submit() again via handleSubmit), so submitApplication ends up called
    // twice per retry click instead of once.
    expect(mockedSubmitApplication).toHaveBeenCalledTimes(callsBeforeRetry + 1)
  })
})
