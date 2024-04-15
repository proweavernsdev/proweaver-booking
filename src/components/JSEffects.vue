<script setup>
import {basicSetup, EditorView} from "codemirror"
import { keymap } from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands"
import {javascript} from "@codemirror/lang-javascript"
import { onMounted, watch,defineEmits, reactive } from "vue";

let props = defineProps({
    css:{type:String},
    form: {type:Object}
})

let form = reactive(JSON.parse(JSON.stringify(props.form)))

let emit = defineEmits();

let editorView = null
let debounceTimer = null

watch(()=>props.css,()=>reloadCSS(),{deep:true})

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
            insert: props.css
    }]});
    editorView.dispatch(editorView.state.update({ selection: { anchor: cursor, head: cursor } }));
    setTimeout(()=>document.getElementById('code-mirror-parent-js').scrollTo(0,scrollAmt),1)
}

onMounted(()=>{
    document.getElementById('code-mirror-parent-js').onkey
    editorView = new EditorView({
        doc: props.css,
        extensions: [basicSetup, javascript(),
            EditorView.updateListener.of(function(e) {
                emit('change',e.state.doc.toString());
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

    <div class="flex mb-2 gap-2">

        <div class="max-h-[150px] overflow-auto p-2 border flex-grow">
            <h3 class="font-bold">Field IDs:</h3>       
            <p class="font-semibold">Your Field IDs </p>
            <ul class="list-decimal list-inside mb-4">
                <li v-for="p,ip in form.pages">{{ p.page_title }}
                    <ul class="list-disc list-inside pl-5">
                        <li v-for="pf,i in p.page_fields">{{ pf.id }} - {{ pf.label ?? pf.text }}</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    
    <div id="code-mirror-parent-js" class="overflow-auto max-h-[300px] resize-y border border-gray-300 mb-3 mt-3"></div>

</template>



