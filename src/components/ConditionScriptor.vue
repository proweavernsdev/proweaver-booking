<script setup>
import icons from '../assets/icons';
import {ref, onMounted,watch} from 'vue'

// data
let rulesObj = ref([])
let form = ref(JSON.parse(JSON.stringify(props.form)))
let rules = ref('')
let interpretation = ref([])

// defines
let props = defineProps({
    form:{type:Object}
})

let emit = defineEmits()

// onmount
onMounted(()=>{
    rules.value = form.value.conditionals
})
// watch
watch(()=>props.form,()=>{
    form.value = props.form
},{
    deep:true
})

// methods  

function evaluateRules(textRules){
    textRules = textRules.split(' :break;')
    let conditionsAndEffects = []

    textRules.forEach(el=>{
        el = el.trim()  
        if(el == '' || el.match(/^\s+$/g)) return
        let condition = parseConditions(el.split('?')[0].trim())
        let effect = tokenizeEffects(el.split('?')[1].trim().split(' :;').map(effel=>effel.trim()))
        conditionsAndEffects.push({
            condition,effect
        })
    });

    rulesObj.value = conditionsAndEffects

    interpretation.value = interpretRulesInEnglish(rulesObj.value)
    emit('onInterpret',rules.value)


    function tokenizeEffects(effectsArray) {
        function customEffectsSplitter(text) {
  const delimiters = ['='];
  let currentToken = '';
  const tokens = [];

  for (let i = 0; i < text.length; i++) {
    const currentChar = text[i];

    if (tokens.length === 0) {
      if (currentToken.match(/\[[a-zA-Z0-9.\-_]+\]/g)) {
        tokens.push(currentToken);
        currentToken = '';
      } else {
        currentToken += currentChar;
      }
    } else {
      if (delimiters.includes(currentChar)) {
        if (currentToken !== '') {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        tokens.push(currentChar);
      } else {
        currentToken += currentChar;
      }
    }
  }

  if (currentToken !== '') {
    tokens.push(currentToken.trim());
    currentToken = '';
  }

  const remainingText = text.slice(tokens.join('').length).trim();
  if (remainingText !== '') {
    tokens.push(remainingText);
  }

  return tokens;
}




        function tokenizeString(inputString) {
            const regex = /\s+|\[([^[\]]+)\](?=\s|$)|([.=])(?=\s|$)|"([^"]*)"(?=\s|$)/g
            return customEffectsSplitter(inputString).filter((token) => token.trim() !== '');
        }

        let effects = [];
        effectsArray.forEach(el => {
            let tokenized = tokenizeString(el);
            let field = tokenized[0].startsWith('[') && tokenized[0].endsWith(']')
            ? tokenized[0].slice(1, -1)
            : tokenized[0];

            effects.push({
            field: field,
            prop: tokenized[1].trim(),
            value: tokenized[3].trim()
            });
        });
        return effects;
        }

    function parseConditions(text) {    
        const conditions = [];
        let logicalOperators = text.match(/\s+\|\|\s+|\s+&&\s+/g)
        text = text.split(/\s+\|\|\s+|\s+&&\s+/g)

        const regex = /(==|!=|>|<|>=|<=|in_array)/g;

        for(let i = 0 ; i < text.length; i++){
            let el = text[i]
            let match = el.split(regex)

            let leftOperand = match[0].trim();
            const operator = match[1].trim();
            let rightOperand = match[2].trim();
               
            if (rightOperand.startsWith("(") && rightOperand.endsWith(")")) {
            rightOperand = rightOperand.slice(1, -1);
            rightOperand = Number(rightOperand); // Typecast as number
            } else if (rightOperand.startsWith("{") && rightOperand.endsWith("}")) {
            rightOperand = rightOperand.slice(1, -1).split(',').map(item => item.trim());
            }else{
                rightOperand = rightOperand.trim()
            }

            conditions.push({
                leftOperand,
                operator,
                rightOperand
            });
        }
        
        return {
            conditions,
            logicalOperators
        };
    }

}

function interpretRulesInEnglish(ce){
    let interpretations = [];
    ce.forEach(el2=>{
        let condtext = ''

        //condition interpret
        el2.condition.conditions.forEach((el,i)=>{
            const {leftOperand,operator,rightOperand} = el
            let operatorsReadable = {
                '==': 'equal to',
                '!=': 'not equal to',
                '>': 'greater than',
                '<': 'less than',
                '>=': 'less than or equal to',
                '<=': 'less than or equal to',
                'in_array': 'included in', 
            }   
            condtext += leftOperand.match(/^\[\w+\]$/g) != null ? `If value of field ${leftOperand}` : `If ${leftOperand}`
            condtext += ` is `+operatorsReadable[operator]+' '
            condtext += typeof rightOperand == 'array' ? rightOperand.join(', ') : rightOperand
            if(i != el2.condition.conditions.length - 1){
                if(el2.condition.logicalOperators[i] == ' || ')
                    condtext+=' or '
                else if(el2.condition.logicalOperators[i] == ' && ')
                    condtext+=' and '
            }
        })

        condtext+=', '

        //effect interpret
        el2.effect.forEach((el,i)=>{
            condtext += el.field == 'form' ? 'the form\'s' : `the ${el.field} field\'s`
            condtext += ` ${el.prop} property is set to `
            condtext += el.value

            if(i < el2.effect.length - 2)
                condtext+=', '
            else if(i == el2.effect.length - 2)
            condtext+=', and '
        });

        interpretations.push(condtext)
    });


    

    return interpretations
}

</script>


<template>
    
<div class="">
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

    <textarea v-model="rules" class="font-mono mb-2 h-[200px]" placeholder="Rules here..."></textarea>

    <button @click="evaluateRules(rules)" class="transition bg-green-700 text-white p-2 rounded-md mr-2 hover:scale-105 active:scale-95">Interpret Rules</button>


    <div class="border mt-5 p-2" v-if="interpretation.length > 0">
        <ul class="list-decimal list-inside">
            <li v-for="ir in interpretation">{{ ir }}</li>
        </ul>
    </div>

    
</div>    
</template>