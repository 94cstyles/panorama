import Camera from './Camera'
import Renderer from './Renderer'
import DomEvents from './DomEvents'

class Viewer {
  constructor (options) {
    options = Object.assign({}, options)

    let container
    if (options.container) {
      container = options.container
    } else {
      container = document.createElement('div')
      container.setAttribute('style', 'position: relative;width: 100%;height: 100%;background-color: #000;')
      document.body.appendChild(container)
      options.container = container
    }

    this.options = options
    this.panorama = null
    this.container = container // 容器
    this.scene = new THREE.Scene() // 场景
    this.camera = new Camera(options) // 相机
    this.renderer = new Renderer() // 渲染器
    this.clock = new THREE.Clock() // 计时器
    this.container.appendChild(this.renderer.domElement)
    this.domEvents = new DomEvents(this.camera, container)

    this.animate = () => {
      this._ref = window.requestAnimationFrame(this.animate)

      if (this.panorama) {
        const delta = this.clock.getDelta()
        this.panorama.children.forEach((child) => {
          if (child.type === 'HotSpot') child.material.updateFrame(delta)
        })
      }

      this.camera.control.update()
      this.renderer.render(this.scene, this.camera)

      TWEEN.update()
    }
    this.animate()

    // 绑定resize事件
    THREE.WindowResize(this.renderer, this.camera, () => ({
      width: container.clientWidth,
      height: container.clientHeight
    })).trigger()
  }

  add (object) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i])
      }
      return this
    }

    if (object.type === 'Panorama') {
      object.build(this.scene, this.domEvents)
      // 设置默认全景图
      !this.panorama && this.setPanorama(object)
      // 绑定热点跳转
      object.addEventListener('jumpTo', ({ data }) => this.setPanorama(data))
    }
  }

  /**
   * 设置展示的全景图
   * @param panorama {Panorama}
   */
  setPanorama (panorama) {
    const leavingPanorama = this.panorama

    if (panorama.type === 'Panorama' && leavingPanorama !== panorama) {
      panorama.once('enter', () => {
        leavingPanorama && leavingPanorama.leave()
      })

      this.panorama = panorama
      this.panorama.enter()
    }
  }
}

export default Viewer
