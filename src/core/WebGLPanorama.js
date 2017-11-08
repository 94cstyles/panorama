import HotSpot from './WebGLHotSpot'
import Loader from './Loader'

const loader = new Loader()

class WebGLPanorama extends THREE.Mesh {
  constructor (src) {
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    const material = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
    material.side = THREE.DoubleSide
    geometry.scale(-1, 1, 1) // 将x轴上的几何图形倒过来，使所有的面都指向内
    geometry.rotateY(Math.PI / 2) // 按着Y轴旋转90° 使原点正前方对着 图形中心点

    super(geometry, material)

    this.type = 'Panorama'
    this.src = src
    this.texture = null // 全景图纹理
    this.visible = false // 全景图是否展示
    this.transition = new TWEEN.Tween(material).easing(TWEEN.Easing.Quartic.Out) // 过渡
  }

  /**
   * 加载纹理
   * @returns {Promise}
   * @private
   */
  _loadTexture () {
    return new Promise((resolve) => {
      if (this.texture) {
        resolve()
      } else {
        loader.load(this.src, (texture) => {
          texture.minFilter = texture.magFilter = THREE.LinearFilter
          this.material.map = texture // 添加纹理
          this.texture = texture
          resolve()
        })
      }
    })
  }

  /**
   * 构建全景图
   * @param scene {Scene}
   * @param domEvents {DomEvents}
   */
  build (scene, domEvents) {
    scene.add(this)
    this.domEvents = domEvents
  }

  once (event, callback) {
    function _ () {
      callback()
      this.removeEventListener(event, _)
    }

    this.addEventListener(event, _)
  }

  /**
   * 链接上其他全景图 并创建热点
   * @param panorama {Panorama}
   * @param position {Object|Vector3} 热点位置
   */
  link (panorama, position) {
    const spot = new HotSpot(position)
    spot.to = panorama
    spot.visible = false
    this.domEvents.addEventListener(spot, 'click', () => (this.dispatchEvent({
      type: 'jumpTo',
      data: panorama
    })), false)
    THREE.Object3D.prototype.add.call(this, spot)
  }

  /**
   * 展示全景图
   */
  enter () {
    this._loadTexture().then(() => {
      this.transition
        .stop()
        .to({ opacity: 1 }, 1000)
        .onStart(() => {
          this.visible = true
          this.children.forEach((child) => {
            if (child.type === 'HotSpot') child.visible = true
          })
          this.dispatchEvent({ type: 'enter' })
        })
        .onComplete(() => {
          this.dispatchEvent({ type: 'enter-complete' })
        })
        .start()
    })
  }

  /**
   * 取消展示
   */
  leave () {
    this.transition
      .stop()
      .to({ opacity: 0 }, 1000)
      .onStart(() => {
        this.children.forEach((child) => {
          if (child.type === 'HotSpot') child.visible = false
        })
        this.dispatchEvent({ type: 'leave' })
      })
      .onComplete(() => {
        this.visible = false
        this.dispatchEvent({ type: 'leave-complete' })
      })
      .start()
  }
}

export default WebGLPanorama
