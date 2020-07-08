<script>
	import Menu from './components/Menu.svelte';
	import Results from './components/Results.svelte';
	import Quiz from './components/Quiz.svelte';

	let quiz = {
		length: 5,
		isStarted: false,
		isCompleted: false
	}

	function startQuiz(event) {
		quiz.length = event.detail.length
		quiz.isStarted = true;
	}

	function abortQuiz(event) {
		quiz.isStarted = false;
	}

	function completeQuiz(event) {
		quiz.isCompleted = true;
	}

	function resetQuiz() {
		quiz.isCompleted = false;
		quiz.isStarted = false;
	}
</script>

<main class="container mx-auto px-8 py-4 text-center">
	<h1 class="text-4xl mb-8">Regneflyt</h1>
	{#if quiz.isCompleted}
		<Results on:resetQuiz={resetQuiz} />
	{:else if quiz.isStarted}
		<Quiz length="{quiz.length}" on:abortQuiz={abortQuiz} on:completeQuiz={completeQuiz} />
	{:else}
		<Menu length="{quiz.length}" on:startQuiz={startQuiz} />
	{/if}
</main>