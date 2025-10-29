<template>
  <div class="kanban-list-wp">
    <div class="new-box" @click="handleCreate">
      <img src="@/assets/images/new-project.png" />
      <span class="text-title ellipsis">新建大屏</span>
    </div>
    <div class="list-header">
      <div class="title">
        <h2>{{ group ? group.name : '' }} ({{ listData.total }})</h2>
      </div>
      <div class="header-manager">
        <a-input
          v-model:value="query.name"
          placeholder="搜索"
          allowClear
          @keyup.enter="handleSearch"
          @clear="handleClear"
        >
          <template #suffix>
            <AntIcon name="SearchOutlined" style="cursor: pointer" @click="handleSearch" />
          </template>
        </a-input>
      </div>
    </div>
    <!--列表-->
    <ul class="list-wrap">
      <li v-for="item in listData.rows" :key="item.id" class="base-list-item">
        <div class="list-item-inner">
          <div class="list-item-img">
            <div class="preview-image">
              <img v-if="getThumb(item.pageConfig)" :src="getThumb(item.pageConfig)" alt="" />
              <img
                v-else
                src="@/assets/images/logo.png"
                alt="default"
                style="width: 147px; height: 147px; padding: 30px"
              />
            </div>
            <div class="list-item-mask">
              <div class="action">
                <a-button type="primary" @click="handleEdit(item)">
                  <template #icon>
                    <AntIcon name="EditOutlined" />
                  </template>
                  编辑
                </a-button>
              </div>
              <div class="icon-box">
                <a-space>
                  <AntIcon
                    name="SendOutlined"
                    v-if="item.status === 'edit'"
                    @click="handlePublish(item)"
                    title="发布"
                  ></AntIcon>
                  <AntIcon name="EyeOutlined" @click="handlePreview(item)" title="预览"></AntIcon>
                  <AntIcon name="CopyOutlined" @click="handleCopy(item)" title="复制"></AntIcon>
                  <AntIcon
                    name="DeleteOutlined"
                    @click="removeDashboard(item.id)"
                    title="删除"
                  ></AntIcon>
                </a-space>
              </div>
            </div>
          </div>
          <div class="list-item-info">
            <div class="item-title" t-ellipsis :title="item.name">
              <AntIcon
                :name="item.directory === 'Y' ? 'FolderOutlined' : 'LineChartOutlined'"
                :style="{ color: item.directory === 'Y' ? '#fa8c16' : '#1089ff' }"
              />
              <span>
                {{ item.name }}
              </span>
            </div>
            <a-tag
              :color="item.status === 'audited' ? 'success' : 'warning'"
              dot
              :tag-style="{ color: '#999' }"
            >
              {{ item.status === 'audited' ? '已发布' : '待发布' }}
            </a-tag>
          </div>
        </div>
      </li>
    </ul>
    <div class="loading-wrap" flex="main:center cross:center" v-show="listData.loading">
      <a-spin></a-spin>
    </div>
    <a-empty
      v-show="!listData.loading && listData.rows.length === 0"
      :description="noData ? '查询无结果' : '该分组下没有大屏'"
    ></a-empty>
    <div class="t-center pb-24" v-show="!listData.loading && listData.total > 0">
      <a-pagination
        :total="listData.total"
        :current="query.page"
        :pageSize="query.size"
        @change="pageChange"
      ></a-pagination>
    </div>
  </div>
  <create-kanban ref="createRef"></create-kanban>
</template>

<script setup>
import { reactive, ref, watch, onBeforeUnmount } from 'vue'
import { throwError } from '@/utils/util'
import {
  getDashboardList,
  loadKanban,
  publishKanban,
  removeKanban,
  saveKanban,
} from '@/api/modules/analysis-dashboard.api'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import CreateKanban from './create-kanban.vue'
import { listenMsg } from '@/utils/cross-tab-msg'

const props = defineProps({
  group: {
    type: Object,
    default: () => ({}),
  },
})
const router = useRouter()
const route = useRoute()
const createRef = ref(null)
const noData = ref(false)

// 列表数据查询
const query = reactive({
  name: '',
  page: 1,
  size: 10,
})
const listData = reactive({
  rows: [],
  total: 0,
  loading: false,
})
const modelObj = reactive({
  id: '',
  pid: '',
  name: '',
  directory: 'N',
})

const getSearchList = async () => {
  try {
    listData.loading = true
    const res = await getDashboardList({ pid: props.group.pid, ...query })
    listData.rows = (res.rows || []).map(item => {
      let json = {}
      try {
        json = JSON.parse(item.layout)
      } catch (e) {
        json = {}
      }
      return {
        id: item.id,
        name: item.name,
        status: item.status,
        pageConfig: json,
      }
    })
    listData.total = res.total
  } catch (e) {
    throwError('kanban-list/getSearchList', e)
  }
  listData.loading = false
}

const pageChange = async page => {
  query.page = page
  await getSearchList()
}

// 搜索处理
const handleSearch = async () => {
  query.page = 1
  noData.value = true
  await getSearchList()
}

// 清除搜索
const handleClear = async () => {
  query.name = ''
  query.page = 1
  noData.value = false
  await getSearchList()
}

// 预览页面
const handlePreview = item => {
  let routeData = router.resolve({ path: `/screen/${item.id}` })
  window.open(routeData.href, '_blank')
}

function getThumb(pageConfig) {
  return pageConfig.thumbnail || pageConfig.bgImage
}
// 重置
const resetModelObj = () => {
  modelObj.pid = ''
  modelObj.name = ''
  modelObj.directory = 'N'
}

