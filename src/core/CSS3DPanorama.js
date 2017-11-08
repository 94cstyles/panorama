import Loader from './Loader'

const loader = new Loader()

class CSS3DPanorama extends THREE.EventDispatcher {
  constructor (src) {
    super()

    this.src = src
    this.type = 'Panorama'
    this.children = []
    this.objects = []
    this.texture = null // 全景图纹理
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
          // 生成css3d立方体
          const R = texture[0].width
          const dR = (R - 2) / 2
          const sides = [
            {
              position: [-dR, 0, 0],
              rotation: [0, Math.PI / 2, 0]
            },
            {
              position: [dR, 0, 0],
              rotation: [0, -Math.PI / 2, 0]
            },
            {
              position: [0, dR, 0],
              rotation: [Math.PI / 2, 0, 0]
            },
            {
              position: [0, -dR, 0],
              rotation: [-Math.PI / 2, 0, 0]
            },
            {
              position: [0, 0, dR],
              rotation: [0, Math.PI, 0]
            },
            {
              position: [0, 0, -dR],
              rotation: [0, 0, 0]
            }
          ]

          texture.forEach((el, index) => {
            const object = new THREE.CSS3DObject(el)
            object.position.fromArray(sides[index].position)
            object.rotation.fromArray(sides[index].rotation)
            this.objects.push(object)
          })

          resolve()
        })
      }
    })
  }

  /**
   * 构建全景图
   * @param scene
   * @param domEvents
   */
  build (scene, domEvents) {
    this.scene = scene
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
   * css3d模式下并不支持热点
   * @param panorama {Panorama}
   * @param position {Object|Vector3} 热点位置
   */
  link (panorama, position) {
  }

  /**
   * 展示全景图
   */
  enter () {
    this._loadTexture().then(() => {
      this.dispatchEvent({ type: 'enter' })
      this.objects.forEach((object) => {
        this.scene.add(object)
      })
      this.dispatchEvent({ type: 'enter-complete' })
    })
  }

  /**
   * 取消展示
   */
  leave () {
    this.dispatchEvent({ type: 'leave' })
    this.objects.forEach((object) => {
      this.scene.remove(object)
    })
    this.dispatchEvent({ type: 'leave-complete' })
  }
}

export default CSS3DPanorama
