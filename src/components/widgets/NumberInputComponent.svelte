<script lang="ts">
    import { onMount } from 'svelte'

    export let value: number = undefined
    export let displayError: boolean
    let ref: any

    onMount(function () {
        ref.focus()
    })
</script>

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

<input
    bind:value
    bind:this="{ref}"
    class="border {displayError ? 'validation-error-border' : ''} rounded w-24
    py-2 px-3 leading-tight focus:outline-none"
    type="number"
    placeholder="?" />
