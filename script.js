window.addEventListener('load', () => {
const viewer = document.getElementById('viewer');
viewer.cameraOrbit = '45deg 25deg ';
viewer.filedOfView = '30deg';
});

const viewer=document.getElementById("viewer");

viewer.addEventListener("load",()=>{

console.log("3Dモデルの読み込み完了");

});

viewer.addEventListener("error",()=>{

alert("3Dモデルを読み込めませんでした。");

});
