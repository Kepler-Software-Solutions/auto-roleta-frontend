import { add } from 'date-fns'
import { z } from 'zod'

import { prisma } from '@/config/prisma'
import { pricing } from '@/constants/pricing'

const SubscribeSchema = z.object({
  data: z.object({
    amount: z.union([
      z.literal(3699),
      z.literal(6999),
      z.literal(14900),
      z.literal(24900),
    ]),
    customer: z.object({
      name: z.string(),
      email: z.string().email(),
      document: z.object({
        type: z.enum(['cpf']),
        number: z.string(),
      }),
    }),
  }),
})

export async function POST(request: Request) {
  const body = await request.json()

  console.log(JSON.stringify(body))

  const data = SubscribeSchema.safeParse(body)

  if (!data.success) {
    return Response.json(data.error, {
      status: 400,
    })
  }

  const { customer, amount } = data.data.data

  const user = await prisma.user.findUnique({
    where: {
      email: customer.email,
    },
  })

  if (!user) {
    return Response.json('User not found', {
      status: 404,
    })
  }

  if (user.affiliateId) {
    const affiliate = await prisma.affiliate.findFirst({
      where: { affiliateId: user.affiliateId },
    })

    await prisma.affiliate.update({
      where: { affiliateId: user.affiliateId },
      data: { balance: Number(affiliate!.balance + amount * 0.6) },
    })
  }

  const price = pricing[amount]

  const months = {
    monthly: 1,
    quarterly: 3,
    annually: 12,
  }[price.recurrency!]

  await prisma.user.update({
    where: {
      email: customer.email,
    },
    data: {
      recurrency: price.recurrency,
      license: price.license,
      licensedUntil: add(new Date(), {
        months,
      }),
    },
  })

  return Response.json(data, {
    status: 200,
  })
}
