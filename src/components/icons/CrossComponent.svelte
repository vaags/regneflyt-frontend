<script lang="ts">
    export let label: string
</script>

<div
    data-before=""
    data-after=""
    class="relative w-5 h-5 before:content after:content
            before:absolute before:w-5 before:h-1 before:bg-red-600 before:top-2 before:-rotate-45
            after:absolute after:w-5 after:h-1 after:bg-red-600 after:top-2 after:rotate-45"
    aria-label="{label}"
></div>
