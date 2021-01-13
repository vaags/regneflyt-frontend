<script lang="ts">
    import { onMount, afterUpdate } from 'svelte'

    export let value: number | undefined = undefined
    export let displayError: boolean
    export let disabled: boolean = false
    export let focus: boolean = true
    let ref: any

    function focusInput() {
        if (focus) {
            ref.focus()
        }
    }

    afterUpdate(() => {
        focusInput()
    })

    onMount(() => {
        focusInput()
    })
</script>

<input
    disabled="{disabled}"
    bind:value
    bind:this="{ref}"
    class="border {displayError
        ? 'border-red-600'
        : ''} rounded w-24 py-2
        px-3 leading-tight focus:outline-none text-4xl md:text-5xl"
    type="number"
    inputmode="numeric"
    pattern="[0-9]*"
    placeholder="?"
/>

<style>
    /* Remove arrows from number input */

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type='number'] {
        -moz-appearance: textfield;
    }

    ::-webkit-input-placeholder {
        text-align: center;
    }

    ::-moz-placeholder {
        text-align: center;
    }
</style>
