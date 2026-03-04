import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeBackground = () => {
    const canvasRef = useRef(null);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    // Watch theme changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // ── Scene Setup ──────────────────────────────────────────────
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);
        camera.position.setX(-3);

        // ── Lights ───────────────────────────────────────────────────
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(pointLight, ambientLight);

        // ── Stars ────────────────────────────────────────────────────
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 300;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = THREE.MathUtils.randFloatSpread(200);
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            sizeAttenuation: true,
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // ── Background Texture ───────────────────────────────────────
        const loader = new THREE.TextureLoader();
        loader.load(
            '/space.jpg',
            (texture) => { scene.background = texture; },
            undefined,
            () => {
                // Fallback: deep space dark color
                scene.background = new THREE.Color(0x030310);
            }
        );

        // ── Avatar Cube ───────────────────────────────────────────────
        const hridayeshTexture = loader.load('/assets/hridayesh.jpg');
        const hridayesh = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshBasicMaterial({ map: hridayeshTexture })
        );
        hridayesh.position.set(2, 0, -5);
        scene.add(hridayesh);

        // ── Orbit Controls ────────────────────────────────────────────
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enabled = false;

        // ── Handle Resize ─────────────────────────────────────────────
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // ── Scroll Animation ──────────────────────────────────────────
        const moveCamera = () => {
            const t = document.body.getBoundingClientRect().top;
            hridayesh.rotation.y += 0.01;
            hridayesh.rotation.z += 0.01;
            stars.rotation.y = t * 0.0002;
            camera.position.z = t * -0.01;
            camera.position.x = t * -0.0002;
            camera.rotation.y = t * -0.0002;
        };

        document.body.onscroll = moveCamera;
        moveCamera();

        // ── Animation Loop ────────────────────────────────────────────
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            hridayesh.rotation.y += 0.003;
            stars.rotation.x += 0.0003;
            renderer.render(scene, camera);
        };
        animate();

        // ── Cleanup ───────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            document.body.onscroll = null;
            renderer.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
            controls.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="bg"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: isDark ? 1 : 0,
                transition: 'opacity 0.5s ease',
            }}
        />
    );
};

export default ThreeBackground;
