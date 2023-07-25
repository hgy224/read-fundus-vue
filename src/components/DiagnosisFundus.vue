<template>
  <div>
  <el-backtop :right="100" :bottom="100" />

  <el-affix :offset="50">
    <div style="position: fixed; right: 10%" v-if="abc===0">0.0s</div>
    <div style="position: fixed; right: 10%" v-if="abc!==0">{{(abc/100).toFixed(1)}}s</div>
  </el-affix>
<!--  医生信息-->
  <el-row>
    <el-col :span="8">
      <el-button type="primary" link="true" @click="back">首页</el-button>
      </el-col>

    <el-col :span="8">
      <span>医生：{{ this.doctorInfo.doctorName }} </span>
    </el-col>
    <el-col :span="8">
      <span style="text-align: center;display:block;">{{ this.doctorInfo.curNum }} / {{ this.doctorInfo.num }}</span>
    </el-col>
<!--    <el-col :span="4">-->
<!--        <span style="float: right" v-if="this.$store.state.img_url">{{(abc/100).toFixed(1)}}s </span>-->
<!--        <span style="float: right" v-if="!this.$store.state.img_url">0.0s </span>-->

<!--    </el-col>-->
  </el-row>

<!--  患者临床指标-->
  <el-row>
    <el-col>
  <el-descriptions
      class="margin-top"
      title="患者临床信息"
      :column="3"
      :size="size"
      border
  >
