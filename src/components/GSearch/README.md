## 搜索框

### 图片

![image](./images/GSearch.png)

### 如何使用

```javascript
import GSearch from '@/components/GSearch'

<g-search
  v-model="keyword"
  placeholder="请输入搜索关键字"
  @search="searchDoctor"
/>
```

### Props

| name  | 描述 | 默认值 | 类型   | 是否必需 |
| ------ | ------ | ------ | ------ | ------ |
| v-model | 传入值 | '' | String | false |
| placeholder | placeholder | '请输入关键字' | String | false |
| hasMarginBottom | 是否有底部20px间距 | true | Boolean | false |

### Slot

| 名字 | 描述 |
| ---- | ---- |

### Action

| 名字 | 描述 |
| search | 搜索事件 |

### 模拟数据

```javascript
keyword: 'a'
placeholder: '暂无订单'
```