<script lang="ts">
    import type { ButtonColor } from '../../models/Color'
    export let color: ButtonColor = 'blue'
    export let disabled: boolean = false
    export let margin: boolean = false
</script>

<style>
    .btn-blue {
        @apply bg-blue-600;
        @apply border-blue-800;
    }

    .btn-blue:hover {
        @apply bg-blue-500;
        @apply border-blue-700;
    }

    .btn-green {
        @apply bg-green-600;
        @apply border-green-800;
    }

    .btn-green:hover {
        @apply bg-green-500;
        @apply border-green-700;
    }

    .btn-red {
        @apply bg-red-600;
        @apply border-red-800;
    }

    .btn-red:hover {
        @apply bg-red-500;
        @apply border-red-700;
    }

    .btn-yellow {
        @apply bg-yellow-600;
        @apply border-yellow-800;
    }

    .btn-yellow:hover {
        @apply bg-yellow-500;
        @apply border-yellow-700;
    }

    .btn-gray {
        @apply bg-gray-600;
        @apply border-gray-800;
    }

    .btn-gray:hover {
        @apply bg-gray-500;
        @apply border-gray-700;
    }
</style>

<button
    disabled="{disabled}"
    on:click|preventDefault
    class="text-gray-100 hover:text-white font-light text-3xl md:text-3xl px-4 py-1 border-b-2 border-l-4 {margin ? 'mr-1' : ''} rounded-tl-md rounded-br-md btn-{color} transition-colors
        duration-200 ease-out focus:outline-none {disabled ? 'opacity-50' : ''}">
    <slot />
</button>
