<script>
	import Menu from './components/Menu.svelte';
	import Quiz from './components/Quiz.svelte';

	let quiz = {
		length: 5,
		isStarted: false,
		isCompleted: false,
		isAborted: false
	}

	function startQuiz(event) {
		console.log('starting game with lenght:', event.detail.length)
		quiz.isStarted = true;
	}

	function abortQuiz(event) {
		quiz.isAborted = true;
	}
</script>

<main class="container mx-auto px-8 py-4">
	<h1 class="text-center text-4xl mb-8">Regneflyt</h1>
	{#if quiz.isCompleted}
		<p>Game completed</p>
	{:else if quiz.isAborted}
		<p>Game aborted</p>
	{:else if quiz.isStarted}
		<Quiz {...quiz} on:abortQuiz={abortQuiz} />
	{:else}
		<Menu on:startQuiz={startQuiz} />
	{/if}
</main>