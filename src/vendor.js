import TWEEN from 'tween.js'
import * as THREE from 'three'
import 'three/examples/js/renderers/CSS3DRenderer'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/controls/DeviceOrientationControls'

// NodeLibrary
import 'three/examples/js/nodes/GLNode.js'
import 'three/examples/js/nodes/TempNode.js'
import 'three/examples/js/nodes/InputNode.js'
import 'three/examples/js/nodes/NodeBuilder.js'
import 'three/examples/js/nodes/NodeMaterial.js'

// Accessors
import 'three/examples/js/nodes/accessors/UVNode.js'

// Inputs
import 'three/examples/js/nodes/inputs/FloatNode.js'
import 'three/examples/js/nodes/inputs/ColorNode.js'
import 'three/examples/js/nodes/inputs/Vector2Node.js'
import 'three/examples/js/nodes/inputs/TextureNode.js'

// Math
import 'three/examples/js/nodes/math/Math1Node.js'
import 'three/examples/js/nodes/math/OperatorNode.js'

// Utils
import 'three/examples/js/nodes/utils/TimerNode.js'

// Sprite Material
import 'three/examples/js/nodes/materials/SpriteNode.js'
import 'three/examples/js/nodes/materials/SpriteNodeMaterial.js'

/**
 * Update renderer and camera when the window is resize
 * @param renderer {Object} the renderer to update
 * @param camera {Object} the camera to update
 * @param dimension {Function} callback for renderer size
 * @returns {{trigger: trigger, destroy: destroy}}
 * @constructor
 */
THREE.WindowResize = function (renderer, camera, dimension) {
  dimension = dimension || function () { return {width: window.innerWidth, height: window.innerHeight} }
  const trigger = function () {
    const {width, height} = dimension()
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', trigger, false)
  return {
    trigger,
    destroy () {
      window.removeEventListener('resize', trigger)
    }
  }
}

window.TWEEN = TWEEN
window.THREE = THREE
