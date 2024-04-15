<script setup>
import {basicSetup, EditorView} from "codemirror"
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { onMounted, watch,defineEmits, reactive, ref } from "vue";

let props = defineProps({
    js:{type:String},
    form: {type:Object}
})

const jsCode = ref(props.js)

let form = reactive(JSON.parse(JSON.stringify(props.form)))

let emit = defineEmits();

let editorView = null
let debounceTimer = null

watch(()=>props.js,()=>reloadCSS(),{deep:true})

function reloadCSS(){
    let cursor = editorView.state.selection.main.head
    let scrollAmt = document.getElementById('code-mirror-parent-js').scrollTop
    if(debounceTimer != null) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=>{
        reloadCSSEditor(cursor, scrollAmt);
    },500);
}

function reloadCSSEditor(cursor, scrollAmt){
    editorView.dispatch({changes:[{
            from: 0,
            to: editorView.state.doc.length,
            insert: props.js
    }]});
    editorView.dispatch(editorView.state.update({ selection: { anchor: cursor, head: cursor } }));
    setTimeout(()=>document.getElementById('code-mirror-parent-js').scrollTo(0,scrollAmt),1)
}

onMounted(()=>{
    document.getElementById('code-mirror-parent-js').onkey
    editorView = new EditorView({
        doc: props.js,
        extensions: [basicSetup, javascript(),
            EditorView.updateListener.of(function(e) {
                jsCode.value = e.state.doc.toString()
            }),
            keymap.of([
                indentWithTab
            ]),
        ],
        parent: document.getElementById('code-mirror-parent-js')
    })
})


</script>

<template>

    <div class="flex gap-2 mb-2">

        <div class="max-h-[150px] overflow-auto p-2 border flex-grow">
            <h3 class="font-bold">Field IDs:</h3>       
            <p class="font-semibold">Your Field IDs </p>
            <ul class="mb-4 list-decimal list-inside">
                <li v-for="p,ip in form.pages">{{ p.page_title }}
                    <ul class="pl-5 list-disc list-inside">
                        <li v-for="pf,i in p.page_fields">{{ pf.id }} - {{ pf.label ?? pf.text }}</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    
    <div id="code-mirror-parent-js" class="overflow-auto max-h-[300px] resize-y border border-gray-300 mb-3 mt-3"></div>

    <button @click="emit('changeCode', jsCode)" class="p-2 mr-2 text-white transition bg-green-600 rounded-md hover:scale-105 active:scale-95">
        Save
    </button>

</template>



