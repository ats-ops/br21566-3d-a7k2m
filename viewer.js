// ===============================
// Three.js
// ===============================

import * as THREE from "three";

import { OrbitControls }
from "three/addons/controls/OrbitControls.js";

import { GLTFLoader }
from "three/addons/loaders/GLTFLoader.js";


// ===============================
// 基本設定
// ===============================

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x222222);



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



// ===============================
// Renderer
// ===============================

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



// ===============================
// Controls
// ===============================

const controls =
new OrbitControls(
    camera,
    renderer.domElement
);


controls.enableDamping = true;

controls.dampingFactor = 0.05;



// ===============================
// Light
// ===============================


scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1.5
    )
);



const light =
new THREE.DirectionalLight(
    0xffffff,
    2
);


light.position.set(
    50,
    100,
    50
);


scene.add(light);



// ===============================
// GLB読み込み
// ===============================

let model = null;


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



        scene.add(model);



        // -----------------------
        // サイズ調整
        // -----------------------

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



        // 原点へ移動

        model.position.sub(center);



        // カメラ距離調整

        const maxSize =
        Math.max(
            size.x,
            size.y,
            size.z
        );


        camera.position.set(
            0,
            0,
            maxSize * 2
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
            "GLB読み込み失敗",
            error
        );

    }

);




// ===============================
// 座標取得
// ===============================


const raycaster =
new THREE.Raycaster();


const mouse =
new THREE.Vector2();



window.addEventListener(
"click",

(event)=>{


    mouse.x =
    (event.clientX /
    window.innerWidth) * 2 - 1;



    mouse.y =
    -(event.clientY /
    window.innerHeight) * 2 + 1;



    raycaster.setFromCamera(
        mouse,
        camera
    );



    if(!model)
        return;



    const hit =
    raycaster.intersectObject(
        model,
        true
    );



    console.log(
        "hit:",
        hit.length
    );



    if(hit.length > 0){


        const point =
        hit[0].point;



        console.log(
            "座標",
            point
        );



        showPosition(
            point
        );



        addMarker(
            point
        );

    }


});




// ===============================
// 座標表示
// ===============================


function showPosition(p){


    let info =
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




// ===============================
// ピン表示
// ===============================


function addMarker(position){


    const geometry =
    new THREE.SphereGeometry(
        1.5,
        20,
        20
    );


    const material =
    new THREE.MeshBasicMaterial(
    {
        color:0xff0000
    });


    const marker =
    new THREE.Mesh(
        geometry,
        material
    );


    marker.position.copy(
        position
    );


    scene.add(
        marker
    );

}



// ===============================
// Resize
// ===============================


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




// ===============================
// Animation
// ===============================


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
