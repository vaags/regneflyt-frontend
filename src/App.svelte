<script>
	import Menu from './components/Menu.svelte';
	import Results from './components/Results.svelte';
	import Quiz from './components/Quiz.svelte';

	let quiz = {
		length: 5,
		isStarted: false,
		isCompleted: false,
		operators: ['addisjon']
	}

	let puzzleSet;

	function startQuiz(event) {
		quiz.length = event.detail.length
		quiz.operators = event.detail.operators
		quiz.isStarted = true;
		quiz.showAlernateGreeting = true;
	}

	function abortQuiz(event) {
		quiz.isStarted = false;
	}

	function completeQuiz(event) {
		quiz.isCompleted = true;
		puzzleSet = event.detail.puzzleSet;
	}

	function resetQuiz() {
		quiz.isCompleted = false;
		quiz.isStarted = false;
	}
</script>

<main class="container mx-auto px-3 py-4">
	<h1 class="text-5xl font-light mb-8 text-center">Regneflyt</h1>
	{#if quiz.isCompleted}
		<Results
			puzzleSet={puzzleSet}
			on:resetQuiz={resetQuiz} />
	{:else if quiz.isStarted}
		<Quiz
			length={quiz.length}
			operators={quiz.operators}
			on:abortQuiz={abortQuiz}
			on:completeQuiz={completeQuiz} />
	{:else}
		<Menu
			length={quiz.length}
			operators={quiz.operators}
			on:startQuiz={startQuiz} />
	{/if}
</main>