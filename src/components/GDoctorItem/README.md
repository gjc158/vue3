## 医生列表

### 图片

![image](./images/GDoctorItem.png)

### 如何使用

```javascript
import GDoctorItem from '@/components/GDoctorItem'

<g-doctor-item
  :name="item.name"
  :gender="item.gender"
  :level="item.level"
  :avatar="item.avatar"
  :desc="item.desc"
  :url="item.url"
  :price="item.price"
/>
```

### Props

| name  | 描述 | 默认值 | 类型   | 是否必需 | 备注 |
| ------ | ------ | ------ | ------ | ------ | ------ |
| name | 姓名 | '' | String | false | 无 |
| gender | 性别 | '男' | String/Number | false | 男性：男，1，'1' 女性：女，2，'2'|
| avatar | 头像地址 | '' | String | false | 为链接地址，会根据性别展示默认头像 |
| level | 医生职称 | '' | String | false | 例如：主任医师 |
| price | 价格 | '' | String | false | 无 |
| desc | 简介内容 | '' | String | false | 无 |
| url | 跳转路由 | '' | String | false | 无 |
| avatarShape | 头像形状 | 'round' | String | false | round：圆形，cube：方形 |
| isShowIcon | 是否显示右侧icon | true | Boolean | false | 无 |

### Slot

| 名字 | 描述 |
| ---- | ---- |
| content | 内容 |
| level | 医生职称后自定义增加内容 |
| svg | 简介内容后自定义增加内容 |

### 模拟数据

```javascript
info = {
  name: '宋元林',
  avatar: '',
  level: '主任医师',
  gender: '1', // 1 为男性，2 为女性
  desc: '擅长小儿咳嗽、哮喘、慢性咳嗽、老年慢擅长小儿咳嗽、哮喘、慢性咳嗽、老年慢擅长小儿咳嗽、哮喘、慢性咳嗽、老年慢',
  url: '',
  price: '40',
}
```