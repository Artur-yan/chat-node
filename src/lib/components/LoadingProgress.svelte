<script>
	import { navigating } from '$app/stores';
</script>

<progress
	class="progress rounded-none progress-primary h-[1px] hidden absolute"
	class:!block={$navigating}
/>
