<script>
	const team = [{ fname: 'Eric', lname: 'Brenner', title: 'Web Developer', bio: 'Eric Brenner has been freelance web designer and developer since he was a teenager.', nationality: '🇺🇸' }, { fname: 'Sacha', lname: 'Dumay', title: 'Data Engineer', nationality: '🇫🇷'}, { fname: 'Thomas', lname: 'Agaraté', title: 'Marketing Director', nationality: '🇫🇷'}];
</script>

<div class="container">
	<h1 class="text-2xl font-bold">About the Company</h1>

	<section class="my-20">
        <h1 class="text-2xl font-bold">About the Team</h1>
        <div class="grid grid-cols-3">
            {#each team as person}
                    <div>
                        <img src="https://picsum.photos/500/500" alt="" class=" w-full mb-4">
                        <div class="px-4">
                            <div class="flex items-center gap-2">
                                <h2>
                                    <div class="inline-block text-secondary text-xl font-bold">{person.fname}</div>
                                    <div class="inline-block text-xl font-light opacity-90">{person.lname}</div>
                                </h2>
                                {person.nationality}
                            </div>
                            <p>{person.title}</p>
                            <p class="text-gray-400 mt-4 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                        </div>
                    </div>
                {/each}
        </div>
    </section>
</div>