<!--    <template #extra>-->
<!--      <el-button type="primary">Operation</el-button>-->
<!--    </template>-->
    <!--                          :key="index"-->
    <!--                          :index=key-->
    <el-descriptions-item v-for="(key, index) in Object.keys(this.patientInfoKey)"
                          :key="index"
                          >
      <template #label>
        <div class="cell-item">
          {{this.patientInfoKey[key]}}
        </div>
      </template>
      {{ this.patientInfo[key] }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          眼底
        </div>
      </template>
      <el-image
          style="width: 100px; height: 100px"
          :src="this.patientImage[0]"
          :zoom-rate="1.2"
          :preview-src-list="this.patientImage"
          fir="cover"
          >
      </el-image>
    </el-descriptions-item>
  </el-descriptions>
    </el-col>
  </el-row>
<!--  <el-image v-for="(img, index) in this.patientImage"-->
<!--            :key="index"-->
<!--            :src="img"-->
<!--            lazy>-->
<!--    <template #error>-->
<!--      <div class="image-slot">-->
<!--        <el-icon><icon-picture /></el-icon>-->
<!--      </div>-->
<!--    </template>-->
<!--  </el-image>-->
  <el-card class="box-card" v-for="(item, index) in this.questions"
             :key="index">
      <template #header>
        <div class="card-header">
          <span>{{item.title}}</span>
        </div>
      </template>

      <el-radio-group v-model="this.answers[index]" style="display: block">
        <div class="text item"
             v-for="(item1, index1) in item.choose"
             :key="index1"
             style="text-align: left">
          <el-radio :label="index1" :disabled="flag===1 || stop===1">
            {{item1}}
          </el-radio>
        </div>

      </el-radio-group>
    </el-card>

<div v-if="flag===1" ref="scroll">
  <el-row style="margin-top: 20px">
  <el-col :span="12">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>初步管理意见</span>
        </div>
      </template>
      {{this.answerText}}
    </el-card>
  </el-col>
  <el-col :span="12">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>ChatGPT管理意见</span>
        </div>
      </template>
      {{this.patientInfo.gpt}}
    </el-card>
  </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
    <el-card class="box-card" style="margin-bottom: 20px">
      <template #header>
        <div class="card-header" style="display: block">
          <span>最终意见</span>
        </div>
      </template>
      <el-input
          v-model="this.opinion"
          :autosize="{ minRows: 2, maxRows: 10 }"
          type="textarea"
          placeholder="请输入最终意见"
          style="width: 60%"
          :disabled="stop===1"
      />

    </el-card>
    </el-col>
  </el-row>
</div>


<!--  </el-row>-->
  <el-affix position="bottom" :offset="50">
    <div style="position: fixed; right: 5%">
      <el-button
          type="primary" @click="change">
        {{this.tState[this.stop]}}计时
      </el-button>
      <el-button
                 type="primary" @click="submit" :disabled="stop===1">
        提交{{this.state[this.flag]}}
      </el-button>
    </div>

  </el-affix>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: "DiagnosisFundus",
  data(){
    return{
      size: ref(''),
      stop: 0,  // 标志计时是否暂停
      flag: 0,  // 做选择题还是写意见
      state: ['选择题', '意见'],
      tState: ['暂停', '开始'],
      doctorInfo: {
        doctorName: 'error',
        curNum: 0,
        num: 100
      },
      patientInfoKey: {
        patientId: "疗养号",
        gender: "性别",
        birth: "出生日期",
        checkTime: "检查日期",
        age: "年龄",
        bmi: "BMI",
        systolicBloodPressure: "收缩压",
        diastolicPressure: "舒张压",
        heartRate: "心率",
        smoke: "吸烟",
        drink: "饮酒",
        bloodPressureHistory: "血压史",
        circulatoryHistory: "循环系统病史",
        familyHistory: "家族史",
        eatingHabits: "饮食习惯",
        movement: "运动方式",
        endocrineSystemHistory: "内分泌系统病史",
        serumTriglycerides: "血清甘油三酯",
        cholesterol: "总胆固醇",
        hdl: "高密度脂蛋白",
        ldl: "低密度脂蛋白",
        egfr: "eGFR",
        fastingSerumGlucose: "空腹血清葡萄糖",
        glycatedHemoglobin: "糖化血红蛋白",
        aspartateAminotransferase: "谷草转氨酶",
        alanineAminotransferase: "谷丙转氨酶",
        ggt: "r-谷氨酰转移酶Gamma-glutamyl transpeptidase (GGT)",
        bloodSugar: "饭后2小时血糖",
      },
      patientInfo: {
        gpt: "chatgpt"
      },
      imageInfo: {

      },
      patientImage:[],
      questions: [{
        title: "控制体重",
        choose: ["该患者超重/肥胖，减重的目标是3-6个月减轻体重5%~10%",
                 "该患者消瘦，应通过合理的营养计划达到并长期维持理想体重",
                 "维持目前体重"]
      },{
        title: "合理膳食",
        choose: ["该患者提倡低碳饮食，以高蛋白，高脂肪和大部分蔬菜为主的饮食结构，并且严格限制碳水化合物的摄入（如：高糖水果，大米，白面，糙米，红薯等）",
          "该患者提倡16+8轻断食，把一天吃的东西在8小时内吃完，然后16小时断食",
          "该患者提倡选择低血糖负荷的食品，减少精制碳水化合物（如白米饭、面食、饼干等）和含糖饮料的摄入，以全谷物或杂豆类替代1/3精白米、面等主食"]
      },{
        title: "适量运动",
        choose: ["该患者提倡中等强度 (50%~70%最大心率*，每周150分钟）",
          "该患者提倡低强度（30%~50%最大心率*，每周100分钟）",
          "该患者伴有急性并发症或严重慢性并发症，不应采取运动治疗"]
      },{
        title: "戒烟戒酒",
        choose: ["该患者应科学戒烟，有饮酒习惯的应当戒酒",
          "该患者提倡减少抽烟量，允许适当红酒摄入"]
      },{
        title: "降糖治疗",
        choose: ["该患者的HbA1c控制目标值应<6.5%",
          "该患者的HbA1c控制目标值应<7.0%",
          "该患者的HbA1c控制目标值应<7.5%"]
      },{
        title: "降压治疗",
        choose: ["该患者的血压控制目标值应<130/80 mmHg",
          "该患者的血压控制目标值应<140/90 mmHg",
          "该患者的血压控制目标值应<150/90 mmHg"]
      },{
        title: "调脂治疗",
        choose: ["该患者的LDL-C控制目标值应<1.8mmol/L",
          "该患者的LDL-C控制目标值应<2.6mmol/L"]
      },{
        title: "糖尿病慢性并发症管理",
        choose: ["该患者提倡每年检查1次眼底和视力，每6个月检查1次尿常规，每年检查1次尿蛋白肌酐比值，每年进行1次神经病变的相关检查以及足外观、足背动脉搏动",
          "该患者提倡每6个月检查1次眼底和视力，每6个月检查1次尿常规，每年检查1次尿蛋白肌酐比值，每年进行1次神经病变的相关检查以及足外观、足背动脉搏动",
          "该患者提倡每6个月检查1次眼底和视力，每6个月检查1次尿常规，每年检查1次尿蛋白肌酐比值，每6个月进行1次神经病变的相关检查以及足外观、足背动脉搏动"]
      },{
        title: "糖尿病视网膜病变专科随访",
        choose: ["该患者提倡每年一次眼底随访，发生眼部不适时眼科随诊",
          "该患者提倡每6个月1次眼底随访，眼科药物控制，发生眼部不适时眼科随诊",
          "该患者建议眼底荧光造影及OCT检查，眼底专科进一步行激光或手术治疗，并提倡每3个月1次眼底随访"]
      }],
      answers: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
      },
      answerText: "",
      opinion: "",
      clock: undefined,
      abc : 0, // 秒的计数  abc/100 s
    }
  },
  // props: {
  // msg: String
