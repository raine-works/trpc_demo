import express, { Request, Response, Application } from 'express'
import { Server } from 'ws'
import http from 'http'
import cors from 'cors'
import { expressRouter, mergeRouters, createContext } from '~trpc/index'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

/** Routers */
import { loggerRouter } from '~/trpc/routers/logger.router'

/** App router */
const appRouter = mergeRouters(loggerRouter)

const PORT = process.env.PORT ?? 8080

const app: Application = express()
const server = http.createServer(app)
const wss = new Server({ server })
export const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

const handler = applyWSSHandler<AppRouter>({
	wss,
	router: appRouter,
	createContext
})

wss.on('connection', (ws) => {
	console.log(`${wss.clients.size} currently connected`)

	ws.once('close', () => {
		console.log(`${wss.clients.size} currently connected`)
	})
})

/** HTTP Routes */
app.use('/trpc', expressRouter(appRouter))

/** Catch all route (must be last) */
app.use((req: Request, res: Response) => {
	res.status(404).json({ error: '404 - resource not found' })
})

server.listen(PORT, () => {
	console.log(`Server is listening at port ${PORT}`)
})

export type AppRouter = typeof appRouter

process.on('SIGTERM', () => {
	console.log('SIGTERM')
	handler.broadcastReconnectNotification()
	wss.close()
})
