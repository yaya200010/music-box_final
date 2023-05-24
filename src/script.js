/**
 * อันข้างบนคือโหลดพวกlibary code
 * lil gui คือช่วยในการคอนโหลด object หรือ costom /position/rptation/scale/quaternion/color
 * THREE คือตัวช่วยเขียนการเขียนโปรแกรมเพื่อสร้างภาพ 3 มิติ ทั้งในรูปแบบ Desktop Application และ Web Application
 * Orbit คือช่วย control object แบบทำให้ขยับหมุนได้ ps.การทำให้ object ขยับมีหลายแบบในการเขียน  
 * Gltf&Draco loader เป็น lobrary ในการนำเข้าตัวไฟล์โมเดลของเราที่มีนามสกุล Glb/gltf
 */

import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug 
const debugObject ={}
const gui = new dat.GUI({
    width: 400 
})


// Canvas กำหนดcanvas เป็น webgl
const canvas = document.querySelector('canvas.webgl')

// Scene ประกาศ scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Textures textures โมเดล ที่exportมาเป็นภาพ
 */
const bakedTexture = textureLoader.load('baked5.jpg')
// การflip textureตอนแรกมันจะลงแกนอยู่ต้องกำหนดให้ใหม่
bakedTexture.flipY = false
// ทำให้แสงของวัตถุเหมือนกับใน blender
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * material ดึงจาก ตัวconst textures
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * model
 *  */
// นำเข้าโมเดลจาก เบลนเดอร์ ปล.มีขนาดเล็กหว่าเดิมเนื่องจากแยกเรนตัวtextures ทำให้อ่านโมเดลง่ายขึ้น เล็กลงมาก
gltfLoader.load(
    'MUSIC1.glb',
    (gltf) =>
        {
            gltf.scene.traverse((child) =>
            {
                child.material = bakedMaterial
            })
            scene.add(gltf.scene)
        }
    )


/**
 * Sizes กำหนดขนาดจอแสดงผล
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera กำหนดมุมกล้องเริ่มแรก สามารถเปลี่ยนได้
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 3
camera.position.z = 0
scene.add(camera)

// Controls ประกาศใช้orbitcontroleในการขยับโมเดล
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer เรนเดอร์ webgl
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// เรนเดอร์สีให้สวยขึ้น มาจาก ตัว materialข้างบน
renderer.outputEncoding = THREE.sRGBEncoding

 // Clear color เปลี่ยนสีพื้นหลัง webgl
 debugObject.clearColor = '#8080c0'
 renderer.setClearColor(debugObject.clearColor)
 gui
    .addColor(debugObject, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(debugObject.clearColor)
    })

/**
 * Animate ทำให้object สามารถขยับได้
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()