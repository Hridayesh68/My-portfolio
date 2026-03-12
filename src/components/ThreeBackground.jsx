import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeBackground = () => {
    const canvasRef = useRef(null);
    const [currentTheme, setCurrentTheme] = useState(() => {
        if (document.documentElement.classList.contains('matrix')) return 'matrix';
        if (document.documentElement.classList.contains('neon-pink')) return 'neon-pink';
        return 'dark';
    });

    // Watch theme changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (document.documentElement.classList.contains('matrix')) setCurrentTheme('matrix');
            else if (document.documentElement.classList.contains('neon-pink')) setCurrentTheme('neon-pink');
            else setCurrentTheme('dark');
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
        let spaceTexture = null;
        const loader = new THREE.TextureLoader();
        loader.load(
            '/space.jpg',
            (texture) => {
                spaceTexture = texture;
            },
            undefined,
            () => {
                // Ignore fallback
            }
        );

        // ── Avatar Card ───────────────────────────────────────────────
        const hridayeshTexture = loader.load('/assets/hridayesh-black.png');
        hridayeshTexture.colorSpace = THREE.SRGBColorSpace; // Fix webgl green tint

        const hridayesh = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 4, 32, 32), // Fix aspect ratio stretching + smooth tilt
            new THREE.MeshBasicMaterial({
                map: hridayeshTexture,
                transparent: true,
                side: THREE.DoubleSide
            })
        );
        hridayesh.position.set(2, 0, -5);
        scene.add(hridayesh);

        // ── Handle Resize ─────────────────────────────────────────────
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // ── Scroll & Drag Interaction State ───────────────────────────
        let scrollRotation = { y: 0, z: 0 };
        let dragRotation = { x: 0, y: 0 };
        let isScrolling = false;
        let scrollTimeout;

        const moveCamera = () => {
            const t = document.body.getBoundingClientRect().top;

            scrollRotation.y = t * -0.01;
            scrollRotation.z = t * -0.01;

            hridayesh.rotation.x = dragRotation.x;
            hridayesh.rotation.y = scrollRotation.y + dragRotation.y;
            hridayesh.rotation.z = scrollRotation.z;

            camera.position.z = t * -0.01;
            camera.position.x = t * -0.0002;
            camera.rotation.y = t * -0.0002;

            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => { isScrolling = false; }, 150);
        };

        window.addEventListener('scroll', moveCamera);
        moveCamera();

        // ── Mouse Drag (Global) ───────────────────────────────────────
        let isDragging = false;
        let previousMouse = { x: 0, y: 0 };

        const onMouseDown = (e) => {
            isDragging = true;
            previousMouse = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e) => {
            if (!isDragging || isScrolling) return;

            const delta = {
                x: e.clientX - previousMouse.x,
                y: e.clientY - previousMouse.y,
            };

            dragRotation.y += delta.x * 0.005;
            dragRotation.x += delta.y * 0.005;

            hridayesh.rotation.x = dragRotation.x;
            hridayesh.rotation.y = scrollRotation.y + dragRotation.y;

            previousMouse = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseleave', onMouseUp);

        // Touch support
        const onTouchStart = (e) => {
            isDragging = true;
            previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const onTouchMove = (e) => {
            if (!isDragging || isScrolling) return;
            // Removed e.preventDefault() here to allow scrolling on mobile, 
            // but dragging horizontal should rotate cube
            const delta = {
                x: e.touches[0].clientX - previousMouse.x,
                y: e.touches[0].clientY - previousMouse.y,
            };

            dragRotation.y += delta.x * 0.005;
            dragRotation.x += delta.y * 0.005;

            hridayesh.rotation.x = dragRotation.x;
            hridayesh.rotation.y = scrollRotation.y + dragRotation.y;

            previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const onTouchEnd = () => { isDragging = false; };

        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);

        // ── Animation Loop ────────────────────────────────────────────
        let animationId;
        const clock = new THREE.Clock();

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            stars.rotation.x += 0.0003;

            const elapsedTime = clock.getElapsedTime();
            const isMobile = window.innerWidth < 768;

            // Apply responsive tilt and bobbing effect
            // The tilt offset ensures the avatar isn't clipped on narrow screens
            hridayesh.rotation.x = dragRotation.x + (isMobile ? -0.25 : 0);
            hridayesh.rotation.y = scrollRotation.y + dragRotation.y + (isMobile ? 0.3 : 0);
            hridayesh.position.y = Math.sin(elapsedTime * 1.2) * 0.15 + (isMobile ? -0.8 : 0);
            hridayesh.position.x = isMobile ? 0 : 2;
            hridayesh.position.z = isMobile ? -6 : -5;

            // Dynamic theme adjustments
            stars.visible = true;
            if (currentTheme === 'matrix') {
                scene.background = new THREE.Color(0x0a0f0a);
                starMaterial.color.setHex(0x00ff41);
            } else if (currentTheme === 'neon-pink') {
                scene.background = new THREE.Color(0x1a0b2e);
                starMaterial.color.setHex(0xff2a85);
            } else {
                scene.background = spaceTexture || new THREE.Color(0x000000);
                starMaterial.color.setHex(0xffffff);
            }

            renderer.render(scene, camera);
        };
        animate();

        // ── Cleanup ───────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', moveCamera);

            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseleave', onMouseUp);

            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);

            renderer.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
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
                opacity: 1, // Always visible now!
                transition: 'opacity 0.5s ease',
            }}
        />
    );
};

export default ThreeBackground;
