<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    export let value: number | undefined = undefined
    export let min: number = -1000
    export let max: number = +1000
    export let step: number = 1
    export let id: string

    const dispatch = createEventDispatcher()

    $: isValid = value !== undefined && value >= min && value <= max

    $: {
        dispatch('isValid', { isValid, id })
        // console.log('dispatching isvalid: ', { isValid, id })
    }
</script>

<input
    id="e{id}"
    class="border rounded p-2 my-1 leading-tight block {!isValid ? 'border-red-600' : null}"
    type="number"
    {min}
    {max}
    {step}
    on:change
    bind:value />
