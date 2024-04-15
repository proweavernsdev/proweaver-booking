<template>
    <div class="styled-alert-modal" :class="{show:show}" @click="getProperFunc">
        <div class="styled-alert-parent" :class="{
            danger:type=='danger',
            warning:type=='warning',
            success:type=='success',
            neutral:type=='neutral',
            
            }">
            <h5 class="font-bold flex items-center justify-between styled-alert-header">{{this.header}}
                <button class="styled-alert-closebtn" @click="dismissEarly();$emit('onResult',false);">&#10005;</button>
            </h5>
            <p v-html="body"></p>

            <div class="styled-alert-buttons">
                <button @click="$emit('onResult',b.data);dismissEarly()" v-for="b,i in buttons" :key="i">{{b.label}}</button>
            </div>
        </div>
    </div>
</template>

<script>

export default{
    props:{
        header:String,
        body:String,
        buttons:Array,
        type:String,
        duration:Number,
        show:Boolean
    },
    data(){
        return{
            resetAnimation:false,
            dismissTimer:null,
        }
    },
    methods:{
        dismissEarly(){
            if(this.dismissTimer != null) clearInterval(this.dismissTimer)
            this.$emit('dismiss');
        },
        dismissIf(e){
            if(e.target.classList.contains('styled-alert-modal')) {
                this.$emit('onResult',false);
                this.dismissEarly();
            }
        },
        getProperFunc(e){
            // if(this.buttons != null && this.buttons.length > 0) this.dismissIf(e);
            // else this.dismissEarly();
        }
    },
    watch:{
        show(c){
            if(!this.show) return;
            this.resetAnimation = true;
            
            setTimeout(()=>{
                this.resetAnimation = false;
            },5);
            
        }
    }

}
</script>

<style scoped>
.styled-alert-modal{position: fixed;width:100vw;height: 100vh;top:0;left:0;z-index: -1;display: flex;flex-direction:column;justify-content: center;align-items: center;background: rgba(0,0,0,0.7);opacity: 0;transition: 0.2s;gap:20px}
.styled-alert-parent{background: #cdedff;width: 90%;max-width: 400px;padding: 10px;border-radius: 5px;scale: 0;transition: 0.3s;}
.styled-alert-parent h5{margin-bottom: 5px;}
.styled-alert-timer-cont{height: 10px;margin: 15px 0 0;border-radius: 20px;overflow: hidden;box-shadow:inset 0 0 5px rgb(0,0,0,0.5)}
.styled-alert-timer-juice{
    height: 100%;
    background: linear-gradient(90deg, #1b98e3 0%, #8cd4ff 100%);
    width: 100%;
    animation-name:beforeDismiss;
    animation-timing-function: linear;
    clip-path: polygon(0 0, 0% 0, 0% 100%, 0% 100%);
}

.styled-alert-parent h5{font-size: 18px;}
.styled-alert-parent.danger p{font-size: 14px;}

.styled-alert-parent.danger .styled-alert-timer-juice{background: linear-gradient(90deg, #a2493e 0%, #990000 100%);}
.styled-alert-parent.danger{background:#ffe3df}
.styled-alert-parent.danger h5,.styled-alert-parent.danger p{color:#822b2b}
.styled-alert-parent.success .styled-alert-timer-juice{background: linear-gradient(90deg, #3d843d 0%, #5dc25d 100%);}
.styled-alert-parent.success{background:#c5ffc5}
.styled-alert-parent.success h5,.styled-alert-parent.success p{color:#161e16}


.styled-alert-parent.warning .styled-alert-timer-juice{background: linear-gradient(90deg, #e38500 0%, #fcb045 100%);}
.styled-alert-parent.warning{background:#ffd395}
.styled-alert-parent.warning h5,.styled-alert-parent.warning p{color:#4f370d}

.styled-alert-modal.show{
    z-index: 10000;
    opacity: 1;
}

.styled-alert-modal.show .styled-alert-parent{
    scale: 1;
}

.dismisstooltip{color:#fff;background: rgba(0,0,0,0.7);padding: 10px;border-radius: 5px;}

.styled-alert-buttons{margin: 10px 0 0;display: flex;justify-content: flex-end;}

button{all:unset;padding: 10px;background:transparent;color:#1b567a;font-weight:600;border-radius: 5px;transition: 0.2s;font-size: 14px;line-height: 14px;}
.styled-alert-parent.danger button{color:#822b2b}
.styled-alert-parent.success button{color:#161e16}
.styled-alert-parent.warning button{color:#4f370d}
button:hover{scale:1.05}
button:active{scale:0.95}

.styled-alert-parent button.styled-alert-closebtn{
    background: #822b2b;
    color: #ffe3df;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    text-align: center;
    padding: 0;
    position: absolute;
    top:-15px;
    user-select: none;
    right:-15px;
    transition: 0.15s;
}

.styled-alert-parent button.styled-alert-closebtn:hover{scale:1.05}
.styled-alert-parent button.styled-alert-closebtn:active{scale:0.95}

.styled-alert-parent.warning button.styled-alert-closebtn{
    background: #4f370d;
    color: #ffd395;
}

.styled-alert-parent.success button.styled-alert-closebtn{
    background: #161e16;
    color: #c5ffc5;
}

.styled-alert-parent.danger button.styled-alert-closebtn{
    background: #822b2b;
    color: #ffe3df;
}


@keyframes beforeDismiss {
    0%{clip-path: polygon(0 0, 0% 0, 0% 100%, 0% 100%);}
    100%{clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);}
}

</style>
