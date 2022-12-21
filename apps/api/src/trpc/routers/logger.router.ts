import {
	router,
	publicProcedure,
	TRPCError,
	z,
	observable,
	eventEmitter
} from '~trpc/index'

export const loggerRouter = router({
	getUsers: publicProcedure.query(async ({ ctx }) => {
		try {
			const user = await ctx.prisma.user.findMany()
			ctx.prisma.$disconnect()
			return user
		} catch (err: any) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: err.message,
				cause: err
			})
		}
	}),

	/** Subscription to user created events */
	onCreateUser: publicProcedure.subscription(({ ctx }) => {
		return observable<typeof ctx.prisma.user>((emit) => {
			const onCreateUser = (data: typeof ctx.prisma.user) => {
				emit.next(data)
			}

			eventEmitter.on('createUser', onCreateUser)

			return () => {
				eventEmitter.off('createUser', onCreateUser)
			}
		})
	}),

	createUrl: publicProcedure
		.input(
			z.object({
				in_bound_url: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const hash = (Math.random() * new Date().getTime()).toString(36)

				return hash
			} catch (err: any) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: err.message,
					cause: err
				})
			}
		})

	// createUser: publicProcedure
	// 	.input(
	// 		z.object({
	// 			email: z.string(),
	// 			name: z.string()
	// 		})
	// 	)
	// 	.mutation(async ({ input, ctx }) => {
	// 		try {
	// 			console.log(ctx.req.headers.cookie)
	// 			const newUser = await ctx.prisma.user.create({
	// 				data: {
	// 					name: input.name,
	// 					email: input.email
	// 				}
	// 			})
	// 			ctx.prisma.$disconnect()

	// 			eventEmitter.emit('createUser', newUser)
	// 			return 'success'
	// 		} catch (err: any) {
	// 			throw new TRPCError({
	// 				code: 'INTERNAL_SERVER_ERROR',
	// 				message: err.message,
	// 				cause: err
	// 			})
	// 		}
	// 	})
})
