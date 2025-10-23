import { message } from 'ant-design-vue'

export const validAllowImg = (file, option) => {
  const opt = {
    allowType: 'jpeg|jpg|png',
    allowSize: 2,
    ...option,
  }
  const regx = new RegExp(`\\.(${opt.allowType})$`, 'i')
  if (!regx.test(file.name)) {
    message.error(`上传图片的格式只能是 ${opt.allowType} 中的一种！`)
    return false
  }

  if (file.size / 1024 / 1024 > opt.allowSize) {
    message.error(`上传图片的大小不能超过 ${opt.allowSize}MB！`)
    return false
  }

  return true
}
