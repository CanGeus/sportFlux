var x,y,z;

// Initial setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cone
const geometry = new THREE.ConeGeometry(1, 2, 8);
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
});
const plane = new THREE.Mesh(geometry, material);

scene.add(plane);

camera.position.z = 4;

// Animation loop
async function animate() {
    await fetchData();

    requestAnimationFrame(animate);

    plane.rotation.x = x;
    plane.rotation.y = y;
    plane.rotation.y = z;

    renderer.render(scene, camera);
}

// Fetch data from the server
async function fetchData() {
    const apiUrl = './api/getGyro.php';

    try {
const response = await fetch(apiUrl);
const data = await response.json();

if (data.length > 0) {
    x = data.map(entry => entry.gyroX);
    y = data.map(entry => entry.gyroY);
    z = data.map(entry => entry.gyroZ);
    document.getElementById('acelX').innerText = data.map(entry => entry.acelX);
    document.getElementById('acelY').innerText = data.map(entry => entry.acelY);
    document.getElementById('acelZ').innerText = data.map(entry => entry.acelZ);
    document.getElementById('gyroX').innerText = data.map(entry => entry.gyroX);
    document.getElementById('gyroY').innerText = data.map(entry => entry.gyroY);
    document.getElementById('gyroZ').innerText = data.map(entry => entry.gyroZ);
    document.getElementById('magX').innerText = data.map(entry => entry.magX);
    document.getElementById('magY').innerText = data.map(entry => entry.magY);
    document.getElementById('magZ').innerText = data.map(entry => entry.magZ);
} else {
    console.error('No data received from API');
}
    } catch (error) {
console.error('Error fetching or parsing data:', error);
    }
}

animate();