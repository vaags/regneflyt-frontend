<script lang="ts">
    export let message = '[Message]'
    export let heading: string | undefined = undefined
    export let color = 'blue'
    export let topMargin: boolean = true
    export let bottomMargin: boolean = true
</script>

<div
    class="{topMargin ? 'mt-4' : ''}
    {bottomMargin ? 'mb-4' : ''} border-l-4 p-4 alert-{color}"
    role="alert">
    {#if heading}
        <p class="font-bold">{heading}</p>
    {/if}
    <p>{message}</p>
</div>
