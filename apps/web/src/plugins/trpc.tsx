import { createTRPCProxyClient, createWSClient, httpBatchLink, wsLink, splitLink } from '@trpc/client'
import { $ } from '@builder.io/qwik'
import type { AppRouter } from '~approuter'
import superjson from 'superjson'

/** Ignore this */
export const trpcClient = $(() => {
    return createTRPCProxyClient<AppRouter>({
        transformer: superjson,
        links: [
            splitLink({
                condition(op) {
                    return op.type === 'subscription'
                },
                false: httpBatchLink({
                    url: `http://${import.meta.env.VITE_API_URL}/trpc`
                }),
                true: wsLink({
                    client: createWSClient({
                        url: `ws://${import.meta.env.VITE_SOCKET_URL}`
                    })
                })
            })
        ]
    })
})