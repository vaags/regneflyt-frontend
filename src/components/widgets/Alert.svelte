<script>
    export let message = "[Message]";
    export let heading = undefined;
    export let color = "blue";
</script>

<div class="bg-{color}-100 border-l-4 border-{color}-500 text-{color}-700 p-4" role="alert">
  {#if heading}
    <p class="font-bold">{heading}</p>
  {/if}
  <p>{message}</p>
</div>