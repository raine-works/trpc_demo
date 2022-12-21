import { component$, $, useStore, useServerMount$ } from '@builder.io/qwik'
import { trpcClient } from '../plugins/trpc'

export default component$(() => {
	const state = useStore({
		email: '',
		name: '',
		id: null as null | number
	})

	const createUrlRecord = $(async () => {
		const client = await trpcClient()
		const data = await client.createUrl.mutate({ in_bound_url: 'gay' })
		console.log(data)
	})


	const subscribe = $(async () => {
		const client = await trpcClient()
		client.onCreateUser.subscribe(undefined, {
			onData(data) {
				console.log('received', data)
			},

			onError(err) {
				console.log('error', err)
			}
		})
	})

	return (
		<>
			<section class="h-screen bg-slate-900 text-slate-100 flex justify-center items-center">
				<div class="w-4/5 md:w-2/3 lg:w-2/5">
					<p class="mb-3 ml-3 text-yellow-600">Hello Logger...</p>
					<div class="rounded-full w-full overflow-hidden flex shadow-xl">
						<input type="text" placeholder="Bounce URL" class="bg-slate-300 px-4 py-2 text-slate-900 focus:outline-none w-[80%]" />
						<button onClick$={createUrlRecord} class="w-[20%] bg-yellow-600 uppercase">Track</button>
					</div>
				</div>
			</section>
		</>
	)
})
