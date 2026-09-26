document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Prevent default hash behavior
        e.preventDefault();

        // Get the target element
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Smoothly scroll to the target section
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
