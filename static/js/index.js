/*
 * @Description:
 * @Version: 0.0.1
 * @Company: hNdt
 * @Author: xiaWang1024
 * @Date: 2020-02-21 14:58:50
 * @LastEditTime: 2020-02-21 15:00:56
 */
let spanDom = document.querySelector('span')
spanDom.innerHTML = new Date()
setInterval(() => {
    let nowTime = new Date()
    spanDom.innerHTML = nowTime
}, 1000)