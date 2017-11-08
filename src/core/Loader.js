import detector from '../utils/detector'

class PanoramaTextureLoader {
  constructor () {
    this.cache = {}
  }

  /**
   * 加载素材
   * @param url {String} 资源链接，必须
   * @param onLoad {Function} 加载完成回调。参数将是已加载的 texture.
   * @param onError {Function} 加载完成回调。
   */
  load (url, onLoad, onError) {
    if (this.cache[url]) {
      onLoad && onLoad(this.cache[url])
    } else {
      const img = new Image()
      img.src = url
      img.crossOrigin = 'Anonymous'
      img.addEventListener('load', () => {
        const texture = this._getCubeMapTextures(img)
        this.cache[url] = texture
        onLoad && onLoad(texture)
      })
      img.addEventListener('error', () => onError && onError())
    }
  }

  /**
   * 鱼眼图转换为立方体纹理
   * https://github.com/akokubo/ThetaViewer/blob/master/src/theta-viewer.js#L322
   * http://fmskatsuhiko.web.fc2.com/spherecube.html
   * @param img {Image}
   * @returns {Array<canvas>} texture
   * @private
   */
  _getCubeMapTextures (img) {
    // 图片渲染的尺寸
    const width = img.width
    const height = Math.floor(width / 2)
    const dy = -Math.floor((height - img.height) / 2)
    // 创建一个canvas 获取原图imagedata
    const srcCanvas = document.createElement('canvas')
    srcCanvas.setAttribute('width', width)
    srcCanvas.setAttribute('height', height)
    const srcContext = srcCanvas.getContext('2d')
    srcContext.drawImage(img, 0, 0, width, height)
    const src = srcContext.getImageData(0, dy, width, height)
    // 通过一系列计算把鱼眼图拆分为6块
    const R = Math.floor(width / 8)
    const dest = []
    const canvas = []
    const context = []
    let i, y, x, phi, theta, u, v, dloc, sloc
    for (i = 0; i < 6; i++) {
      canvas[i] = document.createElement('canvas')
      canvas[i].setAttribute('width', 2 * R)
      canvas[i].setAttribute('height', 2 * R)
      context[i] = canvas[i].getContext('2d')
    }
    for (i = 0; i < 6; i++) {
      dest[i] = context[i].createImageData(2 * R, 2 * R)
    }
    for (y = 0; y < R; y += 1) {
      for (x = 0; x < R; x += 1) {
        phi = Math.atan(x / R)
        theta = Math.atan(Math.sqrt(x * x + R * R) / (R - y))
        u = Math.floor(width * phi / Math.PI / 2)
        v = Math.floor(height * theta / Math.PI)
        dloc = (R + x) + y * 2 * R
        sloc = u + v * 8 * R
        dest[2].data[4 * dloc] = src.data[4 * sloc]
        dest[2].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[2].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[2].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (2 * R - y - 1) * 2 * R
        sloc = u + (4 * R - v - 1) * 8 * R
        dest[2].data[4 * dloc] = src.data[4 * sloc]
        dest[2].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[2].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[2].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + y * 2 * R
        sloc = (2 * R - u - 1) + v * 8 * R
        dest[3].data[4 * dloc] = src.data[4 * sloc]
        dest[3].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[3].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[3].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (2 * R - y - 1) * 2 * R
        sloc = (2 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[3].data[4 * dloc] = src.data[4 * sloc]
        dest[3].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[3].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[3].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + y * 2 * R
        sloc = (2 * R + u) + v * 8 * R
        dest[3].data[4 * dloc] = src.data[4 * sloc]
        dest[3].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[3].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[3].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (2 * R - y - 1) * 2 * R
        sloc = (2 * R + u) + (4 * R - v - 1) * 8 * R
        dest[3].data[4 * dloc] = src.data[4 * sloc]
        dest[3].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[3].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[3].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + y * 2 * R
        sloc = (4 * R - u - 1) + v * 8 * R
        dest[0].data[4 * dloc] = src.data[4 * sloc]
        dest[0].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[0].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[0].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (2 * R - y - 1) * 2 * R
        sloc = (4 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[0].data[4 * dloc] = src.data[4 * sloc]
        dest[0].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[0].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[0].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + y * 2 * R
        sloc = (4 * R + u) + v * 8 * R
        dest[0].data[4 * dloc] = src.data[4 * sloc]
        dest[0].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[0].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[0].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (2 * R - y - 1) * 2 * R
        sloc = (4 * R + u) + (4 * R - v - 1) * 8 * R
        dest[0].data[4 * dloc] = src.data[4 * sloc]
        dest[0].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[0].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[0].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + y * 2 * R
        sloc = (6 * R - u - 1) + v * 8 * R
        dest[1].data[4 * dloc] = src.data[4 * sloc]
        dest[1].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[1].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[1].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (2 * R - y - 1) * 2 * R
        sloc = (6 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[1].data[4 * dloc] = src.data[4 * sloc]
        dest[1].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[1].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[1].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + y * 2 * R
        sloc = (6 * R + u) + v * 8 * R
        dest[1].data[4 * dloc] = src.data[4 * sloc]
        dest[1].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[1].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[1].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (2 * R - y - 1) * 2 * R
        sloc = (6 * R + u) + (4 * R - v - 1) * 8 * R
        dest[1].data[4 * dloc] = src.data[4 * sloc]
        dest[1].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[1].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[1].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + y * 2 * R
        sloc = (8 * R - u - 1) + v * 8 * R
        dest[2].data[4 * dloc] = src.data[4 * sloc]
        dest[2].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[2].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[2].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (2 * R - y - 1) * 2 * R
        sloc = (8 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[2].data[4 * dloc] = src.data[4 * sloc]
        dest[2].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[2].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[2].data[4 * dloc + 3] = src.data[4 * sloc + 3]
      }
    }
    for (y = 0; y < R; y += 1) {
      for (x = 0; x <= y; x += 1) {
        phi = Math.atan(x / y)
        theta = Math.atan(Math.sqrt(x * x + y * y) / R)
        u = Math.floor(width * phi / Math.PI / 2)
        v = Math.floor(height * theta / Math.PI)
        dloc = (R - y - 1) + (R + x) * 2 * R
        sloc = u + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - y - 1) + (R - x - 1) * 2 * R
        sloc = u + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (R + y) * 2 * R
        sloc = (2 * R - u - 1) + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (R - y - 1) * 2 * R
        sloc = (2 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (R + y) * 2 * R
        sloc = (2 * R + u) + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (R - y - 1) * 2 * R
        sloc = (2 * R + u) + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + y) + (R + x) * 2 * R
        sloc = (4 * R - u - 1) + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + y) + (R - x - 1) * 2 * R
        sloc = (4 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + y) + (R - x - 1) * 2 * R
        sloc = (4 * R + u) + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + y) + (R + x) * 2 * R
        sloc = (4 * R + u) + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (R - y - 1) * 2 * R
        sloc = (6 * R - u - 1) + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R + x) + (R + y) * 2 * R
        sloc = (6 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (R - y - 1) * 2 * R
        sloc = (6 * R + u) + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - x - 1) + (R + y) * 2 * R
        sloc = (6 * R + u) + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - y - 1) + (R - x - 1) * 2 * R
        sloc = (8 * R - u - 1) + v * 8 * R
        dest[4].data[4 * dloc] = src.data[4 * sloc]
        dest[4].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[4].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[4].data[4 * dloc + 3] = src.data[4 * sloc + 3]
        dloc = (R - y - 1) + (R + x) * 2 * R
        sloc = (8 * R - u - 1) + (4 * R - v - 1) * 8 * R
        dest[5].data[4 * dloc] = src.data[4 * sloc]
        dest[5].data[4 * dloc + 1] = src.data[4 * sloc + 1]
        dest[5].data[4 * dloc + 2] = src.data[4 * sloc + 2]
        dest[5].data[4 * dloc + 3] = src.data[4 * sloc + 3]
      }
    }
    for (i = 0; i < 6; i++) {
      context[i].putImageData(dest[i], 0, 0)
    }
    return [
      canvas[2], // posx
      canvas[0], // negx
      canvas[4], // posy
      canvas[5], // negy
      canvas[1], // posz
      canvas[3]  // negz
    ]
  }
}

export default (detector.webgl ? THREE.TextureLoader : PanoramaTextureLoader)
