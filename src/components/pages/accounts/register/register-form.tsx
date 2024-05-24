'use client'
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Lock, Message } from 'react-iconly'
import { z } from 'zod'

import { Button, Input } from '@/components/shared'
import { FacebookPixel } from '@/components/shared/facebook-pixel'
import { toast } from '@/config/toast'

const RegisterSchema = z
  .object({
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z.string().min(6, 'A senha precisa ter, no mínimo, 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'A senha precisa ter, no mínimo, 6 caracteres'),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export function RegisterForm() {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false)

  const searchParams = useSearchParams()
  const affiliateId = searchParams.get('affiliateId')

  const router = useRouter()

  const { handleSubmit, register, formState } = useForm<
    z.infer<typeof RegisterSchema>
  >({
    resolver: zodResolver(RegisterSchema),
  })

  const handlePasswordVisibilityChange = () => {
    setPasswordIsVisible((visibility) => !visibility)
  }

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      if (!data.acceptTerms) {
        toast.error(
          'Para prosseguir é necessário que você concorde com os nossos termos e condições',
        )
        return
      }

      const payload = {
        name: data.email.split('@')[0],
        email: data.email,
        password: data.password,
        affiliateId: affiliateId !== null ? affiliateId : undefined,
      }

      const user = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (!user.ok) {
        const message = await user.json()
        toast.error(message)
        return
      }

      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (!response?.ok || response?.error) {
        toast.error('Verifique as suas credenciais e tente novamente')
        return
      }

      router.push('/dashboard')
    } catch (error) {
      toast.error('Verifique as suas credenciais e tente novamente')
    }
  }

  return (
    <form
      className="flex flex-col items-center rounded-xl bg-[#27282d] px-5 py-11 sm:px-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative h-[3.125rem] w-[3.125rem]">
        <Image src="/images/shared/logo-simple.svg" alt="Logo" fill />
      </div>

      <strong className="mt-6 text-center text-xl font-medium text-white">
        Bem-vindo
      </strong>
      <span className="mt-2 text-center text-sm text-[#8b8d97]">
        Crie sua conta
      </span>

      <div className="mt-10 flex w-full flex-col gap-6">
        <Input
          type="email"
          placeholder="E-mail"
          leftElement={<Message set="light" primaryColor="#6E7079" size={24} />}
          error={formState.errors.email?.message}
          {...register('email')}
        />
        <Input
          type={passwordIsVisible ? 'text' : 'password'}
          placeholder="Senha"
          leftElement={<Lock set="light" primaryColor="#6E7079" size={24} />}
          rightElement={
            <button
              type="button"
              className="transition-all hover:opacity-75 active:brightness-90"
              onClick={handlePasswordVisibilityChange}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_864_359)">
                  <path
                    d="M6.59996 2.82667C7.05885 2.71925 7.52867 2.66556 7.99996 2.66667C12.6666 2.66667 15.3333 8 15.3333 8C14.9286 8.75707 14.446 9.46982 13.8933 10.1267M9.41329 9.41333C9.23019 9.60983 9.00939 9.76744 8.76406 9.87675C8.51873 9.98606 8.25389 10.0448 7.98535 10.0496C7.71681 10.0543 7.45007 10.0049 7.20103 9.90433C6.952 9.80374 6.72577 9.65402 6.53586 9.4641C6.34594 9.27418 6.19622 9.04796 6.09563 8.79893C5.99504 8.54989 5.94564 8.28315 5.95038 8.01461C5.95512 7.74606 6.0139 7.48123 6.12321 7.2359C6.23252 6.99057 6.39013 6.76976 6.58663 6.58667M11.96 11.96C10.8204 12.8287 9.4327 13.3099 7.99996 13.3333C3.33329 13.3333 0.666626 8 0.666626 8C1.49589 6.4546 2.64605 5.1044 4.03996 4.04L11.96 11.96Z"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0.666626 0.666664L15.3333 15.3333"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_864_359">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          }
          error={formState.errors.password?.message}
          {...register('password')}
        />
        <Input
          type={passwordIsVisible ? 'text' : 'password'}
          placeholder="Confirme sua senha"
          leftElement={<Lock set="light" primaryColor="#6E7079" size={24} />}
          rightElement={
            <button
              type="button"
              className="transition-all hover:opacity-75 active:brightness-90"
              onClick={handlePasswordVisibilityChange}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_864_359)">
                  <path
                    d="M6.59996 2.82667C7.05885 2.71925 7.52867 2.66556 7.99996 2.66667C12.6666 2.66667 15.3333 8 15.3333 8C14.9286 8.75707 14.446 9.46982 13.8933 10.1267M9.41329 9.41333C9.23019 9.60983 9.00939 9.76744 8.76406 9.87675C8.51873 9.98606 8.25389 10.0448 7.98535 10.0496C7.71681 10.0543 7.45007 10.0049 7.20103 9.90433C6.952 9.80374 6.72577 9.65402 6.53586 9.4641C6.34594 9.27418 6.19622 9.04796 6.09563 8.79893C5.99504 8.54989 5.94564 8.28315 5.95038 8.01461C5.95512 7.74606 6.0139 7.48123 6.12321 7.2359C6.23252 6.99057 6.39013 6.76976 6.58663 6.58667M11.96 11.96C10.8204 12.8287 9.4327 13.3099 7.99996 13.3333C3.33329 13.3333 0.666626 8 0.666626 8C1.49589 6.4546 2.64605 5.1044 4.03996 4.04L11.96 11.96Z"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0.666626 0.666664L15.3333 15.3333"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_864_359">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          }
          error={formState.errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="relative flex items-center gap-3 px-2">
          <div className="flex h-6 items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-[#8E8E8E] bg-[#27282D] text-[#e51e3e] focus:ring-[#e51e3e] focus:ring-offset-0"
              {...register('acceptTerms')}
            />
          </div>
          <label htmlFor="terms" className="text-sm font-medium text-[#abafb1]">
            Li e concordo com os{' '}
            <a
              href="/docs/termos-e-condicoes-auto-roleta.pdf"
              download
              className="text-[#e51e3e] transition-all hover:underline hover:opacity-75"
            >
              termos e condições
            </a>
            .
          </label>
        </div>
      </div>

      <span className="my-8 text-center text-sm text-[#abafb1]">
        Já tem uma conta?{' '}
        <Link
          href="/accounts/login"
          className="text-[#e51e3e] transition-all hover:underline hover:opacity-75"
        >
          Entre aqui
        </Link>
      </span>

      <Button type="submit" isLoading={formState.isSubmitting}>
        Cadastrar-se
      </Button>

      <FacebookPixel />
    </form>
  )
}
