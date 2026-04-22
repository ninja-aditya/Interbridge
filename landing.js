/**
 * InternBridge Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Shadow on Scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Animated Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target.toLocaleString() + (stat.innerText.includes('%') ? '%' : '+');
                }
            };
            
            // Format specific ones
            if (target === 92) {
                 const finish = () => { stat.innerText = '92%'; };
                 setTimeout(finish, duration);
            }

            updateCounter();
        });
    };

    // Intersection Observer to trigger animation when stats section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateStats();
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // 3. Optional: Mobile menu toggle (skeleton logic)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '72px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        });
    }
});
