<script lang="ts">
    import { slide } from 'svelte/transition'
    import type { TransitionDuration } from '../../models/TransitionDuration'
    import PanelComponent from '../widgets/PanelComponent.svelte'

    export let transitionDuration: TransitionDuration
</script>

<div transition:slide|local="{transitionDuration}" class="mb-1 md:mb-2">
    <PanelComponent>
        <div class="text-blue-800 text-lg">
            <p>Regneflyt er et mattespill som trener deg i hoderegning.</p>
        </div>
    </PanelComponent>
</div>
