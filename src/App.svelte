<script>
	import Menu from './components/Menu.svelte';
	import Results from './components/Results.svelte';
	import Quiz from './components/Quiz.svelte';

	let quiz = {
		duration: 5,
		minValue: 1,
		maxValue: 20,
		isStarted: false,
		isCompleted: false,
		operators: ['addisjon']
	}

	let puzzleSet;

	function startQuiz(event) {
		console.log('starting quiz', event.detail.quiz)
		quiz = event.detail.quiz
		quiz.isStarted = true;
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

<main class="container max-w-2xl mx-auto px-3 py-4">
	<h1 class="text-4xl font-light mb-8 text-center">Regneflyt</h1>
	{#if quiz.isCompleted}
		<Results
			puzzleSet={puzzleSet}
			on:resetQuiz={resetQuiz} />
	{:else if quiz.isStarted}
		<Quiz
			quiz={quiz}
			on:abortQuiz={abortQuiz}
			on:completeQuiz={completeQuiz} />
	{:else}
		<Menu
			quiz={quiz}
			on:startQuiz={startQuiz} />
	{/if}
</main>