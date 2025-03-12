document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const header = document.querySelector('header');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Ensure dropdown opens and closes correctly on mobile
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    dropbtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownContent.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!dropbtn.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (!this.classList.contains('dropbtn') && this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in-up');
                    }, 300);
                }
            });
        },
        { threshold: 0.15 }
    );
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    document.querySelector('.contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const loadingDots = document.querySelector('.loading-dots');
        loadingDots.style.display = 'inline-block';

        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            loadingDots.style.display = 'none';
            if (response.ok) {
                alert('Thank you for your message! I will respond shortly.');
                form.reset();
            } else {
                alert('There was an error sending your message. Please try again later.');
            }
        } catch (error) {
            loadingDots.style.display = 'none';
            alert('There was an error sending your message. Please check your internet connection and try again.');
        }
    });

    // Modal functionality
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-target');
            document.getElementById(modalId).style.display = 'block';
        });
    });

    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Simplified review slider functionality with 3D animations
    const reviews = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function showSlide(index) {
        reviews.forEach((review, i) => {
            review.style.display = i === index ? 'block' : 'none';
            review.classList.remove('slide-in');
            if (i === index) {
                review.classList.add('slide-in');
            }
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % reviews.length;
        showSlide(currentIndex);
    }

    let slideInterval = setInterval(nextSlide, 3000);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            currentIndex = index;
            slideInterval = setInterval(nextSlide, 3000);
        });
    });

    // Ensure the first slide is displayed initially
    showSlide(currentIndex);

    var options = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            },
            background: '#f8f9fa', // Light Gray background
            foreColor: '#343a40', // Dark Gray text color
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        series: [{
            name: 'Skill Level',
            data: [90, 85, 80, 75, 70, 65, 60]
        }],
        xaxis: {
            categories: ['Frontend Development', 'UI/UX Design', 'Problem Solving', 'Artificial Intelligence', 'SEO Optimization', 'Backend Development', 'Containerization'],
            labels: {
                style: {
                    colors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C', '#FF5733', '#C70039'], // Premium colors
                    fontSize: '12px'
                },
                offsetX: -20 // Further adjust the offset to ensure full text is visible
            }
        },
        yaxis: {
            max: 100,
            labels: {
                style: {
                    colors: '#343a40', // Dark Gray text color
                    fontSize: '12px'
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: true, // Ensure the chart is horizontal
                columnWidth: '50%',
                endingShape: 'rounded'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C', '#FF5733', '#C70039'],
                inverseColors: true,
                opacityFrom: 0.8,
                opacityTo: 0.3,
                stops: [0, 20, 40, 60, 80, 100]
            }
        },
        colors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C', '#FF5733', '#C70039'], // Premium colors
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#343a40'], // Dark Gray text color
                fontSize: '14px',
                fontWeight: 'bold'
            }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function (val) {
                    return val + "%";
                }
            }
        },
        grid: {
            borderColor: '#e9ecef',
            strokeDashArray: 4
        },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: {
                    height: 300
                },
                plotOptions: {
                    bar: {
                        columnWidth: '70%'
                    }
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                }
            }
        }]
    };

    var chart = new ApexCharts(document.querySelector("#skillsChart"), options);
    chart.render();

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Change header style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Parallax effect
    const parallaxLayers = document.querySelectorAll('.parallax__layer');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        parallaxLayers.forEach(layer => {
            const depth = layer.getAttribute('data-depth');
            const movement = -(scrollTop * depth);
            const translate3d = `translate3d(0, ${movement}px, 0)`;
            layer.style.transform = translate3d;
        });
    });

    // Enhance 3D transformations for project modals
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-target');
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
            modal.querySelector('.modal-content').classList.add('rotate-in');
        });
    });

    document.querySelectorAll('.modal-close').forEach(span => {
        span.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.querySelector('.modal-content').classList.remove('rotate-in');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            const modal = e.target;
            modal.querySelector('.modal-content').classList.remove('rotate-in');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });

    // Remove zoom effects for certificate images
    document.querySelectorAll('.certification-image').forEach(image => {
        image.removeEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    });

    // Blog modal functionality
    document.querySelectorAll('.open-blog-modal').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('blog-modal').style.display = 'block';
        });
    });

    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    const typingAnimation = document.querySelector('.typing-animation');
    if (typingAnimation) {
        typingAnimation.style.visibility = 'visible';
        typingAnimation.style.animation = 'none';
        typingAnimation.style.animationIterationCount = '1'; // Animate only once
    }

    // Initialize typing animation
    setTimeout(() => {
        const typingElement = document.querySelector('.typing-animation');
        if (typingElement) {
            typingElement.style.visibility = 'visible';
        }
    }, 500); // Short delay to ensure smooth animation start

    // Initialize typing animation after a short delay
    setTimeout(() => {
        const typingElement = document.querySelector('.typing-animation');
        if (typingElement) {
            typingElement.style.visibility = 'visible';
            typingElement.style.animation = 'typing 3.5s steps(40, end) forwards, blink-caret 0.75s ';
            
            // Add class to remove cursor after animation completes
            setTimeout(() => {
                typingElement.classList.add('typing-complete');
            }, 4500); // Wait for typing animation to complete (3.5s + 1s delay)
        }
    }, 1000);

    // Custom cursor functionality
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
    });

    document.querySelectorAll('button, .cta-button, .about-button, .resume-button, nav a, .social-media a').forEach(button => {
        button.addEventListener('mouseover', () => {
            cursor.style.transform = 'scale(1.2)';
        });
        button.addEventListener('mouseout', () => {
            cursor.style.transform = 'scale(1)';
        });
        button.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.9)';
        });
        button.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1.2)';
        });
    });

    // Enhance 3D effect for scrollbar
    const scrollbarThumb = document.querySelector('::-webkit-scrollbar-thumb');
    if (scrollbarThumb) {
        scrollbarThumb.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
        scrollbarThumb.addEventListener('mouseover', () => {
            scrollbarThumb.style.backgroundColor = 'var(--secondary-color)';
            scrollbarThumb.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
        });
        scrollbarThumb.addEventListener('mouseout', () => {
            scrollbarThumb.style.backgroundColor = 'var(--primary-color)';
            scrollbarThumb.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        });
        scrollbarThumb.addEventListener('mousedown', () => {
            scrollbarThumb.style.backgroundColor = 'var(--dark-color)';
            scrollbarThumb.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.4)';
        });
        scrollbarThumb.addEventListener('mouseup', () => {
            scrollbarThumb.style.backgroundColor = 'var(--primary-color)';
            scrollbarThumb.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        });
    }

    // Three.js initialization for 3D animated background
    let scene, camera, renderer, particles, particleSystem, controls;

    function init() {
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Camera setup
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.appendChild(renderer.domElement);
        } else {
            console.error('Home section not found');
            return;
        }

        // Particle system setup
        const particleCount = 1000;
        particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff6347,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
        });

        particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Light setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Controls setup
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.noPan = true;
        controls.noZoom = true;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        // Window resize handler
        window.addEventListener('resize', onWindowResize, false);

        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        particleSystem.rotation.y += 0.001;

        controls.update();
        renderer.render(scene, camera);
    }

    init();
});