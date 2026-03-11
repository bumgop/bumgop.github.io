// menu show
const showMenu = (toggleId, navId) => 
{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav)
    {
        toggle.addEventListener('click', () => 
        {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

// remove menu mobile
const navLink = document.querySelectorAll('.nav__link')

function linkAction()
{
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

// scroll sections active link
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>
{
    const scrollY = window.scrollY
    sections.forEach(current =>
    {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(sectionsClass) {
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight)
            {
                sectionsClass.classList.add('active-link')
            }
            else
            {
                sectionsClass.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

// scroll reveal animation
const srTop = ScrollReveal
(
    {
        origin: 'top',
        distance: '60px',
        duration: 2000,
        delay: 200,
    }
);


srTop.reveal('.skill__card', {});
srTop.reveal('.about__subtitle, .about__text', {delay: 400});
srTop.reveal('.skills__data, .projects__img, .contact__container', {interval: 200});

const srRight = ScrollReveal
(
    {
        origin: 'right',
        distance: '100px',
        duration: 2000,
        delay: 200,
    }
);

srRight.reveal('.home__img', {delay: 400});

const srLeft = ScrollReveal
(
    {
        origin: 'left',
        distance: '100px',
        duration: 2000,
        delay: 200,
    }
);

srLeft.reveal('.home__data', {});
srLeft.reveal('.home__social-icon', {interval: 200});

// carousel feature
const initCarousel = () => {
    const projectCards = document.querySelectorAll('.project__card');
    const carouselIntervals = new Map();
    const currentImageIndex = new Map();

    const startCarousel = (projectCard) => {
        const projectNum = projectCard.getAttribute('data-project');
        const img = projectCard.querySelector('.project__img img');
        
        if (!currentImageIndex.has(projectNum)) {
            currentImageIndex.set(projectNum, 0);
        }

        if (!carouselIntervals.has(projectNum)) {
            const interval = setInterval(() => {
                let currentIndex = currentImageIndex.get(projectNum);
                currentIndex = (currentIndex + 1) % 3; // Cycle through 3 images
                currentImageIndex.set(projectNum, currentIndex);
                
                img.src = `assets/img/proj${projectNum}_${currentIndex}.png`;
            }, 3000); // Change image every 3 seconds

            carouselIntervals.set(projectNum, interval);
        }
    };

    const stopCarousel = (projectNum) => {
        if (carouselIntervals.has(projectNum)) {
            clearInterval(carouselIntervals.get(projectNum));
            carouselIntervals.delete(projectNum);
        }
    };

    projectCards.forEach(projectCard => {
        const projectNum = projectCard.getAttribute('data-project');
        
        projectCard.addEventListener('mouseenter', () => {
            stopCarousel(projectNum);
        });

        projectCard.addEventListener('mouseleave', () => {
            startCarousel(projectCard);
        });

        // Auto-start carousel on page load
        startCarousel(projectCard);
    });
};

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

// contact form functionality
const initContactForm = () => {
    // Initialize EmailJS with public key
    emailjs.init('jeu_jyxSwXLRfibfF');

    const contactForm = document.getElementById('contact__form');
    const submitButton = document.getElementById('contact__submit');

    // Input validation function
    const validateInput = (value, minLength = 1, maxLength = 1000) => {
        return typeof value === 'string' && 
               value.trim().length >= minLength && 
               value.trim().length <= maxLength;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (submitButton) {
        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact__name').value.trim();
            const email = document.getElementById('contact__email').value.trim();
            const subject = document.getElementById('contact__subject').value.trim();
            const message = document.getElementById('contact__message').value.trim();

            // Validate inputs
            if (!validateInput(name, 1, 100)) {
                showNotification('Please enter a valid name', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            if (!validateInput(subject, 1, 200)) {
                showNotification('Please enter a valid subject', 'error');
                return;
            }

            if (!validateInput(message, 10, 5000)) {
                showNotification('Message must be between 10 and 5000 characters', 'error');
                return;
            }

            // Prepare template parameters
            const templateParams = {
                name: name,
                email: email,
                title: subject,
                message: message
            };

            try {
                // Send email using EmailJS
                const response = await emailjs.send(
                    'service_o4o68ha',
                    'contact_form',
                    templateParams
                );

                showNotification(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                contactForm.reset();

                console.log('Email sent successfully:', response);
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
                console.error('Failed to send email:', error);
            }
        });
    }
};

// Helper function to show notifications
const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
};

// Initialize contact form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}