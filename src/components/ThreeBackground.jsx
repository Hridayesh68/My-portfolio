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
        renderer.setClearColor(0x000000, 0);
        scene.background = null;

        // ── BACKGROUND POLICY ────────────────────────────────────────────
        // scene.background is intentionally null. The CSS body background
        // (--bg: #0a0804) shows through the transparent canvas.
        // DO NOT set scene.background here or inside animate() — it will
        // override the global CSS colour and break the design system.
        // Theme colours are applied ONLY to starMaterial.color below.
        // ─────────────────────────────────────────────────────────────────
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

        // ── Avatar Card (Removed for Static Image) ────────────────────

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
            const t = window.scrollY * -1;
            camera.position.z = 30 + t * 0.005;
            camera.position.x = t * -0.0001;
            camera.rotation.y = t * -0.0001;

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

            previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const onTouchEnd = () => { isDragging = false; };

        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);

        // ── Animation Loop ────────────────────────────────────────────
        // NOTE: scene.background is NOT set here. Only star colours change.
        // Adding scene.background inside animate() breaks the CSS background.
        let animationId;
        const clock = new THREE.Clock();

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            stars.rotation.x += 0.0003;

            const isMobile = window.innerWidth < 768;
            stars.visible = true;
            if (currentTheme === 'matrix') {
                starMaterial.color.setHex(0x00ff41);
            } else if (currentTheme === 'neon-pink') {
                starMaterial.color.setHex(0xff2a85);
            } else {
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
