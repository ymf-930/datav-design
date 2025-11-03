import { fetchData } from '@/api/request'
import ldb from '@/config/localforage-db' // 本地存储
import { findIndex, uuid, isEmpty, deepCopy } from '@/utils/util'

// ========== API配置 ==========
// 是否使用远程API接口
// true: 使用后端接口
// false: 使用本地存储（LocalForage）
const USE_REMOTE_API = false

// 接口路径前缀（仅在 USE_REMOTE_API = true 时生效）
const API_PREFIX = '/analysis/kanban'
// ========== API配置结束 ==========

// 文件夹key
const FOLDER_KEY = 'DASHBOARD_FOLDER'
// 文件夹key
const LIST_KEY = 'DASHBOARD_LIST'
// 默认文件夹对象
const DEFAULT_FOLDER = {
  id: '1',
  text: '分析看板',
  parentId: '0',
  children: [
    { id: '7f0000017da314fa817dbc02cbb800ea', text: '我的看板', parentId: '1', children: [], isSystem: true },
    { id: '7f0000017da314fa817dbc02cbb800eb', text: '模板广场', parentId: '1', children: [], isSystem: true },
  ],
}
// 默认list
const DEFAULT_LIST = [
  {
    id: '7f0000017de61662817e03c021cc0047',
    layout:
      '{"width":1920,"height":1080,"bgColor":"#0d2a42","bgImage":"","grid":1,"thumbnail":""}',
    name: '测试看板',
    pid: '1',
    status: 'edit',
    components: [
      {
        componentContent:
          '{"id":"MainTitle_6941","name":"VMainTitle","alias":"通用标题","type":"com","locked":false,"hided":false,"attr":{"x":507,"y":277,"w":300,"h":48,"rotate":0,"opacity":1},"apiData":{},"events":{},"icon":"FileWordOutlined","config":{"title":"我是标题数据","textStyle":{"fontFamily":"Microsoft Yahei","fontSize":24,"color":"#fff","fontWeight":"normal"},"textAlign":"center","writingMode":"horizontal-tb","backgroundStyle":{"show":false,"bgColor":"#008bff","borderRadius":15,"borderColor":"#fff","borderStyle":"solid","borderWidth":1},"ellipsis":false,"urlConfig":{"url":"","isBlank":false}}}',
        componentDataType: 'static',
        componentId: null,
        componentName: null,
        componentType: null,
        drill: [],
        filters: [],
        kanbanId: '7f0000017de61662817e03c021cc0047',
        limitNum: 0,
        modelId: '',
        name: '通用标题',
        x: [],
        y: [],
      },
    ],
  },
]

/**
 * 获取看板目录
 */
export async function getKanbanDir() {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      return await fetchData({
        url: `${API_PREFIX}/folder/tree`,
        method: 'post',
      })
    } catch (e) {
      console.error('获取看板目录失败:', e)
      return DEFAULT_FOLDER
    }
  } else {
    // 使用本地存储
    try {
      const data = await ldb.getItem(FOLDER_KEY)
      if (data) return data
      await ldb.setItem(FOLDER_KEY, DEFAULT_FOLDER)
      return DEFAULT_FOLDER
    } catch (e) {
      return DEFAULT_FOLDER
    }
  }
}

/**
 * 创建目录
 */
export async function createFolder(folder) {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      const res = await fetchData({
        url: `${API_PREFIX}/folder/create`,
        method: 'post',
        data: {
          pid: folder.pid || '1',
          name: folder.name,
          directory: folder.directory || 'Y',
        },
      })
      return res?.id ? true : false
    } catch (e) {
      console.error('创建目录失败:', e)
      return false
    }
  } else {
    // 使用本地存储
    const newObj = { id: uuid(), parentId: folder.pid, text: folder.name, children: [] }
    try {
      const data = await ldb.getItem(FOLDER_KEY)
      if (data) {
        // 存在表
        data.children.push(newObj)
        await ldb.setItem(FOLDER_KEY, data)
      }
      return true
    } catch (e) {
      return false
    }
  }
}

/**
 * 修改目录
 */
export async function modifyFolder(folder) {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      await fetchData({
        url: `${API_PREFIX}/folder/update`,
        method: 'post',
        data: {
          id: folder.id,
          name: folder.name,
        },
      })
      return true
    } catch (e) {
      console.error('修改目录失败:', e)
      return false
    }
  } else {
    // 使用本地存储
    try {
      const data = await ldb.getItem(FOLDER_KEY)
      if (data) {
        // 存在表
        const index = findIndex(data.children, folder.id)
        data.children[index] = { ...data.children[index], text: folder.name }
        await ldb.setItem(FOLDER_KEY, data)
      }
      return true
    } catch (e) {
      return false
    }
  }
}

/**
 * 移除文件夹
 */
export async function removeFolder(id) {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      await fetchData({
        url: `${API_PREFIX}/folder/delete`,
        method: 'post',
        data: { id },
      })
      return true
    } catch (e) {
      console.error('删除文件夹失败:', e)
      return false
    }
  } else {
    // 使用本地存储
    try {
      const data = await ldb.getItem(FOLDER_KEY)
      if (data) {
        // 存在表
        const index = findIndex(data.children, id)
        data.children.splice(index, 1)
        await ldb.setItem(FOLDER_KEY, data)
      }
      return true
    } catch (e) {
      return false
    }
  }
}

