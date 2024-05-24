import { z } from 'zod'

import { prisma } from '@/config/prisma'

interface Params {
  params: {
    affiliateId: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        affiliateId: params.affiliateId,
      },
      include: {
        users: {
          select: {
            userId: true,
            name: true,
            email: true,
            license: true,
            recurrency: true,
          },
        },
      },
    })

    if (!affiliate) {
      return Response.json('Não existe nenhum afilado com este ID', {
        status: 400,
      })
    }

    return Response.json(affiliate, {
      status: 201,
    })
  } catch (error) {
    return Response.json(
      'Um erro inesperado ocorreu, tente novamente mais tarde!',
      {
        status: 500,
      },
    )
  }
}

const patchSchema = z.object({
  amount: z.coerce.number().positive(),
})

export async function PATCH(request: Request, { params }: Params) {
  try {
    const data = await request.json()

    const payload = patchSchema.safeParse(data)

    if (!payload.success) {
      return Response.json('Os parametros não foram passados corretamentes', {
        status: 400,
      })
    }

    const findAffiliate = await prisma.affiliate.findFirst({
      where: {
        affiliateId: params.affiliateId,
      },
    })

    if (!findAffiliate) {
      return Response.json('Não existe nenhum afiliado com este ID', {
        status: 200,
      })
    }

    const { amount } = payload.data

    const balance = Number(findAffiliate.balance - amount)

    if (balance < 0) {
      return Response.json('O saldo não pode ser menor que o saque', {
        status: 400,
      })
    }

    await prisma.affiliate.update({
      where: {
        affiliateId: params.affiliateId,
      },
      data: {
        balance,
      },
    })

    return Response.json({
      status: 204,
    })
  } catch (error) {
    return Response.json(
      'Um erro inesperado ocorreu, tente novamente mais tarde!',
      {
        status: 500,
      },
    )
  }
}
