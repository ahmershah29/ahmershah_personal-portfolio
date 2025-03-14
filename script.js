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

    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Clean up any existing event listeners
    const contactForm = document.querySelector('.contact-form');
    if (contactForm._submitHandler) {
        contactForm.removeEventListener('submit', contactForm._submitHandler);
    }
    
    // Create the submit handler function
    contactForm._submitHandler = async function(e) {
        e.preventDefault();
        
        // Remove any existing notifications
        const notificationContainer = document.querySelector('.notification-container');
        while (notificationContainer.firstChild) {
            notificationContainer.removeChild(notificationContainer.firstChild);
        }

        const loadingDots = this.querySelector('.loading-dots');
        loadingDots.style.display = 'inline-block';

        try {
            const response = await fetch(this.action, {
                method: this.method,
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            loadingDots.style.display = 'none';
            
            // Create and show single animated notification
            const notification = document.createElement('div');
            notification.className = `notification ${response.ok ? '' : 'error'}`;
            notification.innerHTML = `
                <div class="notification-icon">
                    ${response.ok ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>'}
                </div>
                <div class="notification-content">
                    <h3>${response.ok ? 'Success!' : 'Error!'}</h3>
                    <p>${response.ok ? 'Thank you for your message! I will respond shortly.' : 'There was an error sending your message. Please try again later.'}</p>
                </div>
            `;

            notificationContainer.appendChild(notification);

            // Single animation timeline
            anime.timeline({
                targets: notification,
                easing: 'easeOutElastic(1, .8)',
            }).add({
                translateX: [-50, 0],
                opacity: [0, 1],
                duration: 800
            }).add({
                delay: 3000,
                translateX: [0, 50],
                opacity: 0,
                duration: 800,
                complete: () => notification.remove()
            });

            if (response.ok) {
                this.reset();
            }
        } catch (error) {
            loadingDots.style.display = 'none';
            
            // Show single error notification
            const notification = document.createElement('div');
            notification.className = 'notification error';
            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="notification-content">
                    <h3>Error!</h3>
                    <p>Connection error. Please check your internet connection.</p>
                </div>
            `;

            // Remove any existing notifications before adding new one
            notificationContainer.innerHTML = '';
            notificationContainer.appendChild(notification);

            // Single animation timeline for error
            anime.timeline({
                targets: notification,
                easing: 'easeOutElastic(1, .8)',
            }).add({
                translateX: [-50, 0],
                opacity: [0, 1],
                duration: 800
            }).add({
                delay: 3000,
                translateX: [0, 50],
                opacity: 0,
                duration: 800,
                complete: () => notification.remove()
            });
        }
    };
    
    // Add the event listener only once
    contactForm.addEventListener('submit', contactForm._submitHandler);

    // Modal functionality for all buttons including header buttons
    document.querySelectorAll('.open-modal, .dropbtn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.classList.contains('dropbtn')) {
                // Handle dropdown button
                const dropdownContent = this.nextElementSibling;
                dropdownContent.classList.toggle('show');
                // Close other dropdowns
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    if (content !== dropdownContent) {
                        content.classList.remove('show');
                    }
                });
            } else {
                // Handle modal button
                const modalId = this.getAttribute('data-target');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'block';
                    modal.querySelector('.modal-content').classList.add('rotate-in');
                }
            }
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

    // Initialize chart only once when the DOM is loaded and if the container exists
    const skillsChart = document.querySelector("#skillsChart");
    if (skillsChart && !skillsChart.hasChildNodes()) {
        var options = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false
                },
                background: '#f8f9fa',
                foreColor: '#343a40',
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
                        colors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C', '#FF5733', '#C70039'],
                        fontSize: '12px'
                    },
                    offsetX: -20
                }
            },
            yaxis: {
                max: 100,
                labels: {
                    style: {
                        colors: '#343a40',
                        fontSize: '12px'
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
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
            colors: ['#FF5733', '#C70039', '#900C3F', '#581845', '#1C1C1C', '#FF5733', '#C70039'],
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#343a40'],
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

        // Create chart instance only once
        var chart = new ApexCharts(skillsChart, options);
        chart.render();
    }

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
        typingAnimation.style.animationIterationCount = '1';
    }

    // Initialize typing animation
    setTimeout(() => {
        const typingElement = document.querySelector('.typing-animation');
        if (typingElement) {
            typingElement.style.visibility = 'visible';
        }
    }, 500);

    // Initialize typing animation after a short delay
    setTimeout(() => {
        const typingElement = document.querySelector('.typing-animation');
        if (typingElement) {
            typingElement.style.visibility = 'visible';
            typingElement.style.animation = 'typing 3.5s steps(40, end) forwards, blink-caret 0.75s ';
            
            // Add class to remove cursor after animation completes
            setTimeout(() => {
                typingElement.classList.add('typing-complete');
            }, 4500);
        }
    }, 1000);

    // Three.js initialization for 3D animated background
    let scene, camera, renderer, particles, particleSystem, controls;

    function init() {
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Camera setup
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Modified renderer setup
        renderer = new THREE.WebGLRenderer({ 
            antialias: true
        });
        const homeSection = document.getElementById('home');
        if (homeSection) {
            // Set renderer size to match home section dimensions
            renderer.setSize(homeSection.offsetWidth, homeSection.offsetHeight);
            homeSection.appendChild(renderer.domElement);
            
            // Add style to canvas element
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.zIndex = '-1';
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
        
        // Add passive flag to TrackballControls
        renderer.domElement.addEventListener('touchstart', () => {}, { passive: true });
        renderer.domElement.addEventListener('touchmove', () => {}, { passive: true });
        
        // Prevent default touch behavior only when needed
        renderer.domElement.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // Window resize handler
        window.addEventListener('resize', onWindowResize, false);

        animate();
    }

    function onWindowResize() {
        const homeSection = document.getElementById('home');
        if (homeSection) {
            camera.aspect = homeSection.offsetWidth / homeSection.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(homeSection.offsetWidth, homeSection.offsetHeight);
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        particleSystem.rotation.y += 0.001;

        controls.update();
        renderer.render(scene, camera);
    }

    init();
    initResponsive();
});

function initResponsive() {
    // Device detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Add classes for device-specific styling
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-touch', isTouch);
    
    // Adjust modal behavior for mobile
    const modals = document.querySelectorAll('.modal');
    if(isMobile) {
      modals.forEach(modal => {
        modal.addEventListener('touchmove', e => {
          e.preventDefault();
        }, { passive: false });
      });
    }
    
    // Responsive image loading
    const images = document.querySelectorAll('img[data-src]');
    const loadImage = (img) => {
      const src = img.getAttribute('data-src');
      if(!src) return;
      img.src = src;
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Responsive chart sizing
    const resizeChart = () => {
      if(window.ApexCharts) {
        const chart = document.querySelector('#skillsChart');
        if(chart) {
          chart.style.height = window.innerWidth < 768 ? '300px' : '350px';
        }
      }
    };
    
    window.addEventListener('resize', debounce(resizeChart, 250));
    resizeChart();
  }
  
  // Debounce helper
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }