import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // --- Starfield ---
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 200;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- Astronaut Group ---
    const astronaut = new THREE.Group();
    scene.add(astronaut);

    // Use an electric violet material
    const material = new THREE.MeshStandardMaterial({ color: 0x9d00ff });

    // Head (Cone for sharper look)
    const head = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    head.rotation.x = Math.PI;
    head.position.set(0, 2.5, 0);
    astronaut.add(head);

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32), material);
    body.position.set(0, 0.5, 0);
    astronaut.add(body);

    // Arms
    const createArm = () => {
      const armGroup = new THREE.Group();
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2, 32), material);
      arm.position.set(0, -1, 0);
      armGroup.add(arm);
      return armGroup;
    };
    
    const leftArm = createArm();
    leftArm.position.set(-1.2, 1, 0);
    astronaut.add(leftArm);

    const rightArm = createArm();
    rightArm.position.set(1.2, 1, 0);
    astronaut.add(rightArm);

    // Legs
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 32), material);
    leftLeg.position.set(-0.5, -1.5, 0);
    astronaut.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 32), material);
    rightLeg.position.set(0.5, -1.5, 0);
    astronaut.add(rightLeg);

    // --- Animation Setup ---
    let time = 0;
    const cycleDuration = 18;
    const maxX = 4; // Extend movement range

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.05;
      const phaseTime = time % cycleDuration;

      // Default rotation reset
      astronaut.rotation.set(0, 0, 0);

      if (phaseTime < 2 || (phaseTime >= 8 && phaseTime < 10) || (phaseTime >= 16)) {
        // 🌀 **Cartwheels at the sides** (fast spinning on X-axis)
        if (phaseTime < 2 || phaseTime >= 16) {
          astronaut.position.x = -maxX;
        } else {
          astronaut.position.x = maxX;
        }
        astronaut.rotation.x += 0.3; // Fast cartwheeling spin
      } else if (phaseTime < 8) {
        // 🕺 **Moonwalk from left to right**
        let t = (phaseTime - 2) / 6;
        astronaut.position.x = -maxX + t * (maxX - (-maxX));
        astronaut.rotation.y += 0.005;
      } else if (phaseTime < 10) {
        // 🌀 **Cartwheels at the right**
        astronaut.position.x = maxX;
        astronaut.rotation.x += 0.3;
      } else if (phaseTime < 16) {
        // 🕺 **Moonwalk back from right to left**
        let t = (phaseTime - 10) / 6;
        astronaut.position.x = maxX - t * (maxX - (-maxX));
        astronaut.rotation.y += 0.005;
      }

      // ✨ **Bouncing effect** for dynamic movement
      const bounce = Math.sin(time * 2) * 0.5;
      head.position.y = 2.5 + bounce;
      body.position.y = 0.5 + bounce;
      leftArm.position.y = 1 + bounce;
      rightArm.position.y = 1 + bounce;
      leftLeg.position.y = -1.5 + bounce;
      rightLeg.position.y = -1.5 + bounce;

      // 🎭 **Swinging arms & swaying legs during moonwalk**
      leftArm.rotation.z = Math.sin(time * 3) * 0.8;
      rightArm.rotation.z = -Math.sin(time * 3) * 0.8;
      leftLeg.rotation.x = Math.sin(time * 3) * 0.5;
      rightLeg.rotation.x = -Math.sin(time * 3) * 0.5;

      // 🌌 **Starfield rotation for ambiance**
      starField.rotation.x += 0.0005;
      starField.rotation.y += 0.0007;

      renderer.render(scene, camera);
    };
    const textSprite = new SpriteText('MOONWALKER');
    textSprite.color = 'white';
    textSprite.textHeight = 0.3; // Smaller text
    textSprite.position.set(0, 1, 1.1);
    animate();


    // --- Handle Window Resize ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    />
  );
};

export default ThreeBackground;
