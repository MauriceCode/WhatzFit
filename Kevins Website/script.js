document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollToPlugin);

    // Smooth Scroll for Navigation
    document.querySelectorAll("nav ul li a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            let targetId = this.getAttribute("href");

            gsap.to(window, {
                duration: 0.3,
                scrollTo: { y: targetId, offsetY: 50 },
                ease: "power2.out"
            });

            // Reset hero video when clicking "Home"
            if (targetId === "#home") {
                setTimeout(resetHeroVideo, 500); // Delay reset for smooth transition
            }
        });
    });

    // Portfolio Video & Navigation
    const heroVideo = document.getElementById("hero-video");
    const closePortfolioBtn = document.getElementById("close-video");
    const projectNameDisplay = document.getElementById("project-name");
    const portfolioNavItems = document.querySelectorAll(".portfolio-nav li");

    let currentIndex = 0; // Keep track of the current video index
    let autoScrollTimeout; // Store timeout reference for auto-scroll

    // Store the original hero video source
    const originalVideoSrc = heroVideo.querySelector("source").src;

    // Portfolio Item Click Event
    portfolioNavItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            currentIndex = index; // Update the current index
            loadVideo(index);
        });
    });

    // Function to Load Video into Hero Section
    function loadVideo(index) {
        clearTimeout(autoScrollTimeout); // Prevent multiple auto-scroll timers

        let videoSrc = portfolioNavItems[index].getAttribute("data-video");
        let projectName = portfolioNavItems[index].getAttribute("data-name");

        // Replace hero section video source 
        heroVideo.pause();
        heroVideo.innerHTML = `
            <source src="${videoSrc}" type="video/mp4">
            Your browser does not support the video tag.
        `;
        heroVideo.load();
        
        heroVideo.oncanplay = () => {
            heroVideo.play();
        };

        // Update the project name display
        projectNameDisplay.textContent = projectName;

        // Highlight the active dot
        highlightActiveDot(index);

        // Get video duration and set auto-scroll timer
        heroVideo.onloadedmetadata = function () {
            let duration = heroVideo.duration;
            autoScrollToNextVideo(duration);
        };

        // Show close button when a portfolio video is active
        heroVideo.classList.add("video-active");
        closePortfolioBtn.style.display = "block";

        // Hide close button when navigating away from hero section
        checkHeroVisibility();
    }

    // Function to Auto-Scroll to Next Video
    function autoScrollToNextVideo(duration) {
        autoScrollTimeout = setTimeout(function () {
            currentIndex = (currentIndex + 1) % portfolioNavItems.length; // Loop back to first video
            loadVideo(currentIndex);
        }, duration * 1000); // Convert seconds to milliseconds
    }

    // Function to Reset to Hero Video
    function resetHeroVideo() {
        clearTimeout(autoScrollTimeout); // Stop auto-scroll
        heroVideo.pause();
        heroVideo.innerHTML = `
            <source src="${originalVideoSrc}" type="video/mp4">
            Your browser does not support the video tag.
        `;
        heroVideo.load();
        
        heroVideo.oncanplay = () => {
            heroVideo.play();
        };

        projectNameDisplay.textContent = ""; // Clear project name
        highlightActiveDot(-1); // Remove active highlight
        closePortfolioBtn.style.display = "none"; // Hide close button
    }

    // Close Portfolio Video & Return to Hero Video
    closePortfolioBtn.addEventListener("click", function () {
        // Reset the hero video to its original state
        heroVideo.innerHTML = `
            <source src="15pm_quality.mp4" type="video/mp4">
            Your browser does not support the video tag.
        `;
        heroVideo.load();
        heroVideo.play();
    
        // Hide close button
        closePortfolioBtn.style.display = "none";
    
        // Remove the active class from the hero section
        heroVideo.classList.remove("video-active");
    });

    // Function to Highlight Active Dot in Navigation
    function highlightActiveDot(index) {
        portfolioNavItems.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    // Check if Hero Section is in View and Set Button Visibility
    function checkHeroVisibility() {
        const heroSection = document.getElementById("hero-section");
        const rect = heroSection.getBoundingClientRect();

        // If the hero section is out of view, hide the close button
        if (rect.top > window.innerHeight || rect.bottom < 0) {
            closePortfolioBtn.style.display = "none";
        } else {
            closePortfolioBtn.style.display = "block";
        }
    }

    // Listen to scroll events to detect when the hero section is out of view
    window.addEventListener('scroll', function () {
        checkHeroVisibility();
    });

    document.getElementById("contact-form").addEventListener("submit", function(event) {
        event.preventDefault();
        fetch("https://script.google.com/macros/s/AKfycbympWGYwW7nEgp0YOzZnrmnYQ7GwQ46WsLjUp8Uys237L0IUzN0EjroqsCIHuPOav4Y/exec", {
            method: "POST",
            mode: "no-cors",
            body: new FormData(this)
        })
        .then(response => response.text())
        .then(data => alert("Data saved!"))
        .catch(error => console.error("Error:", error()))
    });

});
