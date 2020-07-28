<script lang="ts">
    export let value: any
    export let hiddenValue: any

    let showHiddenValue: boolean = false
</script>

<span
    on:click="{() => (showHiddenValue = !showHiddenValue)}"
    class="cursor-pointer">
    {showHiddenValue ? hiddenValue : value}
</span>
