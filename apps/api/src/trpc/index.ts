import { initTRPC, inferAsyncReturnType, Router, TRPCError } from '@trpc/server'
import {
	CreateExpressContextOptions,
	createExpressMiddleware
} from '@trpc/server/adapters/express'
import { Request, Response } from 'express'
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http'
import superjson from 'superjson'
import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'events'
import { z } from 'zod'
import { IncomingMessage } from 'http'
import ws from 'ws'
import { prisma } from '../server'

export const eventEmitter = new EventEmitter()

type APIContext = {
	readonly prisma: typeof prisma
	readonly req: Request
	readonly res: Response
	readonly user: {
		name: string
		email: string
	}
}

export const createContext = ({
	req,
	res
}:
	| NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
	| CreateExpressContextOptions) =>
	({
		req,
		res,
		prisma,
		user: {
			name: '',
			email: ''
		}
	} as APIContext)

type Context = inferAsyncReturnType<typeof createContext>

export const trpc = initTRPC.context<Context>().create({
	transformer: superjson,

	errorFormatter({ shape }) {
		return shape
	}
})

export const { router, middleware, mergeRouters } = trpc
export const publicProcedure = trpc.procedure

export const expressRouter = (router: Router<any>) => {
	return createExpressMiddleware({
		router: mergeRouters(router),
		createContext
	})
}

export { TRPCError, observable, EventEmitter, z }
