<script lang="ts">
    export let color: 'red' | 'blue' | 'yellow' | 'green' | 'gray' = 'blue'
    export let disabled: boolean = false
    export let margin: boolean = false
</script>

<button
    on:click|preventDefault
    disabled="{disabled}"
    class="
    text-gray-100 hover:text-white font-light text-3xl px-4 pt-1 pb-1.5 
     border-b-2 border-r border-l-4 rounded-tl-lg rounded-br-lg
     outline-none focus:outline-none focus:text-white focus:ring-2 focus:ring-inset
        {margin &&
        'mr-1'} btn-{color} transition-all
        duration-200 ease-out {disabled &&
        'opacity-50'}"
>
    <slot />
</button>

<style>
    .btn-blue {
        @apply bg-blue-600;
        @apply border-blue-800;
    }

    .btn-blue:hover,
    .btn-blue:active {
        @apply bg-blue-700;
        @apply border-blue-900;
    }

    .btn-blue:focus {
        @apply ring-blue-300;
    }

    .btn-green {
        @apply bg-green-600;
        @apply border-green-800;
    }

    .btn-green:hover,
    .btn-green:active {
        @apply bg-green-700;
        @apply border-green-900;
    }

    .btn-green:focus {
        @apply ring-green-300;
    }

    .btn-red {
        @apply bg-red-600;
        @apply border-red-800;
    }

    .btn-red:hover,
    .btn-red:active {
        @apply bg-red-700;
        @apply border-red-900;
    }

    .btn-red:focus {
        @apply ring-red-300;
    }

    .btn-yellow {
        @apply bg-yellow-600;
        @apply border-yellow-800;
    }

    .btn-yellow:hover,
    .btn-yellow:active {
        @apply bg-yellow-700;
        @apply border-yellow-900;
    }

    .btn-yellow:focus {
        @apply ring-yellow-300;
    }

    .btn-gray {
        @apply bg-gray-600;
        @apply border-gray-800;
    }

    .btn-gray:hover,
    .btn-gray:active {
        @apply bg-gray-700;
        @apply border-gray-900;
    }

    .btn-gray:focus {
        @apply ring-gray-300;
    }
</style>
