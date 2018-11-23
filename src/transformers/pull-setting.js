export default (pullSetting) => { console.log('pullSetting', pullSetting); return({
  pullUrl: pullSetting.pullURL,
  allowedOrigins: pullSetting.allowedOrigins,
  headers: pullSetting.headers
})}
