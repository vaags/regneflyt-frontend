<script lang="ts">
    export let color: 'red' | 'blue' | 'yellow' = 'blue'
</script>

<p class="border-l-4 p-4 alert-{color} text-lg" role="alert">
    <slot />
</p>

<style>
    .alert-blue {
        @apply bg-blue-100;
        @apply border-blue-500;
        @apply text-blue-800;
    }

    .alert-yellow {
        @apply bg-yellow-100;
        @apply border-yellow-500;
        @apply text-yellow-800;
    }

    .alert-red {
        @apply bg-red-100;
        @apply border-red-500;
        @apply text-red-800;
    }
</style>
