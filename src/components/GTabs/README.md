## Tab 页签切换

### 图片

![image](./images/GTabs.png)

### 如何使用

```js
import GTabs from '@/components/GTabs'

<g-tabs
  :current="currentTab"
  :data="tabData"
  @tabChange="tabChange"
>
  <template slot="frequency">
    frequency
  </template>
  <template slot="doctor">
    doctor
  </template>
</g-tabs>
```

### Props

| name  | 描述 | 默认值      | 类型   | 是否必需 |
| ----- | ---- | ----------- | ------ | ------ |
| current | 当前 Tab 页签 ID | '' | String | true |
| data | Tab 页签数据数组 | [] | Array | true |

### Slot

| 名字 | 描述 |
| ---- | ---- |
| data 的 ID | 内容 |

### Action

| 名字 | 描述 |
| ---- | ---- |
| tabChange | 切换时触发，返回当前 tab ID |

### Mock Data

```js
currentTab: 'frequency',
tabData: [
  {
    id: 'frequency',
    name: '按班次'
  },
  {
    id: 'doctor',
    name: '按医生'
  }
]
```
