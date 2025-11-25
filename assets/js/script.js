document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContent Loaded');
    
    // Smooth navbar animation on scroll
    const navbar = document.querySelector('.site-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Hide/show navbar on scroll direction (optional)
        if (currentScroll > lastScroll && currentScroll > 150) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Search Toggle
    const searchToggle = document.getElementById('searchToggle');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const searchClose = document.getElementById('searchClose');
    const mainSearchInput = document.getElementById('mainSearchInput');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', function() {
            searchBarContainer.classList.add('active');
            mainSearchInput.focus();
        });
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchBarContainer.classList.remove('active');
            mainSearchInput.value = '';
        });
    }
    
    // Close search on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchBarContainer.classList.contains('active')) {
            searchBarContainer.classList.remove('active');
            mainSearchInput.value = '';
        }
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeText = document.getElementById('darkModeText');
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeText) {
            darkModeText.textContent = 'Lichte modus';
        }
    }
    
    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                darkModeText.textContent = 'Lichte modus';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                darkModeText.textContent = 'Donkere modus';
            }
        });
    }
    
    // Category Navigation Scroll
    const categoryNav = document.querySelector('.category-nav');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    if (scrollRightBtn && categoryNav) {
        scrollRightBtn.addEventListener('click', function() {
            categoryNav.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });
    }

    // Match Filter
    const filterLinks = document.querySelectorAll('#matchFilter .nav-link');
    const matchCards = document.querySelectorAll('.match-card-modern');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter matches
            matchCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-status') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
});