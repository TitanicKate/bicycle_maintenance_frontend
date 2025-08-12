<template>
  <el-card class="resource-management">
    <el-page-header content="资源管理" />
    <el-tabs v-model="activeTab" class="mt-4">
      <el-tab-pane label="耗材管理" name="consumables">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>耗材列表</span>
              <el-button type="primary" @click="openConsumableDialog('add')">新增耗材</el-button>
            </div>
          </template>
          <el-table :data="consumables" border style="width: 100%">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="model" label="型号" />
            <el-table-column prop="stock" label="库存" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="openConsumableDialog('edit', scope.row)">编辑</el-button>
                <el-button type="text" danger @click="deleteResource(consumables, scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="维修工具管理" name="tools">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>维修工具列表</span>
              <el-button type="primary" @click="openToolDialog('add')">新增维修工具</el-button>
            </div>
          </template>
          <el-table :data="tools" border style="width: 100%">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === '可用' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="openToolDialog('edit', scope.row)">编辑</el-button>
                <el-button type="text" danger @click="deleteResource(tools, scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 耗材编辑/新增弹窗 -->
    <el-dialog v-model="consumableDialogVisible" title="耗材信息" width="500px">
      <el-form :model="consumableForm" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="consumableForm.name" />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="consumableForm.model" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="consumableForm.stock" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="consumableDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveConsumable">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 维修工具编辑/新增弹窗 -->
    <el-dialog v-model="toolDialogVisible" title="维修工具信息" width="500px">
      <el-form :model="toolForm" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="toolForm.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="toolForm.type" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="toolForm.status">
            <el-option label="可用" value="可用" />
            <el-option label="损坏" value="损坏" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toolDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTool">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 标签页激活项
const activeTab = ref('consumables');

// 耗材数据（模拟，实际可从接口获取）
const consumables = ref([
  { id: 1, name: '刹车线', model: 'CL-001', stock: 20 },
  { id: 2, name: '内胎', model: 'TT-002', stock: 15 },
]);
// 维修工具数据（模拟，实际可从接口获取）
const tools = ref([
  { id: 1, name: '扳手', type: '维修工具', status: '可用' },
  { id: 2, name: '螺丝刀', type: '维修工具', status: '可用' },
]);

// 耗材弹窗相关
const consumableDialogVisible = ref(false);
const consumableForm = ref({ name: '', model: '', stock: 0 });
let currentConsumableId = null;

// 维修工具弹窗相关
const toolDialogVisible = ref(false);
const toolForm = ref({ name: '', type: '', status: '可用' });
let currentToolId = null;

// 打开耗材弹窗（新增/编辑）
const openConsumableDialog = (type, row) => {
  consumableDialogVisible.value = true;
  if (type === 'edit') {
    currentConsumableId = row.id;
    consumableForm.value = { ...row };
  } else {
    currentConsumableId = null;
    consumableForm.value = { name: '', model: '', stock: 0 };
  }
};

// 保存耗材
const saveConsumable = () => {
  if (currentConsumableId) {
    // 编辑逻辑，找到对应项更新
    const index = consumables.value.findIndex(item => item.id === currentConsumableId);
    if (index !== -1) {
      consumables.value[index] = { ...consumableForm.value };
      ElMessage.success('耗材信息编辑成功');
    }
  } else {
    // 新增逻辑，模拟生成id，实际可由后端返回
    const newId = Math.max(...consumables.value.map(item => item.id)) + 1;
    consumables.value.push({ id: newId, ...consumableForm.value });
    ElMessage.success('耗材新增成功');
  }
  consumableDialogVisible.value = false;
};

// 打开维修工具弹窗（新增/编辑）
const openToolDialog = (type, row) => {
  toolDialogVisible.value = true;
  if (type === 'edit') {
    currentToolId = row.id;
    toolForm.value = { ...row };
  } else {
    currentToolId = null;
    toolForm.value = { name: '', type: '', status: '可用' };
  }
};

// 保存维修工具
const saveTool = () => {
  if (currentToolId) {
    // 编辑逻辑，找到对应项更新
    const index = tools.value.findIndex(item => item.id === currentToolId);
    if (index !== -1) {
      tools.value[index] = { ...toolForm.value };
      ElMessage.success('维修工具信息编辑成功');
    }
  } else {
    // 新增逻辑，模拟生成id，实际可由后端返回
    const newId = Math.max(...tools.value.map(item => item.id)) + 1;
    tools.value.push({ id: newId, ...toolForm.value });
    ElMessage.success('维修工具新增成功');
  }
  toolDialogVisible.value = false;
};

// 删除资源通用方法
const deleteResource = (resourceList, id) => {
  const index = resourceList.findIndex(item => item.id === id);
  if (index !== -1) {
    resourceList.splice(index, 1);
    ElMessage.success('删除成功');
  }
};
</script>

<style scoped>
.resource-management {
  border-radius: 20px;
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-footer {
  text-align: right;
}
</style>