<template>
  <el-row class="tac">
    <el-col :span="5">
      <h5 class="mb-2">Label</h5>
      <el-menu
        default-active="$route.path"
        class="el-menu-vertical-demo">
<!--        router-->
<!--      >-->
        <el-menu-item v-for="(label, index) in this.doctorLabel"
                      :key="index"
                      :index=label.id
                      @click="checkUser(label)">
<!--                      :route="{path: this.pathChoose[this.type-1], query: {readId: label.id}}">-->

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
      <el-dialog
          v-model="passwordDialogVisible"
          title="please input password"
          width="30%"
          destroy-on-close
          center
      >
        <el-form ref="passwordForm"
                 :model="passwordForm"
                 :rules="rules"
                 label-width="120px"
                 :size="formSize">
          <el-form-item label="password" prop="password">
            <el-input v-model="passwordForm.password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPassword('passwordForm')"
            >login</el-button
            >
            <el-button @click="cancelPassword">cancel</el-button>
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
      curLabel: {
        id: 1,
        doctorName: 'hgy',
        curNum: 0,
        num: 100
      },
      formSize: ref('default'),
      centerDialogVisible: ref(false),
      passwordDialogVisible: ref(false),
      type: 2,
      isPassword: 0,
      pathChoose: ['/label', '/diagnosis'],
      form: reactive({
        doctorName: '',  //打标签的医生名字
      }),
      passwordForm: reactive({
        password: '',  //密码
      }),
      rules: {
        doctorName:[{
          required: true,
          message: "必填项"
        }],
        password:[{
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
    submitPassword(Form){
      this.$refs[Form].validate((valid) => {
        if (valid) {
          const url = '/doctor/login';
          this.axios.post(url, {
            'id': this.curLabel.id,
            'password': this.passwordForm.password
          }).then((res) => {
            if (res.data.code === 1){
              // this.$message.success(res.data.data);
              sessionStorage.setItem("token", res.data.data);
              console.log(res.data.data);
              this.$router.push(this.pathChoose[this.type-1]+'?readId='+this.curLabel.id)
            }else {
              this.$message.error(res.data.info);
            }
          }).catch((error) => {
            console.log(error)
          })
          this.passwordDialogVisible = false
          this.$refs.passwordForm.resetFields()
        } else {
          this.$message.error("表单错误!");
        }
      });
    },
    cancelPassword(){
      this.passwordDialogVisible = false
      this.$refs.passwordForm.resetFields()
    },
    getDoctorLabel(){
      const url = '/doctor/list/'+this.$route.query.datasetId;
      this.axios.get(url).then((res)=>{
        this.doctorLabel = res.data.data;
      }).catch((error) => {
        console.log(error)
      });
    },
    getDatasetType(){
      const url = '/dataset/type/'+this.$route.query.datasetId;
      this.axios.get(url).then((res)=>{
        this.type = res.data.data;
      }).catch((error) => {
        console.log(error)
      });
    },
    getPasswordType(){
      const url = '/dataset/password/'+this.$route.query.datasetId;
      this.axios.get(url).then((res)=>{
        this.isPassword = res.data.data;
      }).catch((error) => {
        console.log(error)
      });
    },
    checkUser(label){
      if (this.isPassword===1){
        console.log("需要密码")
        this.curLabel = label;
        this.passwordDialogVisible = true;
      }else {
        console.log("不需要密码")
        this.$router.push(this.pathChoose[this.type-1]+'?readId='+label.id)
      }
    }
  },
  created(){
    console.log('created');
    this.getDoctorLabel();
    this.getDatasetType();
    this.getPasswordType();
  },
  beforeUpdate(){
    console.log('beforeUpdate');
    this.getDoctorLabel();
    this.getDatasetType();
    this.getPasswordType();
  },
}
</script>

<style scoped>

</style>
