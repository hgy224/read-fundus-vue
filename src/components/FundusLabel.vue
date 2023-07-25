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
      <el-button type="primary" link="true" @click="back">home</el-button>
      </el-col>

    <el-col :span="8">
      <span>doctor：{{ this.doctorInfo.doctorName }} </span>
    </el-col>
    <el-col :span="8">
      <span style="text-align: center;display:block;">{{ this.doctorInfo.curNum }} / {{ this.doctorInfo.num }}</span>
    </el-col>
  </el-row>

<!--  患者临床指标-->
  <el-row>
    <el-col>
  <el-descriptions
      class="margin-top"
      :column="7"
      :size="size"
      border
  >
    <el-descriptions-item v-for="(key, index) in Object.keys(this.label)"
                          :key="index"
                          >
      <template #label>
        <div class="cell-item">
          {{this.labelTitle[key]}}
        </div>
      </template>
      {{ this.label[key] }}
    </el-descriptions-item>
  </el-descriptions>
    </el-col>
  </el-row>
<!--  <el-image v-for="(img, index) in this.patientImage"-->
<!--            :key="index"-->
<!--            :src="img"-->
<!--            style="width: 700px; height: 700px">-->
<!--    <template #error>-->
<!--      <div class="el-image__error">图片加载失败，请联系管理员!</div>-->
<!--    </template>-->
<!--  </el-image>-->

    <el-image
        style="width: 600px; height: 600px"
        :src="this.patientImage[0]"
        :zoom-rate="1.2"
        :preview-src-list="this.patientImage"
        fir="cover"
    >
    </el-image>
    <el-row>
      <el-col>
  <el-radio-group v-model="this.answer" style="display: inline-block ">
    <el-radio :label="0" :disabled="stop===1" size="large">
      no
    </el-radio>
      <el-radio :label="1" :disabled="stop===1" size="large">
        yes
      </el-radio>
  </el-radio-group>
      </el-col>
    </el-row>

    <el-row style="display: inline-block ">
<!--      <div style="position: fixed; right: 5%">-->
        <el-button
            type="primary" @click="change">
          {{this.tState[this.stop]}}&nbsp;timing
        </el-button>
        <el-button
            type="primary" @click="submit" :disabled="stop===1">
          submit
        </el-button>
<!--      </div>-->
    </el-row>


<!--  </el-row>-->
<!--  <el-affix position="bottom" :offset="50">-->
<!--    <div style="position: fixed; right: 5%">-->
<!--      <el-button-->
<!--          type="primary" @click="change">-->
<!--        {{this.tState[this.stop]}}计时-->
<!--      </el-button>-->
<!--      <el-button-->
<!--                 type="primary" @click="submit" :disabled="stop===1">-->
<!--        提交-->
<!--      </el-button>-->
<!--    </div>-->

<!--  </el-affix>-->
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: "FundusLabel",
  data(){
    return{
      // testImage: ['/Users/hgy/Desktop/server/images/2100770736_XC_438352_29045.jpg'],
      size: ref(''),
      stop: 0,  // 标志计时是否暂停
      tState: ['stop', 'start'],
      doctorInfo: {
        doctorName: 'error',
        curNum: 0,
        num: 100
      },
      imageInfo: {
      },
      patientImage:[],
      label:{
        dr: '',
        dme: '',
        wxgl: '',
        mxb: '',
        yxsc: '',
        cx: '',
        rdr: ''
      },
      labelTitle:{
        dr: 'DR',
        dme: 'DME',
        wxgl: '微血管瘤',
        mxb: '棉絮斑',
        yxsc: '硬性渗出',
        cx: '出血',
        rdr: 'Referable DR',
        drsl: 'DR severity level'
      },
      answer: undefined,
      clock: undefined,
      abc : 0, // 秒的计数  abc/100 s
    }
  },
  methods:{
    init(){  // 初始化所有的值
      this.getInfo();

      if(this.clock !== undefined){
        this.clock = clearInterval(this.clock);
      }
      this.abc = 0;
      // 开始计时
      this.clock = setInterval(()=>{
        this.abc ++;
      },10);
      this.answer = undefined;
    },

    submit(){
        if (this.answer === undefined){
          this.$message.error("please choose!");
          return;
        }
        const url = "/outcome/chooseOnly";
        this.axios.post(url, {
          'choose': this.answer,
          'chooseTime': this.abc / 100,
          'readId': this.$route.query.readId
        }).then((res)=>{
          if (res.data.code === 1){
            this.$message.success(res.data.data);
            this.init();  // 一次读片完成进行下一次
          }else {
            this.$message.success(res.data.info);
          }
        }).catch((error)=>{
          this.$message.error("submit fail!");
          console.log(error)
        })
    },

    getInfo(){
      const url = "/outcome/infoLabel/" + this.$route.query.readId;
      this.axios.get(url).then((res)=>{
        if (res.data.code === 0){
          this.$message.error(res.data.info);
          this.back();
          return
        }
        this.imageInfo = res.data.data.image;
        this.doctorInfo = res.data.data.doctorInfo;
        this.label = res.data.data.label;
        const curLabel = res.data.data.label;
        if (curLabel['mxb'] === -1){
          this.label = {drsl: this.label["dr"],
                        dme: curLabel["dme"],
                        rdr: curLabel["rdr"]};
          console.log(this.label)
        }
        this.getImage();
      }).catch((error) => {
        console.log(error)
        this.back();
        this.$message.error("please login!");
      });
    },
    getImage(){
      let baseImage = "/api/outcome/download/"+this.imageInfo.imageName.replace("/", "-_-");
      let preSuffix = baseImage.split(".");
      let num = this.imageInfo.imageNum;
      this.patientImage = [preSuffix[0]+".png"];
      for (let i = 1; i < num; i++) {
        this.patientImage.push(preSuffix[0] + "-" + i + ".png")
      }

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
  },
  beforeUpdate(){
    console.log("beforeUpdate")

  },
  updated(){
    console.log("update")
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
.el-image__error {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  vertical-align: middle;
}
.el-radio /deep/ .el-radio__label {
  font-size: 20px;
  line-height: 2;
}
</style>

