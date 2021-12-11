<script lang="ts">
    export let label: string
</script>

<div
    data-before=""
    data-after=""
    class="relative inline-block w-4 h-5 before:content after:content
    after:absolute after:-bottom-0.5 after:w-3 after:h-3 after:border-red-600 after:border-b-4 after:border-l-4 after:-rotate-45 after:left-1
    before:absolute before:-bottom-0.5 before:w-1 before:h-5 before:left-2 before:bg-red-600"
    aria-label="{label}"
></div>