/**
 * 移除看板
 */
export async function removeKanban(id) {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      await fetchData({
        url: `${API_PREFIX}/delete`,
        method: 'post',
        data: { id },
      })
      return true
    } catch (e) {
      console.error('删除看板失败:', e)
      return false
    }
  } else {
    // 使用本地存储
    try {
      const data = await ldb.getItem(LIST_KEY)
      if (data) {
        // 存在表
        const index = findIndex(data, id)
        data.splice(index, 1)
        await ldb.setItem(LIST_KEY, data)
      }
      return true
    } catch (e) {
      return false
    }
  }
}

/**
 * 获取分析看板列表
 * @param {Object} params - 查询参数
 * @param {string} params.pid - 文件夹ID
 * @param {string} params.name - 搜索关键词
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 */
export async function getDashboardList(params = {}) {
  const { pid, name = '', page = 1, size = 10 } = params

  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      const res = await fetchData({
        url: `${API_PREFIX}/list`,
        method: 'post',
        data: {
          pid: pid || undefined, // 不传则查询全部
          name,
          page,
          size,
        },
      })
      return {
        rows: res.rows || [],
        total: res.total || 0,
      }
    } catch (e) {
      console.error('获取看板列表失败:', e)
      return { rows: [], total: 0 }
    }
  } else {
    // 使用本地存储
    try {
      let data = await ldb.getItem(LIST_KEY)
      if (!data) {
        await ldb.setItem(LIST_KEY, DEFAULT_LIST)
        data = DEFAULT_LIST
      }

      // 根据pid过滤
      let filtered = pid ? data.filter(item => item.pid === pid) : data

      // 根据名称搜索
      if (name) {
        filtered = filtered.filter(item => item.name.includes(name))
      }

      // 分页
      const total = filtered.length
      const start = (page - 1) * size
      const rows = filtered.slice(start, start + size)

      return { rows, total }
    } catch (e) {
      return { rows: DEFAULT_LIST, total: DEFAULT_LIST.length }
    }
  }
}

/**
 * 发布已保存的看板
 */
export async function publishKanban(id) {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      await fetchData({
        url: `${API_PREFIX}/publish`,
        method: 'post',
        data: { id },
      })
      return true
    } catch (e) {
      console.error('发布看板失败:', e)
      return false
    }
  } else {
    // 使用本地存储
    try {
      const data = await ldb.getItem(LIST_KEY)
      if (data) {
        const index = findIndex(data, id)
        data[index].status = 'audited'
        await ldb.setItem(LIST_KEY, data)
      }
      return true
    } catch (e) {
      return false
    }
  }
}

/**
 * 保存分析看板
 * id: 当id为空时，创建看板，当id不为空时，更新看板
 * name: 看板名称
 */
export async function saveKanban({ id, name, pid, status, layout, components }) {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      // layout如果是对象，需要转为字符串
      const layoutStr = typeof layout === 'string' ? layout : JSON.stringify(layout || {})

      const res = await fetchData({
        url: `${API_PREFIX}/save`,
        method: 'post',
        data: {
          id: isEmpty(id) ? undefined : id, // 空字符串或undefined表示新增
          name,
          pid: pid || '1',
          status: status || 'edit',
          layout: layoutStr,
          components: components || [],
        },
      })
      return res.id || id
    } catch (e) {
      console.error('保存看板失败:', e)
      return false
    }
  } else {
    // 使用本地存储
    try {
      const data = await ldb.getItem(LIST_KEY)
      if (data) {
        if (isEmpty(id)) {
          // 为空的时候新增
          const newId = uuid()
          data.push({
            id: newId,
            name,
            pid,
            status,
            layout,
            components,
          })
          await ldb.setItem(LIST_KEY, deepCopy(data))
          return newId
        } else {
          // 修改
          const index = findIndex(data, id)
          data[index] = { id, name, pid, status, layout, components }
          await ldb.setItem(LIST_KEY, deepCopy(data))
          return id
        }
      }
    } catch (e) {
      return false
    }
  }
}

/**
 * 载入看板详情
 */
export async function loadKanban(id) {
  if (USE_REMOTE_API) {
    // 使用远程接口
    try {
      const res = await fetchData({
        url: `${API_PREFIX}/detail`,
        method: 'post',
        data: { id },
      })
      return res || {}
    } catch (e) {
      console.error('获取看板详情失败:', e)
      return {}
    }
  } else {
    // 使用本地存储
    try {
      const data = await ldb.getItem(LIST_KEY)
      if (data) {
        const index = findIndex(data, id)
        return data[index] || {}
      }
      return {}
    } catch (e) {
      return {}
    }
  }
}

/**
 * 获取所有发布过的看板
 */
export function getPublishList(name) {
  return fetchData({
    url: '/analysis/kanban/publish/list',
    method: 'post',
    data: { name },
  })
}

/**
 * 查询模型数据
 */
export function getModelDataById({ modelId, x, y, filters }) {
  return fetchData({
    url: '/analysis/component/getdata',
    method: 'post',
    data: { modelId, x, y, filters },
  })
}

/**
 * 根据模型获取立方体数据
 */
export function getCubeById(id) {
  return fetchData({
    url: '/analysis/model/cubeById',
    method: 'post',
    data: { id },
  })
}
