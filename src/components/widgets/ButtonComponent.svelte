<script lang="ts">
    export let color = 'blue'
    export let disabled: boolean = false
</script>

<style>
    .btn-blue {
        @apply bg-blue-600;
        @apply border-blue-700;
    }

    .btn-blue:hover {
        @apply bg-blue-700;
        @apply border-blue-800;
    }

    .btn-green {
        @apply bg-green-600;
        @apply border-green-700;
    }

    .btn-green:hover {
        @apply bg-green-700;
        @apply border-green-800;
    }

    .btn-red {
        @apply bg-red-600;
        @apply border-red-700;
    }

    .btn-red:hover {
        @apply bg-red-700;
        @apply border-red-800;
    }

    .btn-yellow {
        @apply bg-yellow-600;
        @apply border-yellow-700;
    }

    .btn-yellow:hover {
        @apply bg-yellow-700;
        @apply border-yellow-800;
    }

    .btn-purple {
        @apply bg-purple-600;
        @apply border-purple-700;
    }

    .btn-purple:hover {
        @apply bg-purple-700;
        @apply border-purple-800;
    }

    .btn-gray {
        @apply bg-gray-600;
        @apply border-gray-700;
    }

    .btn-gray:hover {
        @apply bg-gray-700;
        @apply border-gray-800;
    }
</style>

<button
    disabled="{disabled}"
    on:click|preventDefault
    class="text-white font-light text-3xl px-4 border-b-2 rounded btn-{color} transition-colors
        duration-200 ease-out focus:outline-none">
    <slot />
</button>
