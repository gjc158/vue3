
import { MockMethod } from 'vite-plugin-mock'
// 仅做示例: 通过GET\post请求返回一个数据
const mockMethod1 = {
  url: "/api/getUsers",
  method: "get",
  response: () => {
    console.log('/api/getUsers----------')
    return {
      respCode: 0,
      respMsg: "ok",
      data: ["tom", "jerry"],
    };
  }
}

const mockMethod2 = {
  url: "/api/getArticleList",
  method: "post",
  response: () => {
    console.log('/api/getUsers----------')
    return {
      respCode: 0,
      respMsg: "ok",
      data: ["111", "222"],
    };
  }
}

export default [ mockMethod1, mockMethod2 ] as MockMethod[];


