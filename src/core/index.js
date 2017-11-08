import Viewer from './Viewer'
import WebGLPanorama from './WebGLPanorama'
import CSS3DPanorama from './CSS3DPanorama'
import detector from '../utils/detector'

const Panorama = detector.webgl ? WebGLPanorama : CSS3DPanorama

export { Viewer, Panorama }
