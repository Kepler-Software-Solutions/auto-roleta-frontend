import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/constants'
import { RegisterForm } from '@/components/pages/accounts/register'

export default async function Register() {
  const session = await getServerSession(authOptions)

  if (session) redirect('/dashboard')

  return <RegisterForm />
}
