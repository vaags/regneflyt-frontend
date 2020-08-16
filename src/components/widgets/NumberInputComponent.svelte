<script lang="ts">
    export let value: number
    export let min: number = 1
    export let max: number = 50
    export let step: number = 1
    export let id: string
</script>

<input
    {id}
    class="border rounded p-2 leading-tight block"
    type="number"
    {min}
    {max}
    {step}
    on:change
    bind:value />
