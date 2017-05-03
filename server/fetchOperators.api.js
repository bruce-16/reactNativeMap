//网络请求工具文件。
import serverConfig from './server.config';
/**
 *
 * @param router 路径
 * @param method 请求方法
 * @param data 请求body
 * @returns {Promise.<*>}
 */
export default async (router, method, data) => {
  if(!router){
    console.warn('路径不能为空！');
    return;
  }
  if(!method){
    console.warn('请求方法不能为空！');
    return;
  }
  try {
    let responed = await fetch(serverConfig.gateway+router, {
      method,
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(data)
    });
    let json = await responed.json();
    return json;
  } catch (error) {
    console.warn(error);
  }
};