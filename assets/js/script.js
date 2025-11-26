document.addEventListener('DOMContentLoaded', function() {
    console.log('Voetbaltoernooi App Initialized');
    
    // Smooth navbar animation on scroll - improved
    const navbar = document.querySelector('.site-header');
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        lastScroll = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Add shadow on scroll
                if (lastScroll > 10) {
                    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                } else {
                    navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Search Toggle with smooth transitions
    const searchToggle = document.getElementById('searchToggle');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const searchClose = document.getElementById('searchClose');
    const mainSearchInput = document.getElementById('mainSearchInput');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchBarContainer.classList.add('active');
            setTimeout(() => mainSearchInput.focus(), 300);
        });
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', function(e) {
            e.preventDefault();
            searchBarContainer.classList.remove('active');
            mainSearchInput.value = '';
        });
    }
    
    // Close search on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchBarContainer && searchBarContainer.classList.contains('active')) {
            searchBarContainer.classList.remove('active');
            if (mainSearchInput) mainSearchInput.value = '';
        }
    });

    // Dark Mode Toggle with localStorage persistence
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeText = document.getElementById('darkModeText');
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeText) darkModeText.textContent = 'Lichte modus';
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                if (darkModeText) darkModeText.textContent = 'Lichte modus';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                if (darkModeText) darkModeText.textContent = 'Donkere modus';
            }
        });
    }

    // Match Filter functionality with smooth animations
    const filterButtons = document.querySelectorAll('#matchFilter .nav-link');
    const matchCards = document.querySelectorAll('.match-card-modern');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            matchCards.forEach((card, index) => {
                const status = card.getAttribute('data-status');
                
                if (filter === 'all' || status === filter) {
                    card.style.display = 'block';
                    // Stagger animation
                    setTimeout(() => {
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = 'scaleIn 0.4s ease-out';
                        }, 10);
                    }, index * 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add entrance animations to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.feature-card, .stat-card, .match-card-modern, .team-card-modern').forEach(card => {
        observer.observe(card);
    });

    // Form validation enhancement
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Add loading state to buttons on click
    document.querySelectorAll('.btn').forEach(button => {
        if (button.type === 'submit') {
            button.addEventListener('click', function() {
                this.classList.add('loading');
            });
        }
    });

    console.log('All features initialized successfully');
});

