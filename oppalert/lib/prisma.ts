import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Lazy initialization using Proxy
const prisma = new Proxy({} as any, {
  get: (target, prop) => {
    if (typeof window !== 'undefined') return undefined
    if (!globalThis.prisma) {
      globalThis.prisma = prismaClientSingleton()
    }
    return (globalThis.prisma as any)[prop]
  }
})

export default prisma

if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalThis.prisma = prisma
}
