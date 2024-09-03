// 파일 업로드 핸들러
document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const parser = new DxfParser();
                const dxf = parser.parseSync(e.target.result);
                
                // dxf 객체의 내용을 콘솔에 출력
                console.log('Parsed DXF data:', dxf);
                
                renderDxf(dxf);
            } catch (error) {
                console.error('Error parsing DXF file:', error);
            }
        };
        reader.readAsText(file);
    }
});

// Three.js로 DXF 렌더링
function renderDxf(dxf) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas').appendChild(renderer.domElement);

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // DXF 파일의 엔티티를 처리하여 장면에 추가
    dxf.entities.forEach(entity => {
        const geometry = new THREE.BufferGeometry();
        const positions = [];

        switch (entity.type) {
            case 'LINE':
                positions.push(
                    entity.vertices[0].x, entity.vertices[0].y, 0,
                    entity.vertices[1].x, entity.vertices[1].y, 0
                );
                break;
            case 'CIRCLE':
                // 단순화된 원 그리기 (파라미터 부족으로 원은 생략)
                break;
            case 'ARC':
                // 단순화된 호 그리기 (파라미터 부족으로 호는 생략)
                break;
            case 'INSERT':
                console.warn('INSERT entity type is not supported.');
                break;
            default:
                console.warn(`Unsupported entity type: ${entity.type}`);
        }

        // Geometry에 포지션 데이터 추가
        if (positions.length > 0) {
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const line = new THREE.LineSegments(geometry, material);
            scene.add(line);
        }
    });

    // 로그 추가: 추가된 객체를 콘솔에 출력
    console.log('Entities in scene:', scene.children);

    camera.position.z = 100;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
