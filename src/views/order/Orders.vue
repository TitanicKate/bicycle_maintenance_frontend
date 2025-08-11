<template>
  <el-card class="order-manage-container">
    <!-- 查询区域 -->
    <!-- 查询区域 -->
    <el-form :model="searchForm" inline label-width="100px" class="search-form">
      <el-form-item label="车辆类型">
        <el-select
            v-model="searchForm.bicycleType"
            placeholder="选择车辆类型"
            style="width: 150px">
          <el-option
              v-for="(type, index) in bicycleTypeOptions"
              :key="index"
              :label="type.label"
              :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障类型">
        <el-select
            v-model="searchForm.faultType"
            placeholder="选择故障类型"
            style="width: 150px">
          <el-option
              v-for="(fault, index) in faultTypeOptions"
              :key="index"
              :label="fault.label"
              :value="fault.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要服务">
        <el-select
            v-model="searchForm.needService"
            placeholder="选择是否需要服务"
            style="width: 180px">
          <el-option
              v-for="(needService, index) in needServiceOptions"
              :key="index"
              :label="needService.label"
              :value="needService.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            style="width: 140px">
          <el-option
              v-for="(status, index) in statusOptions"
              :key="index"
              :label="status.label"
              :value="status.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" :loading="searchLoading">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <div class="button-group">
      <el-button type="success" @click="openAddDialog">新增订单</el-button>
      <el-button type="danger" @click="handleDeleteBatchOrder" :disabled="selectedRows.length === 0">批量删除
      </el-button>
    </div>

    <!-- 订单表格 -->
    <el-table
        :data="filterData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="tableLoading"
        element-loading-text="加载中..."
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="订单ID" width="120" align="center"></el-table-column>
      <el-table-column
          prop="faultType"
          label="故障类型"
          align="center"
          :formatter="formatFaultType"
      ></el-table-column>
      <el-table-column
          prop="description"
          label="故障描述"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="bicycleType"
          label="车辆类型"
          align="center"
          :formatter="formatBicycleType"
      ></el-table-column>
      <el-table-column
          prop="appointmentTime"
          label="预约时间"
          align="center"
          width="200"
          :formatter="formatTime"
      ></el-table-column>
      <el-table-column
          prop="userId"
          label="用户ID"
          align="center"
          width="120"
      ></el-table-column>
      <el-table-column
          prop="repairmanId"
          label="维修人员ID"
          align="center"
          width="120"
      ></el-table-column>
      <el-table-column
          prop="needService"
          label="是否需要服务"
          align="center"
          :formatter="formatNeedService"
      ></el-table-column>
      <el-table-column
          prop="serviceAddress"
          label="服务地址"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="status"
          label="状态"
          align="center"
          :formatter="formatStatus"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
              type="primary"
              :icon="Edit"
              size="mini"
              circle
              @click="openEditDialog(scope.row)"
          ></el-button>
          <el-button
              type="danger"
              :icon="Delete"
              size="mini"
              circle
              @click="handleDeleteOrder(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right"
    ></el-pagination>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
        title="订单信息"
        v-model="dialogVisible"
        width="600px"
        @close="handleDialogClose"
    >
      <el-form
          :model="form"
          label-width="120px"
          class="dialog-form"
          :rules="formRules"
          ref="formRef"
      >
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-date-picker
              v-model="form.appointmentTime"
              type="datetime"
              placeholder="选择预约时间"
              style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车辆类型" prop="bicycleType">
          <el-select v-model="form.bicycleType" placeholder="选择车辆类型" style="width: 100%">
            <el-option
                v-for="(type, index) in bicycleTypeOptions"
                :key="index"
                :label="type.label"
                :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障类型" prop="faultType">
          <el-select v-model="form.faultType" placeholder="选择故障类型" style="width: 100%">
            <el-option
                v-for="(fault, index) in faultTypeOptions"
                :key="index"
                :label="fault.label"
                :value="fault.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入故障描述"></el-input>
        </el-form-item>
        <el-form-item label="是否需要上门" prop="need_service">
          <el-switch
              v-model="form.needService"
              active-value="1"
              inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
            label="服务地址"
            prop="serviceAddress"
            v-if="form.needService == 1"
            :required="form.needService == 1"
        >
          <el-input v-model="form.serviceAddress" placeholder="请输入服务地址"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddOrUpdateOrder" :loading="submitLoading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElPagination,
  ElDialog,
  ElSwitch,
  ElSelect,
  ElOption
} from 'element-plus'
import {
  ElMessageBox,
  ElMessage,
  ElLoading
} from 'element-plus'

