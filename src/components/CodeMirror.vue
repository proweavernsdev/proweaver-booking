<script setup>
import {basicSetup, EditorView} from "codemirror"
import { keymap } from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands"
import {css} from "@codemirror/lang-css"
import { onMounted, watch,defineEmits } from "vue";

let props = defineProps({
    css:{type:String}
})

let emit = defineEmits();

let editorView = null
let debounceTimer = null

watch(()=>props.css,()=>reloadCSS(),{deep:true})

function reloadCSS(){
    let cursor = editorView.state.selection.main.head
    let scrollAmt = document.getElementById('code-mirror-parent').scrollTop
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
    setTimeout(()=>document.getElementById('code-mirror-parent').scrollTo(0,scrollAmt),1)
}

onMounted(()=>{
    document.getElementById('code-mirror-parent').onkey
    editorView = new EditorView({
        doc: props.css,
        extensions: [basicSetup, css(),
            EditorView.updateListener.of(function(e) {
                emit('change',e.state.doc.toString());
            }),
            keymap.of([
                indentWithTab
            ]),
        ],
        parent: document.getElementById('code-mirror-parent')
    })
})


</script>

<template>
    
    <div id="code-mirror-parent" class="overflow-auto max-h-[300px] resize-y border border-gray-300 mb-3 mt-3"></div>

</template>



