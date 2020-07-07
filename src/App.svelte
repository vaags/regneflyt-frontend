<script>
	import Menu from './components/Menu.svelte';

	function startGame(event) {

		console.log('starting game with lenght:', event.detail.length)
	}
</script>

<main class="container mx-auto px-8 py-4">
	<h1 class="text-center text-4xl mb-8">Regneflyt</h1>
	<Menu on:newGame={startGame} />
</main>