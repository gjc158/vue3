## 缺省页

### 图片

![image](./images/GEmpty.png)

### 如何使用

```javascript
import GEmpty from '@/components/GEmpty'

<g-empty
  :description="description"
/>
```

### Props

| name  | 描述 | 默认值 | 类型   | 是否必需 |
| ------ | ------ | ------ | ------ | ------ |
| description | 文字说明 | '暂无数据' | String | false |

### Slot

| 名字 | 描述 |
| ---- | ---- |

### 模拟数据

```javascript
description: '暂无订单'
```