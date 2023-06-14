<template>
  <el-row class="tac">
    <el-col :span="5">
      <h5 class="mb-2">Label</h5>
      <el-menu
        default-active="$route.path"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item v-for="(label, index) in this.doctorLabel"
                      :key="index"
                      :index=label.id
                      :route="{path: '/diagnosis', query: {readId: label.id}}">

          <el-icon><icon-menu /></el-icon>
          <span>{{label.doctorName}}  {{label.curNum}}/{{label.num}}</span>
        </el-menu-item>
      </el-menu>
      <el-affix position="bottom" :offset="20">
        <el-button type="primary" @click="centerDialogVisible = true">create label</el-button>
      </el-affix>
      <el-dialog
    v-model="centerDialogVisible"
    title="Create label"
    width="30%"
    destroy-on-close
    center
  >
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="120px"
             :size="formSize">
      <el-form-item label="读片医生姓名" prop="doctorName">
        <el-input v-model="form.doctorName" />
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="submitForm('form')"
        >Create</el-button
      >
      <el-button @click="cancelForm">cancel</el-button>
    </el-form-item>
    </el-form>

  </el-dialog>
    </el-col>
      <el-col :span="19">
          <router-view></router-view>
        </el-col>
  </el-row>

</template>

<script>
import { ref, reactive} from 'vue'
export default {
  name: "DoctorLabel",
  data(){
    return{
      doctorLabel: [
        {
          id: 1,
          doctorName: 'hgy',
          curNum: 0,
          num: 100
        }
      ],
      formSize: ref('default'),
      centerDialogVisible: ref(false),

      form: reactive({
        doctorName: '',  //打标签的医生名字
      }),
      rules: {
        doctorName:[{
          required: true,
          message: "必填项"
        }],
      }
  }},
  methods:{
    submitForm(Form){
    this.$refs[Form].validate((valid) => {
        if (valid) {
          const url = '/doctor/add';
          this.axios.post(url, {
            'doctorName': this.form.doctorName,
            'datasetId': this.$route.query.datasetId
          }).then((res) => {
                  if (res.data.code === 1){
                    this.$message.success(res.data.data);
                    this.getDoctorLabel();
                  }else {
                    this.$message.error(res.data.info);
                  }
                }).catch((error) => {
                  console.log(error)
                })
          this.centerDialogVisible = false
          this.$refs.form.resetFields()
        } else {
          this.$message.error("表单错误!");
        }
      });
    },
    cancelForm(){
      this.centerDialogVisible = false
      this.$refs.form.resetFields()
    },
    getDoctorLabel(){
      const url = '/doctor/list/'+this.$route.query.datasetId;
      this.axios.get(url).then((res)=>{
        this.doctorLabel = res.data.data;
      }).catch((error) => {
        console.log(error)
      });
    },
  },
  created(){
    this.getDoctorLabel();
  },
  beforeUpdate(){
    this.getDoctorLabel();
  },
}
</script>

<style scoped>

</style>
