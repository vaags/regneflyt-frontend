<script>
	import Menu from './components/Menu.svelte';
	import Results from './components/Results.svelte';
	import Quiz from './components/Quiz.svelte';

	let quiz = {
		duration: 5,
		partOne: {
			minValue: 1,
			maxValue: 20,
		},
		partTwo: {
			minValue: 1,
			maxValue: 20,
		},
		isStarted: false,
		isCompleted: false,
		operators: [
			'Addisjon',
			'Subtraksjon',
			'Multiplikasjon',
			'Divisjon',
			'Alle'
		],
		selectedOperator: 'addisjon'
	}

	let puzzleSet;
	let displayGreeting = true;

	function startQuiz(event) {
		console.log('starting quiz', event.detail.quiz)
		quiz = event.detail.quiz
		quiz.isStarted = true;
		displayGreeting = false;
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

<main class="container max-w-xl mx-auto px-3 pt-1 pb-4">
	<h1 class="text-4xl font-light text-orange-600 mb-2 text-right">Regneflyt</h1>
	{#if displayGreeting}
		<div class="card text-blue-700">
			<p class="mb-2">
			Regneflyt trener deg i hoderegning.
			</p>
			<p>Velg hvordan du ønsker å trene nedenfor. Når tiden er ute vil du få en vurdering.</p>
		</div>
	{/if}
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