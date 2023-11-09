<script>
	const cacheBust = Math.random().toString(36).slice(2);

	import Img from '@zerodevx/svelte-img';
	import Thomas from '$lib/assets/team/Thomas-Agarate.jpg?run';
	import Sacha from '$lib/assets/team/Sacha.jpg?run';
	import Eric from '$lib/assets/team/Eric-Brenner.jpg?run';

	const team = [
		{
			fname: 'Eric',
			lname: 'Brenner',
			title: 'Web Developer',
			bio: 'Eric is obsessed with design and efficiency. He’s joined forces in building websites for some huge brands to try to make the internet a more enjoyable place.',
			nationality: '🇺🇸',
			img: Eric,
		},
		{
			fname: 'Thomas',
			lname: 'Agaraté',
			title: 'Marketing Director',
			nationality: '🇫🇷',
			bio: 'He has two passions:<br>1. Find ways to onboard awesome customers onto his business<br />2. Build the most epic customer relationships so work feels like it’s not.',
			img: Thomas
		},
		{
			fname: 'Sacha',
			lname: 'Dumay',
			title: 'Data Engineer',
			nationality: '🇫🇷',
			bio: 'His days at ChatNode are pretty simple.<br>8-8:30am: Checking reports to see what our customers want next.<br>8:30-10pm : Building those features with Eric.<br>(Sometimes he skips lunch. He used to work as a data analyst for Wall Street so he no time for bulls**t)',
			img: Sacha,
			twitter: 'https://twitter.com/park_sacha_'
		}
	];
</script>

<svelte:head>
	<title>About | ChatNode</title>
	<meta
		name="description"
		content="We are passionate about building a startup in the very new and very exciting field of AI. We 	believe this technology should belong to everyone. We see ChatNode as a way to democratize the influence and value that AI can bring to the world."
	/>
</svelte:head>

<div class="container">
	<section id="company">
		<h1 class="text-2xl font-bold mb-5">The Company</h1>
		<div class="text-2xl max-w-4xl leading-9">
			<p>
				We are passionate about building a startup in the very new and very exciting field of AI. We
				believe this technology should belong to everyone. We see ChatNode as a way to democratize
				the influence and value that AI can bring to the world.
			</p>
			<p />
		</div>
	</section>

	<section class="my-20" id="team">
		<h1 class="text-2xl font-bold mb-2">The Team</h1>
		<div class="grid md:grid-cols-3 gap-8">
			{#each team as person}
				<div class="bg-neutral rounded-lg p-6">
					<div class="flex flex-wrap gap-4">
						<div class="sm:basis-1/3 md:basis-full lg:basis-1/3 max-w-[200px]">
							<Img
								src={person.img}
								width={400}
								height={400}
								class="rounded"
								alt={person.name}
								sizes="(min-width: 56rem) 138px, 100vw - 2rem"
							/>
						</div>
						<div class="md:mt-4">
							<div class="inline-block text-secondary text-xl font-bold">{person.fname}</div>
							<div class="inline-block text-xl font-light opacity-90">{person.lname}</div>
							{person.nationality}
							<h3>{person.title}</h3>
							{#if person.twitter}
								<a href={person.twitter} target="_blank" class="btn btn-circle btn-neutral btn-sm mt-4  btn-outline">
									<svg class="invert hover:invert-0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 128 128"><path d="M75.916 54.2L122.542 0h-11.05L71.008 47.06L38.672 0H1.376l48.898 71.164L1.376 128h11.05L55.18 78.303L89.328 128h37.296L75.913 54.2ZM60.782 71.79l-4.955-7.086l-39.42-56.386h16.972L65.19 53.824l4.954 7.086l41.353 59.15h-16.97L60.782 71.793Z"/></svg>
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
