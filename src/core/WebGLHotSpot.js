import detector from '../utils/detector'

// 精灵图纹理
const texture = new THREE.TextureLoader().load('/images/hotspot.png', () => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.premultiplyAlpha = true
})
// 原点位置 即 摄像机位置
const originPosition = new THREE.Vector3(0, 0, 1)
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)

class HotSpot extends THREE.Mesh {
  constructor (position) {
    super(geometry, new THREE.SpriteNodeMaterial())

    // 根据热点与原点的距离进行缩放 保证视觉上热点的大小近乎一样
    const size = (detector.touch ? 120 : 80) * originPosition.distanceTo(position) / 1000
    this.type = 'HotSpot'
    this.position.copy(position)
    this.scale.set(size, size, 1)
    this.material.color = new THREE.TextureNode(texture)
    this.material.color.coord = this._createHorizontalSpriteSheetNode(20, 30)
    // 精灵图不透明解决方案: https://jsfiddle.net/herve3d/zhxuvgwr/7/
    this.material.blending = THREE.CustomBlending
    this.material.blendSrc = THREE.OneFactor
    this.material.blendDst = THREE.OneFactor
    this.material.blendEquation = THREE.AddEquation
    this.material.build()
  }

  /**
   * 创建一个水平的精灵图动画
   * @param frame {Number} 精灵图总帧数
   * @param speed {Number} 帧数/s
   * @returns {THREE.OperatorNode}
   */
  _createHorizontalSpriteSheetNode (frame, speed) {
    speed = new THREE.Vector2Node(speed, 0)
    const scale = new THREE.Vector2Node(1 / frame, 1)

    const uvTimer = new THREE.OperatorNode(
      new THREE.TimerNode(),
      speed,
      THREE.OperatorNode.MUL
    )

    const uvIntegerTimer = new THREE.Math1Node(
      uvTimer,
      THREE.Math1Node.FLOOR
    )

    const uvFrameOffset = new THREE.OperatorNode(
      uvIntegerTimer,
      scale,
      THREE.OperatorNode.MUL
    )

    const uvScale = new THREE.OperatorNode(
      new THREE.UVNode(),
      scale,
      THREE.OperatorNode.MUL
    )

    return new THREE.OperatorNode(
      uvScale,
      uvFrameOffset,
      THREE.OperatorNode.ADD
    )
  }
}

export default HotSpot
