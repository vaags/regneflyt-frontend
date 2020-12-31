<script lang="ts">
    export let title: string
</script>

<div
    data-before=""
    data-after=""
    class="relative w-3.5 h-3.5 before:content after:content transform rotate-25.5
            before:absolute before:right-0 before:w-3.5 before:h-3.5 before:bg-yellow-500 before:transform
            after:absolute after:right-0 after:w-3.5 after:h-3.5 after:bg-yellow-500 after:transform after:rotate-45">
    <span class="sr-only">{title}</span>
</div>
