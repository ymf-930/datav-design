import { VAceEditor } from 'vue3-ace-editor'
// 导入 Ace Editor 的模式
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-typescript'
// snippets 会在需要时自动加载，通过 ext-language_tools 启用
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-emmet'
// 导入主题（确保主题文件被正确加载）
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-sqlserver'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

import HljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/xcode.min.css'
import 'highlight.js/lib/common'
import 'highlight.js/styles/atom-one-dark.css'

export function registerEditor(app) {
  app.component('VAceEditor', VAceEditor)
  app.use(HljsVuePlugin)
}
