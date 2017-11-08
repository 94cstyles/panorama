import { Viewer, Panorama } from './core'
import getHotSpotPosition from './utils/getHotSpotPosition'

document.addEventListener('touchmove', (event) => (event.preventDefault()))

const scenes = [{
  cameraPosition: { x: 4898.245, y: 6656.490, z: 120.519 },
  panorama: '/images/Fg2wUM4lZMa8GPd5puJ-LboCR98N.jpg'
}, {
  cameraPosition: { x: 4593.401, y: 6389.813, z: 177.150 },
  panorama: '/images/Fg2ZAah92H9m49cZ-Kf15pTbq5Y7.jpg'
}, {
  cameraPosition: { x: 4764.013, y: 6614.676, z: 100.519 },
  panorama: '/images/FipQp3-x-a92Ty9P3kZ8KXdtO-Q0.jpg'
}]

const viewer = new Viewer()

// 创建全景图 并添加进 视图
scenes.forEach((scene, index) => {
  scene.panorama = new Panorama(scene.panorama)
  scene.panorama.name = index
  viewer.add(scene.panorama)
})

// 为全景图添加热点
scenes.forEach((currentScene) => {
  scenes.forEach((relativeScene) => {
    if (currentScene !== relativeScene) {
      currentScene.panorama.link(relativeScene.panorama, getHotSpotPosition(currentScene.cameraPosition, relativeScene.cameraPosition))
    }
  })
})
