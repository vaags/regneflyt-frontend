<style global>
    @tailwind base;
    @tailwind components;

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

    @tailwind utilities;
</style>
