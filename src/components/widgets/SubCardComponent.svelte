<script lang="ts">
    export let heading: string
</script>

<div class="flex flex-col">
    <div
        class="text-xs text-gray-100 py-1 px-2 bg-blue-800 rounded-tl rounded-tr">
        {heading}
    </div>
    <div
        class="py-1 px-2 border border-t-0 border-gray-500 rounded-bl rounded-br text-lg md:text-xl">
        <slot />
    </div>
</div>
