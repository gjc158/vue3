## 图片组件

### 图片

![image](./images/GPicAdaption.gif)

### 如何使用

```js
import GPicAdaption from '@/components/GPicAdaption'

<g-pic-adaption :src="imgSrc" />
```

### Props

| name  | 描述 | 默认值      | 类型   |
| ----- | ---- | ----------- | ------ |
| src | 图片资源 | '' | String |
| type | 图片类型（cube：方形， circle：圆形） | 'cube' | String |
| backupSrc | 备用图片资源 | '' | String |
| errorSrc | 错误图片资源 | '' | String |

### Slot

| 名字 | 描述 |
| ---- | ---- |
| 暂无 | 暂无 |
