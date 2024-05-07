<template>
    <div class="inpt-container" @click="toggle_input">
        <input type="checkbox" ref="inpt" hidden checked >
        <div class="dot"></div>
    </div>
</template>

<script lang="ts" setup>
    import {ref, defineEmits, defineProps, onMounted} from "Vue"
import type { Permission } from "../composables/ga";

    const emits = defineEmits(["updated"])

    const props = defineProps({
        permission: {
            required: true,
            type: String
        }
    })

    const inpt = ref()

    const toggle_input = () => {
        let input = inpt.value as HTMLInputElement

        input.checked = !input.checked

        const perm: {
            permission: String,
            granted: Permission
        } = {
            permission: props.permission,
            granted: input.checked ? "granted" : "denied"
        }

        emits("updated", perm)
    }
</script>

<style lang="css" scoped>
    .inpt-container {
        text-align: left;
        position: relative;
        width: 40px;
        height: 20px;
        border-radius: 10000px;
        background: #F1F4FD;
        border: 2px solid #E3E7F7;
        box-sizing: border-box;
        cursor: pointer;
        transition: .12s;

        &:has(input[type=checkbox]:checked) {
            background: #131339;
            border-color: #131339;
        }
    }

    input[type=checkbox] {
        position: absolute;
        top: 0;
        left: 0;
    }

    .dot {
        display: block;
        height: calc(100% - 2px);
        aspect-ratio: 1 / 1;
        background: #131339;
        border-radius: 100%;
        position: absolute;
        left: 1px;
        top: .5px;
        transition: .12s;
    }

    input[type=checkbox]:checked {
        & + .dot {
            left: 36px;
            transform: translateX(-100%);
            background: #F1F4FD;
        }
    }
</style>