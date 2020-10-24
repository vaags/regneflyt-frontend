<script lang="ts">
    export let color = 'blue'
</script>

<p class="border-l-4 p-4 alert-{color}" role="alert">
    <slot />
</p>
