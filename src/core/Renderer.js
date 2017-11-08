import detector from '../utils/detector'

/**
 * 渲染器 优先采用webgl 降级使用css3d
 */
class Renderer extends (detector.webgl ? THREE.WebGLRenderer : THREE.CSS3DRenderer) {
  constructor () {
    super({ alpha: true, antialias: false })

    if (detector.webgl) {
      this.setClearColor(0x000000, 1)
      this.setPixelRatio(1)
      this.sortObjects = false
    } else {
      this.domElement.style.position = 'relative'
    }
  }
}

export default Renderer
