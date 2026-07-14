import * as THREE from "three";

import { OrbitControls }
from "three/addons/controls/OrbitControls.js";

import { GLTFLoader }
from "three/addons/loaders/GLTFLoader.js";



// ============================
// Scene
// ============================

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x222222);



// ============================
// Camera
// ============================

const camera =
new THREE.PerspectiveCamera(
    45,
    window.innerWidth /
    window.innerHeight,
    0.1,
    5000
);

camera.position.set(
    0,
    0,
    100
);



// ============================
// Renderer
// ============================

const renderer =
new THREE.WebGLRenderer({
    antialias:true
});


renderer.setPixelRatio(
    window.devicePixelRatio
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


document.body.appendChild(
    renderer.domElement
);



// ============================
// Controls
// ============================

const controls =
new OrbitControls(
    camera,
    renderer.domElement
);


controls.enableDamping=true;

controls.dampingFactor=0.05;



// ============================
// Light
// ============================


scene.add(
new THREE.AmbientLight(
    0xffffff,
    1.5
)
);



const directional =
new THREE.DirectionalLight(
    0xffffff,
    2
);


directional.position.set(
    50,
    100,
    50
);


scene.add(
directional
);



// ============================
// Load GLB
// ============================


let model=null;


const loader =
new GLTFLoader();



loader.load(

"./models/model.glb",


(gltf)=>{


console.log(
"GLB読み込み成功"
);


model =
gltf.scene;


scene.add(
model
);



// 中心合わせ

const box =
new THREE.Box3()
.setFromObject(model);



const center =
box.getCenter(
new THREE.Vector3()
);


const size =
box.getSize(
new THREE.Vector3()
);



model.position.sub(
center
);



const max =
Math.max(
size.x,
size.y,
size.z
);



camera.position.set(
0,
0,
max*2
);



controls.update();



console.log(
"サイズ",
size
);


},


undefined,


(error)=>{


console.error(
"GLBエラー",
error
);


}

);




// ============================
// Raycaster
// ============================


const raycaster =
new THREE.Raycaster();


const mouse =
new THREE.Vector2();



// 作成した点保存

const markers=[];



// ============================
// Mouse Click
// ============================


window.addEventListener(
"click",

(event)=>{


mouse.x =
(event.clientX /
window.innerWidth)*2-1;


mouse.y =
-(event.clientY /
window.innerHeight)*2+1;



raycaster.setFromCamera(
mouse,
camera
);



// --------------------------
// 点をクリックした場合
// --------------------------


const markerHit =
raycaster.intersectObjects(
markers
);



if(markerHit.length){


const marker =
markerHit[0].object;



// 削除

scene.remove(
marker
);



const index =
markers.indexOf(
marker
);



if(index!=-1){

markers.splice(
index,
1
);

}



document.getElementById(
"pos"
).innerHTML =

"点を削除しました";


return;

}





// --------------------------
// モデルクリック
// --------------------------


if(model){


const hit =
raycaster.intersectObject(
model,
true
);



if(hit.length){


const point =
hit[0].point;



// 点作成

const marker =
createMarker(
point
);



markers.push(
marker
);



// 座標表示

showPosition(
point
);



console.log(
point
);


}


}



});




// ============================
// Marker作成
// ============================


function createMarker(pos){


const geometry =
new THREE.SphereGeometry(
1.5,
24,
24
);



const material =
new THREE.MeshBasicMaterial(
{
color:0xff0000
}
);



const marker =
new THREE.Mesh(
geometry,
material
);



marker.position.copy(
pos
);



scene.add(
marker
);



return marker;


}




// ============================
// 座標表示
// ============================


function showPosition(p){


const info =
document.getElementById(
"pos"
);



if(info){


info.innerHTML =

`
X : ${p.x.toFixed(3)}
<br>
Y : ${p.y.toFixed(3)}
<br>
Z : ${p.z.toFixed(3)}
`;

}


}



// ============================
// Resize
// ============================


window.addEventListener(
"resize",

()=>{


camera.aspect =
window.innerWidth /
window.innerHeight;


camera.updateProjectionMatrix();



renderer.setSize(
window.innerWidth,
window.innerHeight
);


});



// ============================
// Animation
// ============================


function animate(){


requestAnimationFrame(
animate
);


controls.update();


renderer.render(
scene,
camera
);


}


animate();
