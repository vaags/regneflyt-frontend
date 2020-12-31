<script lang="ts">
    export let title: string
</script>

<div
    data-before=""
    data-after=""
    class="relative w-5 h-5 rounded-full border-2 border-gray-700 before:content after:content
        before:absolute before:h-0.5 before:top-2 before:left-0.5 before:w-2 before:bg-gray-700 before:rounded-full
        after:absolute after:h-2 after:top-0.5 after:left-2 after:w-0.5 after:bg-gray-700 after:rounded-full">
    <span class="sr-only">{title}</span>
</div>
