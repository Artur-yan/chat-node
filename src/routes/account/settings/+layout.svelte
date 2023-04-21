<script lang="ts">
	import { goto } from "$app/navigation";

	const redirectToStripeBilling = async () => {
		try {
			const res = await fetch('/api/account/billing', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: ''
			});
			const url = await res.json();
			console.log(url)
			goto(url);
		} catch (err) {
			console.error(err);
		}
	};	
</script>


<div class="container flex justify-between items-end">
	<h1 class="font-bold text-lg text-secondary">Account</h1>
	<div class="btn-group">
		<a href="/account/settings" class="btn text-primary btn-sm">Account settings</a>
		<a href="/account/settings/plan" class="btn text-primary btn-sm">Change Plan</a>

		<button class="btn text-primary btn-sm" on:click={redirectToStripeBilling}>Billing history/Payment</button>
	</div>
</div>

<slot />
