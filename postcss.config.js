module.exports = {
  "plugins": {
    "autoprefixer": {
      // overrideBrowserslist: ["Android 4.1", "iOS 7.1"], //浏览器的兼容配置
      // grid: true, // true 为 IE 启用网格布局前缀
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
      ],
    },
    "postcss-pxtorem": {
      // rootValue: 75, // 数字|函数）表示根元素字体大小或根据input参数返回根元素字体大小
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75;
      },
      propList: ['*'], // 使用通配符*启用所有属性
      mediaQuery: true, // 允许在媒体查询中转换px
      selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
    }
  }
}