import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'

// 状态枚举
const statusOptions = [
  {label: '待受理', value: 0},
  {label: '维修中', value: 1},
  {label: '已完成', value: 2},
  {label: '已取消', value: 3}
]

// 车辆类型枚举
const bicycleTypeOptions = [
  {label: '普通自行车', value: 0},
  {label: '山地自行车', value: 1},
  {label: '公路自行车', value: 2},
]

// 故障类型枚举
const faultTypeOptions = [
  {label: '其他故障', value: 0},
  {label: '爆胎故障', value: 1},
  {label: '刹车故障', value: 2},
  {label: '链条故障', value: 3},
  {label: '车轮故障', value: 4},
]

// 是否需要上门
const needServiceOptions = [
  {label: '是', value: 1},
  {label: '否', value: 0},
]

// 响应式数据
const filterData = ref([]) // 表格数据
const tableData = ref([]) // 表格数据
const searchForm = reactive({
  bicycleType: null,
  faultType: null,
  needService: null,
  status: null
}) // 查询表单
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const total = ref(0) // 总条数
const dialogVisible = ref(false) // 弹窗显隐
const form = reactive({
  id: '',
  appointmentTime: null,
  bicycleType: '',
  createTime: null,
  description: '',
  faultType: '',
  repairmanId: '',
  status: 0,
  updateTime: null,
  userTd: '',
  needService: 0,
  serviceAddress: ''
}) // 弹窗表单
const selectedRows = ref([]) // 选中行数据
const tableLoading = ref(false) // 表格加载状态
const searchLoading = ref(false) // 查询按钮加载状态
const submitLoading = ref(false) // 提交按钮加载状态
const formRef = ref(null) // 表单引用
const searchTimer = ref(null) // 防抖计时器
// 新增：存储全量维修单数据
const allOrderData = ref([])

// 表单验证规则
const formRules = reactive({
  appointment_time: [
    {required: true, message: '请选择预约时间', trigger: 'change'}
  ],
  bicycle_type: [
    {required: true, message: '请选择车辆类型', trigger: 'change'}
  ],
  fault_type: [
    {required: true, message: '请选择故障类型', trigger: 'change'}
  ],
  description: [
    {required: true, message: '请输入故障描述', trigger: 'blur'},
    {max: 200, message: '故障描述不能超过200个字符', trigger: 'blur'}
  ],
  status: [
    {required: true, message: '请选择状态', trigger: 'change'}
  ],
  service_address: [
    {required: true, message: '请输入服务地址', trigger: 'blur'},
    {max: 100, message: '服务地址不能超过100个字符', trigger: 'blur'}
  ]
})

// 引入订单API服务
import {
  getOrderService,
  addOrderService,
  updateOrderService,
  deleteOrderService,
  deleteBatchOrderService,
  getAllOrderService
} from "../../api/order.js";

// 初始化加载数据
onMounted(() => {
  handleGetAllOrderList()
})

// 获取表格数据
const handleGetAllOrderList = async () => {
  tableLoading.value = true
  try {
    const result = await getAllOrderService()
    if (result.data.code === 200) {
      allOrderData.value = result.data.data || [] // 缓存全量数据
      handleLocalSearch()  // 触发本地筛选
    } else {
      ElMessage.error(result.data.message || '获取订单列表失败')
    }
  } catch (error) {
    ElMessage.error('获取订单列表失败，请重试')
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

// 输入防抖处理
const handleInputDebounce = () => {
  if (searchTimer.value) clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    currentPage.value = 1  // 重置页码
    handleGetAllOrderList()
  }, 300)
}

