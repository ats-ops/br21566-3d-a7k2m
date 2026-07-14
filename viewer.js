import * as THREE from 
"https://cdn.jsdelivr.net/npm/three@0.167/build/three.module.js";

import { OrbitControls } from
"https://cdn.jsdelivr.net/npm/three@0.167/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.167/examples/jsm/loaders/GLTFLoader.js";


// シーン
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);


// カメラ
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

camera.position.set(0,0,200);


// レンダラー
const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);


// 操作
const controls =
new OrbitControls(camera,renderer.domElement);

controls.enableDamping=true;


// ライト

const light = new THREE.DirectionalLight(
    0xffffff,
    3
);

light.position.set(10,20,30);

scene.add(light);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1
    )
);


// GLB読み込み

let model;


const loader=new GLTFLoader();


loader.load(
    "./models/model.glb",

    gltf=>{

        model=gltf.scene;

        scene.add(model);


        // サイズ調整
        const box =
        new THREE.Box3()
        .setFromObject(model);


        const size =
        box.getSize(new THREE.Vector3())
        .length();


        model.scale.multiplyScalar(
            100/size
        );

    }
);




// Raycaster
const raycaster =
new THREE.Raycaster();


const mouse =
new THREE.Vector2();



// 点表示用

function addPoint(position){


    const geometry =
    new THREE.SphereGeometry(
        1.5,
        16,
        16
    );


    const material =
    new THREE.MeshBasicMaterial({
        color:0xff0000
    });


    const point =
    new THREE.Mesh(
        geometry,
        material
    );


    point.position.copy(position);


    scene.add(point);

}




// クリック処理

window.addEventListener(
"click",

event=>{


mouse.x =
(event.clientX/window.innerWidth)*2-1;


mouse.y =
-(event.clientY/window.innerHeight)*2+1;



raycaster.setFromCamera(
    mouse,
    camera
);



if(model){

const hit =
raycaster.intersectObject(
    model,
    true
);


if(hit.length){


const p =
hit[0].point;


// 点追加

addPoint(p);



// 座標表示

document.getElementById("pos")
.innerHTML=

`
X:${p.x.toFixed(3)}
<br>
Y:${p.y.toFixed(3)}
<br>
Z:${p.z.toFixed(3)}
`;



console.log(
"coordinate",
p
);


}


}


});




// リサイズ

window.addEventListener(
"resize",

()=>{

camera.aspect =
window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();


renderer.setSize(
window.innerWidth,
window.innerHeight
);

});




// 描画

function animate(){

requestAnimationFrame(animate);

controls.update();

renderer.render(
scene,
camera
);

}

animate();
