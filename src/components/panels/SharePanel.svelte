<script lang="ts">
    import * as animateScroll from 'svelte-scrollto'
    import PanelComponent from '../widgets/PanelComponent.svelte'
    import { slide } from 'svelte/transition'
    import { onMount } from 'svelte'
    import LabelComponent from '../widgets/LabelComponent.svelte'
    import type { TransitionDuration } from '../../models/TransitionDuration'

    export let transitionDuration: TransitionDuration

    let textAreaDom: any
    let titleDom: any
    let shareLinkCopied: boolean
    let shareTitle: string

    function copyShareLinkToClipboard() {
        textAreaDom.focus()
        textAreaDom.select()

        const successful = document.execCommand('copy')
        if (!successful) {
            console.error('unable to copy share link')
        } else {
            shareLinkCopied = true
        }
    }

    onMount(() => {
        titleDom.focus()
        animateScroll.scrollToBottom()
    })
</script>

<div transition:slide|local="{transitionDuration}">
    <PanelComponent heading="Deling">
        <label class="text-lg"
            >Tittel
            <input
                type="text"
                maxlength="50"
                bind:this="{titleDom}"
                on:keyup="{() => (shareLinkCopied = false)}"
                class="rounded w-3/4 block text-lg"
                bind:value="{shareTitle}"
            />
        </label>
        <label class="block mt-4">
            <span class="text-lg">Lenke</span>
            <span class="float-right">
                <LabelComponent on:click="{copyShareLinkToClipboard}">
                    {shareLinkCopied ? 'Kopiert!' : 'Trykk for å kopiere'}
                </LabelComponent>
            </span>
            <textarea
                class="rounded w-full font-mono text-xs"
                rows="4"
                bind:this="{textAreaDom}"
                value="{window.location.protocol +
                    '//' +
                    window.location.host +
                    window.location.pathname +
                    window.location.search}&title={encodeURIComponent(
                    shareTitle
                )}&showSettings=false"></textarea>
        </label>
    </PanelComponent>
</div>
