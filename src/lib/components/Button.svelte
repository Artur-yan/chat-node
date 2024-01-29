<script lang="ts">
	export let question: any;
	export let bgColor: string = '#1A1A1A';
	export let bgDepthColor: string = '#404040';
	export let functionToCall: any;

</script>


<button 
	class="pushable font-medium mt-2" 
	style="background: {bgDepthColor}"
	on:click|preventDefault={functionToCall(question.value, question.label)}
> 
	<span class="front" style="background: {bgColor};">{question.label}</span>
</button>

<style>
	.pushable {
		border-radius: 12px;
		border: none;
		padding: 0;
		cursor: pointer;
		outline-offset: 4px;
	}
	.front {
		display: block;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 0.9rem;
		color: white;
		transform: translateY(-4px);
	}

	.pushable:active .front {
		transform: translateY(-2px);
	}
</style>