// },
  methods:{
    init(){  // 初始化所有的值
      this.getInfo();
      this.flag = 0;
      this.answers = {};
      this.answerText = "";
      this.opinion = "";

      if(this.clock !== undefined){
        this.clock = clearInterval(this.clock);
      }
      this.abc = 0;
      // 开始计时
      this.clock = setInterval(()=>{
        this.abc ++;
      },10)
    },

    submit(){
      if (this.flag===0){
        if (Object.keys(this.answers).length !== 9){
          this.$message.error("请做完所有的选择题!");
          return
        }
        const num = this.questions.length;
        let ans = "";
        for (let i = 0; i < num; i++) {
          ans = ans + this.questions[i].choose[this.answers[i]]+"。"
        }
        const url = "/outcome/choose";
        this.axios.post(url, {
          'choose': ans,
          'chooseTime': this.abc / 100,
          'readId': this.$route.query.readId
        }).then((res)=>{
          if (res.data.code === 1){
            this.$message.success(res.data.data);
            this.flag = 1
            this.answerText = ans;
            this.abc = 0; // 进行第二次计时
          }else {
            this.$message.success(res.data.info);
          }
        }).catch((error)=>{
          this.$message.error("提交失败!");
          console.log(error)
        })
      }else if (this.flag === 1 && this.opinion.length>0){
        // console.log(this.opinion.length)
        const url = "/outcome/opinion";
        this.axios.post(url, {
          'opinion': this.opinion,
          'opinionTime': this.abc / 100,
          'readId': this.$route.query.readId
        }).then((res)=>{
          if (res.data.code === 1){
            this.$message.success(res.data.data);
            this.init();  // 一次读片完成进行下一次
          }else {
            this.$message.success(res.data.info);
          }
        }).catch((error)=>{
          this.$message.error("提交失败!");
          console.log(error)
        })
      }else {
        this.$message.error("请填写最终意见!");
      }
    },

    getInfo(){
      const url = "/outcome/info/" + this.$route.query.readId;
      this.axios.get(url).then((res)=>{
        if (res.data.code === 0){
          this.$message.error(res.data.info);
          this.back();
          return
        }
        this.patientInfo = res.data.data.patientInfo;
        this.imageInfo = res.data.data.image;
        this.doctorInfo = res.data.data.doctorInfo;
        const gender = this.patientInfo.gender;
        if (gender !== undefined){
          this.patientInfo.gender = gender===1 ? '男' : '女';
        }
        if (this.patientInfo.gpt === undefined){
          this.patientInfo.gpt = "缺少ChatGPT的意见"
        }
        this.getImage();
      }).catch((error) => {
        console.log(error)
        this.back();
        this.$message.error("请登录!");
      });
    },
    getImage(){
      let baseImage = "/api/outcome/download/"+this.imageInfo.imageName;
      let preSuffix = baseImage.split(".");
      let num = this.imageInfo.imageNum;
      this.patientImage = [baseImage];
      for (let i = 1; i < num; i++) {
        this.patientImage.push(preSuffix[0] + "-" + i + "." + preSuffix[1])
      }
      // console.log(this.patientImage)
    },

    back(){
      this.$router.push('/')
    },
    change(){
      if(this.clock !== undefined){
        this.clock = clearInterval(this.clock);
        this.stop = 1;
      }else {
        this.clock = setInterval(()=>{
          this.abc ++;
        },10)
        this.stop = 0;
      }
    }

},
  created(){
    console.log("created")
    this.init();
    window.scrollTo(0, 0);
  },
  beforeUpdate(){
    console.log("beforeUpdate")
    // this.getInfo();
    // window.scrollTo(0, )
    // this.abc = 0
    //   this.flag = clearInterval(this.flag)
    //   this.loadImage = true
    //   // this.$refs.form.resetFields()
    //   this.queding = false

  },
  updated(){
    console.log("update")
    if (this.flag===1){
      window.scrollTo(0, document.documentElement.scrollHeight);
    }else {
      window.scrollTo(0, 0);
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-image__error {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    vertical-align: middle;
}
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

