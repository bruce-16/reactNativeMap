import serverConfig from './server.config';

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