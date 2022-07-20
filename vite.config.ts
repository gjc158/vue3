import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import'
import { viteMockServe } from "vite-plugin-mock"

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "comps": resolve(__dirname, "src/components"),
      "apis": resolve(__dirname, "src/apis"),
      "views": resolve(__dirname, "src/views"),
      "utils": resolve(__dirname, "src/utils"),
      "routes": resolve(__dirname, "src/routes"),
      "styles": resolve(__dirname, "src/styles"),
    },
  },
  css: {
    postcss: '', //内联的 PostCSS 配置（格式同 postcss.config.js），或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。
    preprocessorOptions: { // 指定传递给 CSS 预处理器的选项
      scss: {
        // 全局的scss ，跨域放多个，例如：主题的变量，和一些混合等
        // additionalData: `@import "src/styles/index.scss";`,
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    createStyleImportPlugin({
      resolves: [VantResolve()],
      libs: [
        {
          libraryName: "vant",
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`,
        },
      ],
    }),
    viteMockServe({
      mockPath: "mock", // ↓解析根目录下的mock文件夹
      supportTs: false,
    }),
  ],
  server: {
    host: "0.0.0.0", // 解决  Network: use --host to expose
    port: 4000, //启动端口 
    open: true,
    // proxy: {
    //   '^/api': {
    //     target: 'http://localhost:4000/',
    //     changeOrigin: true,
    //     ws: true,
    //     rewrite: (pathStr) => pathStr.replace(/^\/open /, '')
    //   },
    // },
    cors: true,
  },
})
