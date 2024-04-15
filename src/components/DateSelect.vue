<script>
import {dateFormat} from '../functions'

export default{
    data(){
        return{
            title:'',
            cc:{y:0,m:0,d:0},
            qd:{y:0,m:0,d:0},
            calendarBoxes:[],
        }
    },
    mounted(){
        let date = new Date();
        this.cc.y = date.getFullYear();
        this.cc.m = date.getMonth();
        this.cc.d = date.getDate();
        this.qd.y = date.getFullYear();
        this.qd.m = date.getMonth();
        this.qd.d = date.getDate();

        this.buildCalendar();   
    },
    methods:{
        fetchScheds(){

        },
        buildCalendar(){
            let startMonth = new Date(this.cc.y,this.cc.m,1);
            let endMonth = new Date(this.cc.y,this.cc.m+1,0);
            let offsetStart = new Date(this.cc.y,this.cc.m,1).getDay();
            let offsetEnd = new Date(this.cc.y,this.cc.m+1,0).getDay();
            startMonth.setDate(startMonth.getDate() - offsetStart);
            endMonth.setDate(endMonth.getDate() + (6 - offsetEnd));
            this.calendarBoxes = [];

            while(startMonth.getTime() <= endMonth.getTime()){
                let dateString = dateFormat('%y-%M-%D',startMonth.getTime());
                let newDateBox = {
                    date: dateString,
                    dateNum: startMonth.getDate(),
                    isCurrentMonth: startMonth.getMonth() == this.cc.m,
                    scheds:this.fetchScheds(dateString),
                    onclick:(dateString)=>{
                        let date = new Date(dateString);
                        this.qd.y = date.getFullYear();
                        this.qd.m = date.getMonth();
                        this.qd.d = date.getDate();
                        if(date.getMonth() == this.cc.m) return;
                        date = new Date(this.qd.y,this.qd.m,this.qd.d)
                        this.cc.y = date.getFullYear();
                        this.cc.m = date.getMonth();
                        this.cc.d = date.getDate();
                        this.buildCalendar();
                    }
                }
                this.calendarBoxes.push(newDateBox);
                startMonth.setDate(startMonth.getDate() + 1);
            }

            this.title = dateFormat('%lm %y',new Date(this.cc.y,this.cc.m,this.cc.d).getTime());
        },
        nextMonths(num){
            let date = new Date(this.cc.y,this.cc.m,this.cc.d);
            date.setMonth(date.getMonth() + num);
            this.cc.y = date.getFullYear();
            this.cc.m = date.getMonth();
            this.cc.d = date.getDate();
            this.qd.y = date.getFullYear();
            this.qd.m = date.getMonth();
            this.qd.d = date.getDate();
            this.buildCalendar();
        },
    }
}

</script>

<template>
    <div class="pwfvf-scheduler"> <!--scheduler parent -->
        <div class="pwfvf-scheduler-header">
            <button @click="nextMonths(-1)">&#10094;</button>
            <h2>{{ this.title }}</h2>
            <button @click="nextMonths(1)">&#10095;</button>
        </div>
        <div class="pwfvf-scheduler-dateboxes">
            <div @click="cb.onclick(cb.date)" class="pwfvf-scheduler-datebox" v-for="cb,i in calendarBoxes" :class="{notCurrentMonth: !cb.isCurrentMonth, active:new Date(cb.date + ' 00:00:00').getTime() == new Date(qd.y,qd.m,qd.d).getTime()}">
                {{cb.dateNum}}
            </div>
        </div>
    </div><!--/scheduler parent -->
</template>

<style>
:root{
    --pwcss-primary-color: #446523;
    --pwcss-contra-color: #fff;
}

.pwfvf-scheduler{
    background: #fafafa;
    box-shadow: inset 0 0 5px #ccc;
    padding: 10px;
}

.pwfvf-scheduler-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.pwfvf-scheduler-header h2{
    font-weight: 700;
    font-size: 20px;
    color:#222
}

.pwfvf-scheduler-header button{
    color: var(--pwcss-primary-color);
    background: var(--pwcss-contra-color);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: 700;
    box-shadow: 0 0 3px #ccc;
    transition: 0.2s;
}

.pwfvf-scheduler-header button:hover{scale: 1.05;}
.pwfvf-scheduler-header button:active{scale: 0.95; background: var(--pwcss-primary-color);color: var(--pwcss-contra-color);}

.pwfvf-scheduler-dateboxes{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    text-align: center;
    color:#444;
    padding: 5px 0;
}

.pwfvf-scheduler-datebox{
    padding: 3px;
    border-radius: 5px;
    transition: 0.2s;
}

.pwfvf-scheduler-datebox:hover{
    background: #aaa;
    color:#fff
}

.pwfvf-scheduler-datebox.notCurrentMonth{
    color:#999;
}

.pwfvf-scheduler-datebox.active{
    background: var(--pwcss-primary-color);
    color: var(--pwcss-contra-color);
}
</style>