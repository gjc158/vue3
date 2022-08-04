export const errorCodeType = function(code:number):string{
    let msg:string = ""
    switch (code) {
        case 400:
          console.log("客户端请求的语法错误，服务器无法理解");
          break;
        case 401:
          console.log("身份验证出错");
          break;
        case 403:
          console.log("服务器理解请求客户端的请求，但是拒绝执行此请求");
          break;
        case 404:
          console.log("请求地址不存在");
          break;
        case 405:
          console.log("请求方式被禁止");
          break;
        case 408:
          console.log("请求超时");
          break;
        case 500:
          console.log("服务器内部错误，无法完成请求");
          break;
        case 501:
          console.log(" 服务器不支持请求的功能，无法完成请求");
          break;
        case 502:
          console.log(
            "作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应"
          );
          break;
        case 503:
          console.log(
            "由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中"
          );
          break;
        case 504:
          console.log("充当网关或代理的服务器，未及时从远端服务器获取请求");
          break;
        case 505:
          console.log("服务器不支持请求的HTTP协议的版本");
          break;
        default:
          console.log(`请求出错`);
    }
    return msg
}