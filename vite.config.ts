import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import'
import { viteMockServe } from "vite-plugin-mock"
import AutoImport from 'unplugin-auto-import/vite' // 自动引入ref、reactive等组件

// https://vitejs.dev/config/
export default ({command, mode }) => {
  const envConfig = loadEnv(mode, './');
  console.info(envConfig)
  const proxyReq = (proxyReq) => {
    const { sockets } = proxyReq.agent
    const keys = Object.keys(sockets)
    console.log(`当前请求代理到：${keys[0]}, ${sockets[keys[0]][0]._httpMessage.path}`)
  }
  return defineConfig({
    base: './',
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "comps": resolve(__dirname, "src/components"),
        "apis": resolve(__dirname, "src/apis"),
        "views": resolve(__dirname, "src/views"),
        "utils": resolve(__dirname, "src/utils"),
        "routes": resolve(__dirname, "src/routes"),
        "styles": resolve(__dirname, "src/assets/styles"),
      },
    },
    css: {
      postcss: '', //内联的 PostCSS 配置（格式同 postcss.config.js），或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。
      preprocessorOptions: { // 指定传递给 CSS 预处理器的选项
        scss: {
          // 全局的scss ，跨域放多个，例如：主题的变量，和一些混合等
          additionalData: `@import "styles/variables.scss";`,
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      vue({
          reactivityTransform: true
      }),
      AutoImport({
        imports: [
          'vue'
        ],
        dts: 'src/auto-import.d.ts',
      }),
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
        localEnabled: false,
        prodEnabled: false
      }),
    ],
    server: {
      cors: true,
      host: '0.0.0.0',
      port: 4000,
      strictPort: true, // 端口被占用直接退出
      https: false,
      open: false,// 在开发服务器启动时自动在浏览器中打开应用程序
      // proxy: {
      //   // 字符串简写写法
      //   // '/foo': '',
      //   // 选项写法
      //   '/dev-api': {
      //     target: mode==='development'?loadEnv(mode, process.cwd()).VITE_APP_DEV_URL:loadEnv(mode, process.cwd()).VITE_APP_PROD_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/dev-api/, '')
      //   },
      // },
      proxy: {
        '/api/wisdom-portal-apply': {
          target: envConfig.VITE_APP_API_SERVER,
          changeOrigin: true,
          // rewrite: {
          //   rewrite: (path) => path.replace(/^\/api\/wisdom-portal-apply/, '/api/wisdom-portal-apply')'': '/api/wisdom-portal-apply'
          // },
        },
        '/api/ep': {
          target: envConfig.VITE_APP_API_SERVER,
          changeOrigin: true,
          // rewrite: {
          //   rewrite: (path) => path.replace(/^\/api\/wisdom-portal-apply/, '/api/wisdom-portal-apply')'': '/api/wisdom-portal-apply'
          // },
        },
      },
      hmr: {
        overlay: false // 屏蔽服务器报错
      }
    },
  })
}