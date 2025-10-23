<template>
  <div class="kanban-wrapper">
    <div class="kanban-main">
      <div class="folder-manage">
        <div class="folder-manage-group">
          <span>大屏分组</span>
          <AntIcon name="PlusOutlined" class="btn-add-icon"
            title="新增文件夹"
            @click="adding = true"
          ></AntIcon>
        </div>
        <div class="folder-manage-main">
          <div
            class="folder-item folder-all"
            :class="{ 'folder-item-checked-color': selectedPid === '1' }"
            @click="toggleProject({ id: '1', name: '缺省目录' })"
          >
            <span>缺省目录</span>
          </div>
          <div v-if="adding" class="folder-item new-group">
            <input v-focus class="edit-input" @blur="onAddInputBlur" @keyup.enter="addGroup" />
          </div>
          <div
            v-for="item in folderList"
            :key="item.id"
            class="folder-item"
            :class="{ 'folder-item-checked-color': selectedPid === item.id }"
            @click="toggleProject(item)"
          >
            <template v-if="item.editing">
              <input
                v-focus
                :default-value="item.name"
                class="edit-input"
                @blur="onEditInputBlur($event, item)"
                @keyup.enter="editGroup($event, item)"
              />
            </template>
            <template v-else>
              <span class="folder-name">{{ item.name }}</span>
              <span class="group-btns">
                <AntIcon name="EditOutlined" title="编辑" @click="item.editing = true"></AntIcon>
                <AntIcon name="DeleteOutlined"
                  title="删除"
                  @click="confirmDeleteGroup(item)"
                ></AntIcon>
              </span>
            </template>
          </div>
        </div>
      </div>
      <div class="right-list">
        <kanban-list :group="{ pid: selectedPid, name: selectedName }"></kanban-list>
      </div>
    </div>
  </div>
</template>

<script>
import useFolder from './useFolder'
import KanbanList from './kanban-list.vue'

export default {
  name: 'AnalysisDashboard',
  components: { KanbanList },
  setup() {
    return {
      ...useFolder(),
    }
  },
}
</script>

<style scoped>
.kanban-wrapper {
  position: relative;
  user-select: none;
  .kanban-main {
    display: flex;
    flex: 1;
    .right-list {
      padding-left: 20px;
      padding-right: 20px;
      width: 100%;
      color: #fff;
    }
  }
}
.folder-manage {
  min-width: 240px;
  max-width: 240px;
  color: #fff;
  font-size: var(--datav-font-size-base);
  overflow-y: auto;
  height: calc(100vh - 150px);
  .folder-manage-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 36px;
    padding-right: var(--datav-border-radius-lg);
    padding-left: 24px;
    height: 56px;
    border-bottom: 1px solid #27343e;
    .btn-add-icon {
      font-size: var(--datav-font-size-lg);
      cursor: pointer;
      &:hover {
        color: var(--datav-primary-color);
      }
    }
  }
  .folder-manage-main {
    padding: 5px;
  }
  .folder-item {
    position: relative;
    height: 36px;
    padding: 0 var(--datav-font-size-lg) 0 50px;
    display: flex;
    font-size: var(--datav-font-size-base);
    border-radius: 5px;
    margin-bottom: 5px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: color 0.2s;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    &:hover {
      color: var(--datav-primary-color);
      background: var(--s-color-1);
      .group-btns {
        display: inline-block;
      }
    }

    &.folder-item-checked-color {
      background: var(--s-color-1);
      color: var(--datav-primary-color);
      &:hover {
        color: var(--datav-primary-color) !important;
      }
    }
    &.folder-all {
      padding-left: 50px;
      transition: color 0.2s;
      cursor: pointer;
    }
    .folder-name {
      width: 100px;
      font-size: var(--datav-font-size-base);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      pointer-events: none;
    }
    .group-btns {
      display: none;
      color: var(--datav-primary-color);
      > .anticon {
        font-size: var(--datav-font-size-lg);
      }
      .anticon + .anticon {
        margin-left: var(--datav-border-radius-base);
      }
    }
  }

  .edit-input {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #1d262e;
    color: #fff;
    padding: 0 10px;
    line-height: 30px;
    width: 100%;
    height: 30px;
    border: 1px solid var(--datav-primary-color);
    transition: 0.2s;
    box-shadow: 0 0 10px -var(--datav-border-radius-base) #000;
    outline: none;
  }
}
</style>
