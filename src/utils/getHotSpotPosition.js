/**
 * 计算相机间的相对位置 得到热点坐标
 * @param currentCamera {Object}
 * @param relativeCamera {Object}
 * @returns {THREE.Vector3}
 */
export default function (currentCamera, relativeCamera) {
  // 计算相机见的相对位置
  const absX = Math.abs(relativeCamera.x - currentCamera.x)
  const absY = Math.abs(relativeCamera.y - currentCamera.y)
  const absZ = Math.abs(relativeCamera.z - currentCamera.z)

  const x = absX * (currentCamera.x > relativeCamera.x ? 1 : -1)
  const y = absY * (currentCamera.y > relativeCamera.y ? 1 : -1)
  const z = absZ * (currentCamera.z > relativeCamera.z ? -1 : 1)

  return new THREE.Vector3(x, z, y)
}
