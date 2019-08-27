var imgRoot = 'pack/images/'

$(function() {
  loadAssets()
})

function loadAssets() {
  var assets = ['weibocard.jpg']

  var preload = new createjs.LoadQueue()
  preload.on('progress', handleProgress)
  preload.on('complete', handleComplete)
  preload.setMaxConnections(3)

  var $loadPage = $('.load-wrap')
  var $loadnum = $('.load-wrap .num')

  function handleProgress(e) {
    var num = parseInt(preload.progress * 100)
    $loadnum.html('' + num + '%')
  }

  function handleComplete(e) {
    $loadPage.addClass('hide').remove()
  }
  preload.loadManifest(assets, true, imgRoot)
}

;(function() {
  var width = window.innerWidth
  var height = window.innerHeight

  var element
  var scene, camera, renderer, controls

  function init() {
    scene = new THREE.Scene()

    window.addEventListener('resize', handleResize, false)

    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000)
    camera.position.set(0, 0, 0)
    scene.add(camera)

    var geometry = new THREE.SphereGeometry(5, 60, 40)
    geometry.scale(-1, 1, 1)

    var material = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('../common/images/weibocard.jpg')
    })

    sphere = new THREE.Mesh(geometry, material)

    scene.add(sphere)

    renderer = new THREE.WebGLRenderer()

    renderer.setSize(width, height)
    renderer.setClearColor({ color: 0x000000 })
    element = renderer.domElement
    document.getElementById('stage').appendChild(element)
    renderer.render(scene, camera)

    var isAndroid = false
    var isIOS = false
    if (navigator.userAgent.indexOf('Android') != -1) {
      isAndroid = true
    } else if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
      isIOS = true
    }
    if (isAndroid || isIOS) {
      window.addEventListener('deviceorientation', setOrientationControls, true)
    } else {
      setOrbitControls()
    }

    render()
  }

  function handleResize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }

  function setOrbitControls() {
    controls = new THREE.OrbitControls(camera, element)
    controls.target.set(
      camera.position.x + 0.15,
      camera.position.y,
      camera.position.z
    )

    controls.enableDamping = true

    controls.dampingFactor = 0.2

    controls.rotateSpeed = 0.1

    controls.noZoom = true

    controls.noPan = true
  }

  function setOrientationControls(e) {
    if (!e.alpha) {
      return
    }
    controls = new THREE.DeviceOrientationControls(camera, true)
    controls.connect()
    controls.update()
    window.removeEventListener(
      'deviceorientation',
      setOrientationControls,
      true
    )
  }

  function render() {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
    controls.update()
  }

  var viewer = new Kaleidoscope.Image({
    source: 'pack/images/weibocard.jpg',
    containerId: '#stage',
    initialYaw: 246,
    height: window.innerHeight,
    width: window.innerWidth
    // verticalPanning: false
  })

  viewer.render()

  window.onresize = function() {
    viewer.setSize({ height: window.innerHeight, width: window.innerWidth })
  }
})()
