import { hash } from 'bcrypt'
import { add } from 'date-fns'
import { z } from 'zod'

import { prisma } from '@/config/prisma'

const requestSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  affiliateId: z.string().optional(),
})

export async function POST(request: Request) {
  const body = await request.json()

  const payload = requestSchema.safeParse(body)

  if (!payload.success) {
    return Response.json(payload.error, {
      status: 400,
    })
  }

  const { data } = payload

  const [userFindedByEmail] = await Promise.all([
    prisma.user.findUnique({
      where: {
        email: data.email,
      },
    }),
  ])

  if (userFindedByEmail) {
    return Response.json('E-mail está em uso', {
      status: 409,
    })
  }

  if (data.affiliateId) {
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        affiliateId: data.affiliateId,
      },
    })

    if (!affiliate) {
      await prisma.affiliate.create({
        data: {
          affiliateId: data.affiliateId,
          balance: 0,
        },
      })
    }
  }

  const user = await prisma.user.create({
    data: {
      ...data,
      password: await hash(data.password, 8),
      license: 'trial',
      licensedUntil: add(new Date(), {
        days: 1 * 30,
      }),
      betsMade: 0,
    },
  })

  return Response.json(user)
}
