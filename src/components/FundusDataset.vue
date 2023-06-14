<template>
    <div class="fundus">
      <el-row class="tac">
    <el-col :span="4">
      <h5 class="mb-2">FundusDataset</h5>
      <el-menu
        default-active="$route.path"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item v-for="(item, index) in this.dataset"
                      :key="index"
                      :index=item.id
                      :route="{path: '/doctor', query: {datasetId: item.id}}">
          <span>{{item.datasetName}}, {{item.num}}{{this.dataType[item.type]}}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
        <el-col :span="20">
          <router-view></router-view>
        </el-col>
  </el-row>
        </div>
</template>

<script>
export default {
  name: "FundusDataset",
  data(){
    return{
      dataset: [{  // 存储查询到可以用的所有的眼底数据集
        'id': 1,
        'datasetName': 'error',
        'num': 100,
        'type': 2
      }],
      dataType: ["张图片","只眼睛","个患者"],
    }
  },
  methods: {
    getAllDataset(){ // 查询所有可以用的眼底数据集
      const url = '/dataset/use'
      this.axios.get(url).then((res) => {
        this.dataset = res.data.data;
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  created(){
    this.getAllDataset()
  },
    beforeUpdate(){
    this.getAllDataset()
  },
}
</script>

<style scoped>

</style>
