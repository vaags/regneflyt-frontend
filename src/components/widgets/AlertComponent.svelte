<script lang="ts">
    export let message = '[Message]'
    export let heading: string | undefined = undefined
    export let color = 'blue'
</script>

<div class="border-l-4 p-4 alert-{color}" role="alert">
    {#if heading}
        <p class="font-bold">{heading}</p>
    {/if}
    <p>{message}</p>
</div>
