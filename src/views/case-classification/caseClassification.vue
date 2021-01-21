<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <!-- <el-input v-model="search.id" placeholder="预审申请号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="search.mingcheng" placeholder="发明名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" :loading="searchLoading" plain native-type="submit" @click.prevent="searchFunc(search)">
            Search
          </el-button>-->
          <el-row>
            <!-- <el-col :span="6">
              <el-button type="primary" :disabled="modifyBtn" class="filter-item" @click="modifycase();dialogFormVisible =false">
                分类号更正
              </el-button>
              <el-button type="primary" :disabled="transBtn" class="filter-item" @click="transfercase();dialogFormVisible =false">
                转案
              </el-button>
              <el-button type="primary" :disabled="finishsBtn" class="filter-item" @click="finishcase();">
                出案
              </el-button>
            </el-col>-->
            <el-col :span="24" :offset="0">
              <el-date-picker
                v-model="search.beginTime"
                type="date"
                placeholder="出案开始日期"
                class="filter-item"
                value-format="yyyy-MM-dd"
              />
              <el-date-picker
                v-model="search.endTime"
                type="date"
                placeholder="出案截止日期"
                class="filter-item"
                value-format="yyyy-MM-dd"
              />
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                plain
                native-type="submit"
                @click.prevent="searchFunc(search)"
              >Search</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-tabs
        v-model="activeName"
        style="margin-top:15px;"
        type="border-card"
        @tab-click="changeTab"
      >
        <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        ></el-tab-pane>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column fixed label="预审申请号" prop="id" align="center" width="180px">
            <template slot-scope="{row}">
              <a
                v-bind:href="'ftp://baohuUserT:123456@192.168.8.130/'+row.id+'/'+row.pdfPath"
                target="_blank"
                class="buttonText"
              >{{row.id}}</a>
              <!-- <router-link to="">{{ row.id }}</router-link> -->
            </template>
          </el-table-column>
          <el-table-column label="发明名称" width="400px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.mingcheng }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请人" width="200px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.sqr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分类类型" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.maintype == '主' ? '主分进案' : '转案' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" min-width="50px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.type== 'FM' ? '发明' : '新型' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="粗分号" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.simpleclasscode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="进案日期" width="180px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.jinantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="250px"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                @click="showDetail(row);dialogFormVisible =true"
              >详情</el-button>
              <el-button
                type="warning"
                size="mini"
                :disabled="transBtn"
                @click="transfercase(row);dialogFormVisible =false"
              >转案</el-button>
              <el-button
                type="success"
                size="mini"
                :disabled="finishsBtn"
                @click="finishcase(row);"
              >出案</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="search.page"
          :limit.sync="search.limit"
          @pagination="getList"
        />
        <!-- 案件信息以及填写裁决分类号 -->
        <el-dialog
          :title="textMap[dialogStatus]"
          :visible.sync="dialogFormVisible"
          width="80%"
          top="5vh"
        >
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="left"
            label-width="70px"
            style="margin-left:50px;"
          >
            <el-col :span="12">
              <el-form-item label="案件编号" prop="id">
                <span>{{ temp.id }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发明名称" prop="mingcheng">
                <span>{{ temp.mingcheng }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请号" prop="sqh">
                <span>{{ temp.sqh }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进案时间" prop="jinantime">
               <!-- <span>{{ temp.jinantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IPCMI" prop="ipcmi">
                <div v-if="this.activeName === '4'">
                  <el-input v-model="temp.ipcmi" :disabled="true"  placeholder="请输入主分类号" />
                </div>
                <div v-else-if="this.activeName === '5'">
                  <el-input v-model="temp.ipcmi" :disabled="true"  placeholder="请输入主分类号" />
                </div>
                <div v-else>
                  <el-input v-model="temp.ipcmi" placeholder="请输入主分类号" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="IPCOI" prop="ipcoi">
                <div v-if="this.activeName === '4'">
                  <el-input v-model="temp.ipcoi" type="textarea" :disabled="true" placeholder="请输入副分类号" />
                </div>
                <div v-else-if="this.activeName === '5'">
                  <el-input v-model="temp.ipcoi" type="textarea" :disabled="true" placeholder="请输入副分类号" />
                </div>
                <div v-else>
                  <el-input v-model="temp.ipcoi" type="textarea" placeholder="请输入副分类号" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="IPCA" prop="ipca">
                <div v-if="this.activeName === '4'">
                  <el-input
                    v-model="temp.ipca"
                    type="textarea"
                    :disabled="true"
                    placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加"
                  />
                </div>
                <div v-else-if="this.activeName === '5'">
                  <el-input
                    v-model="temp.ipca"
                    type="textarea"
                    :disabled="true"
                    placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加"
                  />
                </div>
                <div v-else>
                  <el-input
                    v-model="temp.ipca"
                    type="textarea"
                    placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CCI" prop="cci">
                <div v-if="this.activeName === '4'">
                  <el-input v-model="temp.cci" :disabled="true" placeholder="请输入cci号" />
                </div>
                <div v-else-if="this.activeName === '5'">
                  <el-input v-model="temp.cci" :disabled="true" placeholder="请输入cci号" />
                </div>
                <div v-else>
                  <el-input v-model="temp.cci" :disabled="temp.type === 'XX'" placeholder="请输入cci号" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CCA" prop="cca">
                <div v-if="this.activeName === '4'">
                  <el-input v-model="temp.cca" :disabled="true" placeholder="请输入cca号" />
                </div>
                <div v-else-if="this.activeName === '5'">
                  <el-input v-model="temp.cca" :disabled="true" placeholder="请输入cca号" />
                </div>
                <div v-else>
                  <el-input v-model="temp.cca" :disabled="temp.type === 'XX'" placeholder="请输入cca号" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CSETS" prop="csets">
                <div v-if="this.activeName === '4'">
                  <el-input v-model="temp.csets" type="textarea" :disabled="true" placeholder="请输入csets号" />
                </div>
                <div v-else-if="this.activeName === '5'">
                  <el-input v-model="temp.csets" type="textarea" :disabled="true" placeholder="请输入csets号" />
                </div>
                <div v-else>
                  <el-input v-model="temp.csets" type="textarea" :disabled="temp.type === 'XX'" placeholder="请输入csets号" />
                </div>
              </el-form-item>
            </el-col>
          </el-form>
          <el-table
            v-loading="listLoading"
            :data="classInfoList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="分类人员类型" align="center" width="120px">
              <template slot-scope="{row}">
                <a target="_blank" class="buttonText">{{ row.classtype == '主' ? '主分进案':'转案' }}</a>
              </template>
            </el-table-column>
            <el-table-column label="分类人员代码" width="120px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.worker }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前状态" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.state == '2'|| row.state == '7' ? '已完成' : '未完成' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="进案时间" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.fenpeitime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="进案来源" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.fenpeiren }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单一出案时间" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.chuantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IPCI" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ipci }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IPCMI" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ipcmi }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IPCOI" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ipcoi }}</span>
              </template>
            </el-table-column>
            <el-table-column label="CCI" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.cci }}</span>
              </template>
            </el-table-column>
            <el-table-column label="CCA" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.cca }}</span>
              </template>
            </el-table-column>
            <el-table-column label="C-Sets" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.csets }}</span>
              </template>
            </el-table-column>
            <el-table-column label="转案留言" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.message }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">关闭</el-button>
            <el-button type="primary" :disabled="saveBtn" @click="subClassification()">保存</el-button>
            <el-button type="primary" :disabled="correctBtn" @click="subClassification()">更正</el-button>
            <el-button type="primary" :disabled="finishsBtn" @click="finishcase(temp)">出案</el-button>
          </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
          <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
            <el-table-column prop="key" label="Channel" />
            <el-table-column prop="pv" label="Pv" />
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
          </span>
        </el-dialog>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="userDialogFormVisible">
          <div :model="transtemp">
            <div>
              <el-button type="info" style="float: right;" @click="handleChangeState">确认转案</el-button>
            </div>
            <div style="font-size: xx-large; text-align: center">
              <svg-icon icon-class="user" style="width: 60px; height: 60px" />
              <svg-icon
                icon-class="exchange"
                style="height: 60px;margin-left: 50px;margin-right: 50px;"
              />
              <svg-icon icon-class="user" style="width: 60px; height: 60px" />
            </div>
            <div style="font-size: large;padding-top: 5px;">
              <span style="width: 50px;margin-left: 200px;">{{ transtemp.worker }}</span>
              <span style="width: 50px;margin-left: 80px">{{ transtemp.pdfPath }}</span>
            </div>
            <div>
              <el-tree
                v-if="isLoadingTree"
                ref="expandMenuList"
                class="expand-tree"
                :data="setTree"
                node-key="name"
                highlight-current
                :props="defaultProps"
                :expand-on-click-node="false"
                center
                @node-click="handleNodeClick"
              ></el-tree>
            </div>
          </div>
        </el-dialog>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  findCaseByState,
  finishcase,
  updateClassificationInfo,
  correctCase,
} from "@/api/case-classification";
import { checkIpcServer, checkIpcCsetsServer } from "@/api/case-arbiter";
import { findUserInfo, updateWorker } from "@/api/case-disposition";
import { findClassInfoByID } from "@/api/case-query";
import waves from "@/directive/waves"; // waves directive
import { parseTime,param } from "@/utils";
// import { parseTime } from "@/utils/index";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import api from "@/api/treeApi";
export default {
  name: "Tab",
  components: { Pagination },
  directives: { waves },
  data() {
    var checkIpc = (rule, value, callback) => {
      // 空格替换
      this.loadlFuncationRplaceSpaceForTemp();
      if (value == null || value === "") {
        callback();
      } else {
        if (rule.field === "ipcmi") {
          if (value.indexOf(",") !== -1) {
            callback(new Error("主分类有且只有一个"));
          }
        }
        checkIpcServer(this.temp, rule.field).then((response) => {
          if (response.success) {
            if (rule.field === "ipcoi") {
              if (response.queryResult.map.newClassification === "") {
                this.temp.ipcoi = null;
              } else {
                this.temp.ipcoi = response.queryResult.map.newClassification;
              }
            } else if (rule.field === "ipca") {
              if (response.queryResult.map.newClassification === "") {
                this.temp.ipca = null;
              } else {
                this.temp.ipca = response.queryResult.map.newClassification;
              }
            } else if (rule.field === "ipcmi") {
              if (response.queryResult.map.newClassification === "") {
                this.temp.ipcmi = null;
              } else {
                this.temp.ipcmi = response.queryResult.map.newClassification;
              }
            }
            callback();
          } else {
            callback(response.message);
          }
        });
      }
    };
    var checkCpc = (rule, value, callback) => {
      this.loadlFuncationRplaceSpaceForTemp();
      if (value == null || value === "") {
        callback();
      } else {
        checkIpcServer(this.temp, rule.field).then((response) => {
          if (response.success) {
            if (rule.field === "cci") {
              if (response.queryResult.map.newClassification === "") {
                this.temp.cci = null;
              } else {
                this.temp.cci = response.queryResult.map.newClassification;
              }
            } else if (rule.field === "cca") {
              if (response.queryResult.map.newClassification === "") {
                this.temp.cca = null;
              } else {
                this.temp.cca = response.queryResult.map.newClassification;
              }
            }
            callback();
          } else {
            callback(response.message);
          }
        });
      }
    };
    var checkCsets = (rule, value, callback) => {
      this.loadlFuncationRplaceSpaceForTemp();
      if (value == null || value === "") {
        callback();
      } else {
        this.temp.csets = value.toUpperCase();
        checkIpcCsetsServer(this.temp).then((response) => {
          if (response.success) {
            debugger;
            this.temp.csets = response.queryResult.map.newClassification;
            callback();
          } else {
            callback(response.message);
          }
        });
      }
    };
    return {
      tabMapOptions: [
        { label: "新分待审", key: "0" }, // 主分进案
        { label: "转案待审", key: "1" }, // 作为副分
        { label: "已分待出", key: "2" }, // 给了分类号
        { label: "已出案", key: "3" }, // 已出案
        { label: "更正列表", key: "4" }, // 分类号更正待审
        { label: "裁决列表", key: "5" }, // 案件裁决待审
      ],
      activeName: "0",
      searchInfo: {
        id: "",
      },
      user: "",
      createdTimes: 0,
      list: null,
      classInfoList: undefined,
      total: 0,
      listLoading: true,
      search: {
        page: 1,
        limit: 10,
        state: this.$route.query.tab,
        beginTime: "",
        endTime: "",
      },
      rules: {
        ipcmi: [{ required: true, trigger: "blur", validator: checkIpc }],
        ipcoi: [{ required: true, trigger: "blur", validator: checkIpc }],
        ipca: [{ required: true, trigger: "blur", validator: checkIpc }],
        cci: [{ required: true, trigger: "blur", validator: checkCpc }],
        cca: [{ required: true, trigger: "blur", validator: checkCpc }],
        csets: [{ required: true, trigger: "blur", validator: checkCsets }],
      },
      temp: {
        id: undefined,
        mingcheng: "",
        type: "",
        sqr: "",
        sqh: "",
        simpleclasscode: "",
        jinantime: "",
        classtype: "",
        cci: "",
        cca: "",
        csets: "",
        ipci: "",
        ipca: "",
        ipcmi: "",
        ipcoi: "",
      },
      dialogFormVisible: false,
      userDialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        show: "案件详情及分类信息",
        update: "转案",
      },
      transtemp: {
        id: undefined,
        mingcheng: "",
        type: "",
        simpleclasscode: "",
        jinantime: new Date(),
        message: "",
        worker: "",
        //transworker: ''
      },
      dialogPvVisible: false,
      pvData: [],
      finishIds: "",
      downloadLoading: false,
      isLoadingTree: false, // 是否加载节点树
      setTree: "", // 节点树数据
      defaultProps: {
        children: "children",
        label: "name",
      },
      defaultExpandKeys: [], // 默认展开节点列表
      multipleSelection: [], // 多选
      finishsBtn: true, //出案按钮显示
      transBtn: false, //转案按钮
      saveBtn: false, //保存按钮
      correctBtn: true, //更正按钮
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
      if (this.activeName == "3") {
        //已出案案件不可转案及出案
        this.finishsBtn = true;
        this.saveBtn = true;
        this.transBtn = true;
        this.correctBtn = false;
      } else if (this.activeName == "4" || this.activeName == "5") {
        // 更正和裁决列表不可操作
        this.saveBtn = true;
        this.transBtn = true;
        this.finishsBtn = true;
        this.correctBtn = true;
      } else if (this.activeName == "0" || this.activeName == "1") {
        //新分待审和转案待审案件不可直接出案
        this.finishsBtn = true;
        this.correctBtn = true;
        this.saveBtn = false;
        this.transBtn = false;
      } else {
        this.finishsBtn = false;
        this.correctBtn = true;
        this.saveBtn = false;
        this.transBtn = false;
      }
    },
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab;
      this.finishsBtn = true;
    }
    this.getList();
  },
  mounted() {
    //console.log(api);
    this.initExpand();
  },
  methods: {
    changeTab: function (tab, event) {
      this.search.state = this.activeName;
      this.getList();
    },
    // 点击人员节点
    handleNodeClick(d, n, s) {
      // 点击节点
      // console.log(n)
      this.transtemp.pdfPath = d.name;
    },
    initExpand() {
      // 加载tree
      findUserInfo().then((response) => {
        this.setTree = response.treelist;
        this.setTree.map((a) => {
          this.defaultExpandKeys.push(a.id);
        });
      });
      this.isLoadingTree = true;
    },
    handleChangeState() {
      this.$confirm(
        " " + this.transtemp.id + "转案给：" + this.transtemp.pdfPath,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const tempData = Object.assign({}, this.transtemp);
          tempData.chuantime = +new Date(tempData.chuantime);
          tempData.jinantime = +new Date(tempData.jinantime);
          console.log(tempData);
          caseTransfer(tempData).then((response) => {
            this.$message({
              type: "success",
              message: "转案成功！",
            });
            this.userDialogFormVisible = false;
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消转案",
          });
        });
    },
    // 获取选中行id
    handleSelectionChange(val) {
      this.finishIds = "";
      for (var i = 0; i < val.length - 1; i++) {
        var halo = val[i].id;
        this.finishIds += halo + ",";
      }
      this.finishIds += val[i].id;
      this.multipleSelection = val;
    },
    // 获取分类信息
    getClassficationList() {
      //console.log(this.searchInfo.id)
      findClassInfoByID(this.searchInfo).then((response) => {
        //console.log(response)
        debugger
        this.classInfoList = response.data;
      });
    },
    showDetail(row) {
      this.dialogStatus = "show";
      this.temp = row;
      this.searchInfo.id = row.id;
      this.getClassficationList();
      //console.log('temp数据:'+ this.temp)
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    searchFunc(search) {
      if (this.search.beginTime === "" && this.search.endTime !== "") {
        alert("请选择出案开始日期");
      } else {
        this.activeName = "3";
        this.search.state = "3";
        this.getList();
      }
    },
    getList() {
      // 获取table表格数据
      this.listLoading = true;
      if (this.activeName !== "3") {
        (this.search.beginTime = ""), (this.search.endTime = "");
      }
      findCaseByState(this.search).then((response) => {
        console.log(response);
        // 返回的list
        this.list = response.data.items;
        this.total = response.data.total;
        this.user = response.user;
        setTimeout(() => {
          this.listLoading = false;
        }, 0.5 * 1000);
      });
    },
    // 分类号逻辑判断
    subClassification: function () {
      debugger
      if (this.activeName == "3") {
        this.correctBtn = true;
      }
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // ipc 与cpc 同在校验
          if (
            (this.temp.ipcmi !== null || this.temp.ipcmi !== "") &&
            (this.temp.ipcoi === null || this.temp.ipcoi === "") &&
            (this.temp.cci === null || this.temp.cci === "") &&
            (this.temp.type !== 'XX')
          ) {
            // 主分不为空，副分为空，cci 为空
            this.$confirm("检测到您的cci为空，是否继续保存", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                // 此处执行保存操作
                this.saveClassification();
              })
              .catch(() => {
                // 取消操作
              });
          } else if (
            (this.temp.ipcmi === null || this.temp.ipcmi === "") &&
            (this.temp.ipcoi === null || this.temp.ipcoi === "") &&
            (this.temp.cci !== null || this.temp.cci !== "")
          ) {
            // 主，副分为空，cci不为空
            this.$confirm(
              "检测到您的cci不为空，ipcmi/ipcoi为空，是否继续保存",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                // 此处执行出案操作
                this.saveClassification();
              })
              .catch(() => {
                // 取消操作
              });
          } else {
            // 一切正常的情况下
            this.saveClassification();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 逻辑判断通过后，进行后台保存：保存或更正
    saveClassification: function () {
      if (this.activeName == "3") {
        //进行更正操作
        this.$confirm("提交更正后不可撤销，请确认是否提交？","提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
        )
        .then(() => {
          correctCase(this.temp).then((response) => {
            if (response.success) {
              this.dialogFormVisible = false;
              this.$message({
                message: "已提交更正，等待管理员审核",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "发生错误,请稍后重试",
                type: "error",
              });
              this.correctBtn = false;
            }
          }
          )})
          .catch(() => {
            // 取消操作
            this.correctBtn = false;
          });
        }else {
        //进行保存操作
        updateClassificationInfo(this.temp).then((response) => {
          if (response.success) {
            this.dialogFormVisible = false;
            this.$message({
              message: "保存成功",
              type: "success",
            });
            this.getList();
          } else {
            this.$message({
              showClose: true,
              message: "保存失败，请稍后重试",
              type: "error",
            });
          }
        });
      }
    },
    loadlFuncationRplaceSpaceForTemp: function () {
      if (this.temp.ipcmi != null) {
        this.temp.ipcmi = this.temp.ipcmi.replace(/\s+/g, "");
      }
      if (this.temp.ipcoi != null) {
        this.temp.ipcoi = this.temp.ipcoi.replace(/\s+/g, "");
      }
      if (this.temp.ipca != null) {
        this.temp.ipca = this.temp.ipca.replace(/\s+/g, "");
      }
      if (this.temp.cci != null) {
        this.temp.cci = this.temp.cci.replace(/\s+/g, "");
      }
      if (this.temp.cca != null) {
        this.temp.cca = this.temp.cca.replace(/\s+/g, "");
      }
      if (this.temp.cset != null) {
        this.temp.csets = this.temp.csets.replace(/\s+/g, "");
      }
    },
    transfercase(row) {
      // 转案
      // 已出案、更正、裁决案件不可进行转案
      if (this.activeName == "3") {
        alert("已出案案件不可进行转案");
        return;
      }
      if (this.activeName == "4") {
        alert("更正案件不可进行转案");
        return;
      }
      if (this.activeName == "5") {
        alert("裁决案件不可进行转案");
        return;
      } else {
        // 跳转转案界面
        /* this.transtemp.id = this.multipleSelection[0].id
        this.transtemp.mingcheng = this.multipleSelection[0].mingcheng
        this.transtemp.worker = this.multipleSelection[0].worker
        this.transtemp.type = this.multipleSelection[0].type */
        this.transtemp.id = row.id;
        this.transtemp.mingcheng = row.mingcheng;
        this.transtemp.worker = row.worker;
        this.transtemp.type = row.type;
        this.$router.push({
          path: "/anjianfenlei/caseTransfer",
          query: {
            transtemp: this.transtemp,
          },
        });
      }
    },
    finishcase(row) {
      // 出案
      /* if (this.finishIds == ''){
        alert('请至少选择一个案件')
      } else {
          finishcase(this.finishIds, this.user).then(response => {
          if(response.success) {
            alert('出案成功')
          } else {
            alert('出案失败')
          }
        })
      } */
      this.finishsBtn = true;
      this.finishIds = row.id;
      this.user = row.worker;
      finishcase(this.finishIds, this.user).then((response) => {
        if (response.success) {
          this.dialogFormVisible = false;
          this.$message({
              message: "出案成功",
              type: "success",
          });
          this.getList();
        } else {
          this.$message({
              showClose: true,
              message: response.message,
              type: "error",
          });
          this.getList();
        }
      });
    },
    handleFilter() {
      this.search.page = 1;
      this.getList();
    }
  },
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
