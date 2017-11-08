class DomEvents {
  constructor (camera, domElement) {
    this.camera = camera
    this.domElement = domElement
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.objects = []
    this.listeners = {}
    this._registerDomEvents()
  }

  /**
   * 注册事件
   * @private
   */
  _registerDomEvents () {
    this.domElement.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / this.domElement.clientWidth) * 2 - 1
      this.mouse.y = -(event.clientY / this.domElement.clientHeight) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObjects(this.objects)

      if (intersects.length > 0) {
        const object = intersects[0].object
        const { eventType, callback } = this.listeners[object.uuid]
        // 类型一致 自身和父节是可见的
        if (event.type === eventType && object.visible && (!object.parent || (object.parent && object.parent.visible))) {
          callback()
        }
      }
    }, false)
  }

  /**
   * 绑定事件
   * @param object3d {Object}
   * @param eventType {String} 事件类型
   * @param callback {Function} 回调函数
   */
  addEventListener (object3d, eventType, callback) {
    this.objects.push(object3d)
    this.listeners[object3d.uuid] = { eventType, callback }
  }
}

export default DomEvents
