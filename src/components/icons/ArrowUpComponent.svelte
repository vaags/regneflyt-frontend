<script lang="ts">
    export let label: string
</script>

<div
    data-before=""
    data-after=""
    class="relative inline-block w-4 h-5 before:content after:content
    after:absolute after:top-1 after:w-3 after:h-3 after:left-1 after:border-green-600 after:border-t-4 after:border-l-4 after:rotate-45
    before:absolute before:top-1 before:w-1 before:h-5 before:left-2 before:bg-green-600"
    aria-label="{label}"
></div>