// 跳转分析大屏编辑页
const gotoDashboard = id => {
  let routeData = router.resolve({
    path: '/schema/screen',
    query: { id },
  })
  window.open(routeData.href, '_blank')
}

// 创建分析大屏
const handleCreate = () => {
  createRef.value && createRef.value.openCreate()
  // router.push({ path: '/schema/create-screen' })
}

// 编辑按钮
const handleEdit = item => {
  resetModelObj()
  modelObj.id = item.id
  modelObj.pid = item.pid
  modelObj.name = item.name
  modelObj.directory = item.directory
  gotoDashboard(item.id)
}

// 复制按钮
const handleCopy = async item => {
  try {
    const kanban = await loadKanban(item.id)
    kanban.name = `${kanban.name}_copy`
    delete kanban['id']
    await saveKanban({ ...kanban, status: 'edit' })
    await getSearchList()
    message.success('复制成功！')
  } catch (e) {
    throwError('kanban-list/handleCopy', e)
  }
}

// 发布按钮
const handlePublish = async item => {
  if (item.status === 'audited') return
  try {
    Message(`正在发布[${item.name}]`)
    await publishKanban(item.id)
    await getSearchList()
    message.success('发布成功！')
  } catch (e) {
    throwError('kanban-list/handlePublish', e)
  }
}

// 删除模型或文件夹
const removeDashboard = id => {
  Modal.confirm({
    title: '提示',
    content: '删除后无法恢复，确认删除？',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await removeKanban(id)
        await getSearchList()
        message.success('删除成功！')
      } catch (e) {
        throwError('kanban-list/removeDashboard', e)
      }
    },
    onCancel() {
      console.log('取消删除')
    },
  })
}

watch(
  [() => props.group, () => route.path],
  () => {
    query.page = 1
    query.name = ''
    getSearchList()
    noData.value = false
  },
  { immediate: true, deep: true },
)

// 监听跨tab页签消息
const cancelListen = listenMsg(getSearchList)
onBeforeUnmount(cancelListen)
</script>

<style scoped>
.kanban-list-wp {
  position: relative;
  .new-box {
    width: 198px;
    height: 48px;
    margin: var(--datav-font-size-lg) 0 var(--datav-border-radius-lg) 0;
    padding: 0 var(--datav-border-radius-lg);
    vertical-align: middle;
    border: 1px solid var(--s-border-color);
    background: #22272e;
    border-radius: var(--datav-border-radius-sm);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    color: #fff;
    img {
      height: 100%;
    }
    .text-title {
      padding-left: var(--datav-border-radius-sm);
      flex: 1;
      font-size: 18px;
      letter-spacing: 1px;
    }
    &:hover {
      border-color: var(--ant-primary-color);
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(36, 131, 255, 0.08);
      }
    }
  }
  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #3a4659;
    padding-bottom: 5px;
    padding-top: 10px;
    height: 56px;
    z-index: 1;
    min-width: 1024px;
    .title {
      display: flex;
      align-items: center;
      padding: 5px 0;
      h2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px;
        font-size: 20px;
        letter-spacing: 2px;
        color: var(--ant-primary-color);
        padding: 0 10px;
        border-left: 2px solid var(--ant-primary-color);
        font-weight: normal;
      }
    }
  }
  .list-wrap {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding-top: var(--datav-font-size-sm);
    user-select: none;
    padding-bottom: 50px;
    margin: 0 -10px;
    .base-list-item {
      width: 20%;
      padding: 10px;
    }
    @media screen and (min-width: 1600px) and (max-width: 1800px) {
      .base-list-item {
        width: 25%;
      }
    }
    @media screen and (max-width: 1600px) {
      .base-list-item {
        width: 33.3333%;
      }
    }
    .list-item-inner {
      border-radius: var(--datav-border-radius-base);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--s-border-color);
      outline: 1px solid transparent;
      transition: 0.2s;
      &:hover {
        outline: 1px solid var(--ant-primary-color);
        .list-item-img .list-item-mask {
          opacity: 1;
        }
        .preview-image img {
          transform: scale(1.15);
        }
      }
    }
    .list-item-img {
      width: 100%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
      position: relative;
      .preview-image {
        padding: var(--datav-border-radius-lg);
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        text-align: center;
        img {
          width: 100%;
          height: 100%;
          opacity: 0.7;
          object-fit: cover;
          transition: 0.2s;
        }
      }
      .list-item-mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        transition: 0.2s;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        opacity: 0;
        .icon-box,
        .icon-ctrl {
          display: flex;
          justify-content: center;
          > .anticon {
            cursor: pointer;
            font-size: var(--datav-font-size-lg);
            color: #fff;
            + .anticon {
              margin-left: var(--datav-border-radius-lg);
            }
            &:hover {
              color: var(--ant-primary-color);
            }
          }
        }
        .icon-box {
          position: absolute;
          top: var(--datav-border-radius-base);
          right: var(--datav-border-radius-base);
          display: flex;
          justify-content: center;
          z-index: 1;
          > .anticon {
            cursor: pointer;
            font-size: 18px;
            color: #fff;
            + .anticon {
              margin-left: var(--datav-font-size-sm);
            }
            &:hover {
              color: var(--ant-primary-color);
            }
          }
        }
      }
    }
    .list-item-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      height: 36px;
      background: var(--s-color-1);
      transition: 0.2s;
      .item-title {
        width: 170px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: var(--datav-font-size-base);
      }
    }
  }
  .loading-wrap {
    position: absolute;
    top: 100px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