const handleAddOrUpdateOrder = async () => {
  // 验证表单
  await formRef.value.validate().catch(err => {
    ElMessage.error(err.message)
    return Promise.reject(err)
  })

  submitLoading.value = true
  try {
    if (form.id) {
      const updateData = {...form}
      // 修改
      let result = await updateOrderService(updateData)
      if (result.data.code === 200) {
        dialogVisible.value = false
        ElMessage.success(result.data.message || '更新成功')
        handleGetAllOrderList()
      } else {
        ElMessage.error(result.data.message || '更新失败')
      }
    } else {
      // 新增
      let result = await addOrderService(form)
      if (result.data.code === 200) {
        dialogVisible.value = false
        ElMessage.success(result.data.message || '添加成功')
        // 新增成功后跳转到最后一页
        currentPage.value = Math.ceil((total.value + 1) / pageSize.value)
        handleGetAllOrderList()
      } else {
        ElMessage.error(result.data.message || '添加失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 删除维修但（单条）
const handleDeleteOrder = async (row) => {
  try {
    await ElMessageBox.confirm(
        '确定要删除此订单吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const loading = ElLoading.service({
      lock: true,
      text: '正在删除...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    let result = await deleteOrderService(row.id)
    if (result.data.code === 200) {
      ElMessage.success(result.data.message || '删除成功')
      // 处理删除后分页逻辑
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
      handleGetAllOrderList()
    } else {
      ElMessage.error(result.data.message || '删除失败')
    }
    loading.close()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试')
      console.error(error)
    }
  }
}

// 批量删除
const handleDeleteBatchOrder = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的订单')
    return
  }

  try {
    await ElMessageBox.confirm(
        `确定要删除选中的${selectedRows.value.length}个订单吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const loading = ElLoading.service({
      lock: true,
      text: '正在删除...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const ids = selectedRows.value.map(item => item.id)
    let result = await deleteBatchOrderService(ids)
    if (result.data.code === 200) {
      ElMessage.success(result.data.message || '批量删除成功')
      // 处理删除后分页逻辑
      if (tableData.value.length === selectedRows.value.length && currentPage.value > 1) {
        currentPage.value--
      }
      handleGetAllOrderList()
    } else {
      ElMessage.error(result.data.message || '批量删除失败')
    }
    loading.close()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败，请重试')
      console.error(error)
    }
  }
}

const handleLocalSearch = () => {
  // 1.基础筛选
  let filtered = allOrderData.value.filter(item => {
    const bicycleTypeMatch = searchForm.bicycleType !== null
        ? item.bicycleType === searchForm.bicycleType
        : true
    console.log(bicycleTypeMatch)
    const faultTypeMatch = searchForm.faultType !== null
        ? item.faultType === searchForm.faultType
        : true
    const needServiceMatch = searchForm.needService !== null
        ? item.needService === searchForm.needService
        : true
    const statusMatch = searchForm.status !== null
        ? item.status === searchForm.status
        : true
    return bicycleTypeMatch && faultTypeMatch && needServiceMatch && statusMatch
  })

  // 2.更新总条数
  total.value = filtered.length

  // 3.处理分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  filterData.value = filtered.slice(startIndex, endIndex)
}

// 查询
const handleSearch = () => {
  searchLoading.value = true
  currentPage.value = 1 // 查询时重置页码
  handleLocalSearch()
  console
      .log(searchForm)
  searchLoading.value = false
}

// 分页-每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  handleLocalSearch()
}

// 重置方法
const resetSearch = () => {
  searchForm.bicycleType = null
  searchForm.faultType = null
  searchForm.needService = null
  searchForm.status = null
  handleSearch()
}

// 分页-当前页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  handleGetAllOrderList()
}

// 多选事件
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

// 打开新增弹窗
const openAddDialog = () => {
  dialogVisible.value = true
  // 重置表单
  formRef.value.resetFields()
  form.id = ''
  form.status = 0 // 默认待处理
  form.need_service = 0 // 默认不需要上门
  form.service_address = ''
}

// 打开编辑弹窗
const openEditDialog = (row) => {
  dialogVisible.value = true
  // 重置表单验证
  formRef.value.resetFields()
  // 赋值表单
  Object.assign(form, row)
  // 处理日期类型转换
  if (row.appointment_time) {
    form.appointment_time = new Date(row.appointment_time)
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value.resetFields()
}

// 格式化车辆类型显示
const formatBicycleType = (row) => {
  const bicycleType = bicycleTypeOptions.find(item => item.value === row.bicycleType)
  return bicycleType ? bicycleType.label : '未知车辆类型'
}

// 格式化故障类型显示
const formatFaultType = (row) => {
  const faultType = faultTypeOptions.find(item => item.value === row.faultType)
  return faultType ? faultType.label : '未知故障类型'
}

// 格式化状态显示
const formatStatus = (row) => {
  const status = statusOptions.find(item => item.value === row.status)
  return status ? status.label : '未知状态'
}

// 格式化是否需要服务显示
const formatNeedService = (row) => {
  return row.needService === 1 ? '是' : '否'
}

// 格式化时间显示
const formatTime = (row, column) => {
  const timeValue = row[column.property]
  if (!timeValue) return '';

  const date = new Date(timeValue);
  // 处理无效日期的情况
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
};
</script>

<style scoped>
.order-manage-container {
  border-radius: 20px;
  padding: 20px;
}

.search-form {
  margin-bottom: 16px;
}

.button-group {
  margin-bottom: 16px;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-footer {
  text-align: right;
}
</style>