// Enhanced Three.js Hero Animation
(function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.05);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, canvas.parentElement.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    camera.position.z = 8;

    // Create multiple particle systems with different colors
    const particleSystems = [];
    const particleConfigs = [
        { count: 800, size: 0.02, color: 0x3b82f6, speed: 0.0003 },
        { count: 600, size: 0.015, color: 0x60a5fa, speed: 0.0005 },
        { count: 400, size: 0.025, color: 0x2563eb, speed: 0.0002 }
    ];

    particleConfigs.forEach(config => {
        const geometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(config.count * 3);
        const velocities = new Float32Array(config.count * 3);

        for (let i = 0; i < config.count * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
            velocities[i] = (Math.random() - 0.5) * 0.02;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const material = new THREE.PointsMaterial({
            size: config.size,
            color: config.color,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const mesh = new THREE.Points(geometry, material);
        mesh.userData = { speed: config.speed };
        particleSystems.push(mesh);
        scene.add(mesh);
    });

    // Create enhanced floating footballs with hexagon pattern
    const footballs = [];
    const footballGeometry = new THREE.IcosahedronGeometry(0.2, 1);
    
    // Create gradient material for footballs
    const footballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        emissive: 0x2563eb,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
        flatShading: true
    });

    for (let i = 0; i < 12; i++) {
        const football = new THREE.Mesh(footballGeometry, footballMaterial.clone());
        football.position.x = (Math.random() - 0.5) * 12;
        football.position.y = (Math.random() - 0.5) * 10;
        football.position.z = (Math.random() - 0.5) * 8;
        football.castShadow = true;
        
        football.userData = {
            velocity: {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.008
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.01
            },
            initialY: football.position.y,
            phaseOffset: i * 0.5
        };
        
        footballs.push(football);
        scene.add(football);
    }

    // Add connecting lines between nearby footballs
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(footballs.length * footballs.length * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x3b82f6, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x60a5fa, 0.8);
    backLight.position.set(-5, -3, -2);
    scene.add(backLight);

    const rimLight = new THREE.PointLight(0x2563eb, 1.5, 15);
    rimLight.position.set(0, 3, 4);
    scene.add(rimLight);

    // Add animated rim light
    const movingLight = new THREE.PointLight(0x3b82f6, 2, 20);
    scene.add(movingLight);

    // Mouse interaction with smooth damping
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX - windowHalfX) / 100;
        targetMouseY = (event.clientY - windowHalfY) / 100;
    });

    // Touch support for mobile
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            targetMouseX = (event.touches[0].clientX - windowHalfX) / 100;
            targetMouseY = (event.touches[0].clientY - windowHalfY) / 100;
        }
    });

    // Animation loop with enhanced effects
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;

        // Smooth mouse following
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Animate particle systems with wave effect
        particleSystems.forEach((system, index) => {
            system.rotation.y += system.userData.speed;
            system.rotation.x = Math.sin(time + index) * 0.1 + mouseY * 0.08;
            system.rotation.z = Math.cos(time * 0.5 + index) * 0.05;
            
            // Animate individual particles
            const positions = system.geometry.attributes.position.array;
            const velocities = system.geometry.attributes.velocity.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += Math.sin(time + i) * 0.001;
                positions[i + 1] += Math.cos(time + i) * 0.001;
            }
            system.geometry.attributes.position.needsUpdate = true;
        });

        // Animate footballs with improved physics
        let lineIndex = 0;
        const linePositions = lines.geometry.attributes.position.array;
        
        footballs.forEach((football, i) => {
            // Complex floating motion
            const floatAmplitude = 0.6;
            const floatSpeed = 0.8;
            football.position.y = football.userData.initialY + 
                Math.sin(time * floatSpeed + football.userData.phaseOffset) * floatAmplitude +
                Math.cos(time * floatSpeed * 0.5 + football.userData.phaseOffset) * (floatAmplitude * 0.5);
            
            // Smooth drift with boundaries
            football.position.x += football.userData.velocity.x;
            football.position.z += football.userData.velocity.z;
            
            // Soft boundary collision with smooth bounce
            const boundX = 6;
            const boundZ = 4;
            if (Math.abs(football.position.x) > boundX) {
                football.userData.velocity.x *= -0.98;
                football.position.x = Math.sign(football.position.x) * boundX;
            }
            if (Math.abs(football.position.z) > boundZ) {
                football.userData.velocity.z *= -0.98;
                football.position.z = Math.sign(football.position.z) * boundZ;
            }
            
            // Enhanced rotation
            football.rotation.x += football.userData.rotationSpeed.x;
            football.rotation.y += football.userData.rotationSpeed.y;
            football.rotation.z += football.userData.rotationSpeed.z;
            
            // Dynamic scaling with breathing effect
            const baseScale = 1;
            const scaleVariation = 0.15;
            const scale = baseScale + Math.sin(time * 1.5 + football.userData.phaseOffset) * scaleVariation;
            football.scale.set(scale, scale, scale);
            
            // Update material properties for glow effect
            football.material.emissiveIntensity = 0.6 + Math.sin(time * 2 + i) * 0.3;
            
            // Draw connections between nearby footballs
            for (let j = i + 1; j < footballs.length; j++) {
                const distance = football.position.distanceTo(footballs[j].position);
                if (distance < 4) {
                    linePositions[lineIndex++] = football.position.x;
                    linePositions[lineIndex++] = football.position.y;
                    linePositions[lineIndex++] = football.position.z;
                    linePositions[lineIndex++] = footballs[j].position.x;
                    linePositions[lineIndex++] = footballs[j].position.y;
                    linePositions[lineIndex++] = footballs[j].position.z;
                }
            }
        });
        
        // Update line connections
        for (let i = lineIndex; i < linePositions.length; i++) {
            linePositions[i] = 0;
        }
        lines.geometry.attributes.position.needsUpdate = true;

        // Animate moving light in a circular pattern
        movingLight.position.x = Math.cos(time * 0.5) * 5;
        movingLight.position.z = Math.sin(time * 0.5) * 5;
        movingLight.position.y = Math.sin(time * 0.7) * 3;

        // Smooth camera movement with easing
        camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 0.8 - camera.position.y) * 0.03;
        
        // Add subtle camera rotation
        camera.rotation.z = mouseX * 0.01;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const heroSection = canvas.parentElement;
        camera.aspect = window.innerWidth / heroSection.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, heroSection.offsetHeight);
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        renderer.dispose();
    });
})();