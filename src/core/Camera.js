import detector from '../utils/detector'

/**
 * 远景相机
 */
class Camera extends THREE.PerspectiveCamera {
  constructor (options) {
    options = Object.assign({}, options)
    const { container } = options

    super(75, container.clientWidth / container.clientHeight, 1, 1000)

    this.position.z = 1
    this.options = options

    // Controls
    this.OrbitControls = new THREE.OrbitControls(this, container)
    this.OrbitControls.autoRotate = detector.webgl // css3d模式下不支持自动旋转
    this.OrbitControls.autoRotateSpeed = 1
    this.OrbitControls.rotateSpeed = 0.5
    this.OrbitControls.enablePan = true
    this.OrbitControls.enableKeys = false
    this.OrbitControls.enableZoom = false

    this.DeviceOrientationControls = new THREE.DeviceOrientationControls(this, container)
    this.DeviceOrientationControls.enabled = false

    // Controls
    this.controls = [this.OrbitControls, this.DeviceOrientationControls]
    this.control = this.OrbitControls
  }

  /**
   * 切换相机控制器
   */
  toggleControl () {
    if (this.control instanceof THREE.OrbitControls) {
      this.DeviceOrientationControls.enabled = true
      this.control = this.DeviceOrientationControls
    } else {
      this.DeviceOrientationControls.enabled = false
      this.control = this.OrbitControls
    }
  }
}

export default Camera
