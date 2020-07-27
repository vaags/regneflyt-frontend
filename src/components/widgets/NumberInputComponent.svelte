<script lang="ts">
    import { afterUpdate } from 'svelte'

    export let value: number | undefined = undefined
    export let displayError: boolean
    export let disabled: boolean = false
    export let showWarning: boolean = false
    let ref: any

    afterUpdate(() => {
        if (!showWarning) {
            ref.focus()
        }
    })
</script>

<input
    {disabled}
    bind:value
    bind:this="{ref}"
    class="border {displayError ? 'validation-error-border' : ''} rounded w-24
    py-2 px-3 leading-tight focus:outline-none"
    type="number"
    placeholder="?" />
