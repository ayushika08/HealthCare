document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeMobileMenu();
  checkForSavedBMI();
});

// Navigation functionality
function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Mobile menu toggle
function initializeMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".nav");

  if (mobileToggle && nav) {
    mobileToggle.addEventListener("click", function () {
      nav.classList.toggle("mobile-active");
      mobileToggle.classList.toggle("active");
    });
  }
}

// Local Storage Functions
function saveBMIData(bmi, category) {
  const bmiData = {
    value: bmi,
    category: category,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("healthcareLastBMI", JSON.stringify(bmiData));

  // Trigger custom event for other pages to listen
  window.dispatchEvent(
    new CustomEvent("bmiCalculated", {
      detail: bmiData,
    })
  );
}

function getLastBMI() {
  const saved = localStorage.getItem("healthcareLastBMI");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // Check if BMI was calculated within last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (new Date(data.timestamp) > thirtyDaysAgo) {
        return data;
      }
    } catch (e) {
      console.error("Error parsing saved BMI data:", e);
    }
  }
  return null;
}

function checkForSavedBMI() {
  const lastBMI = getLastBMI();
  if (lastBMI) {
    // Auto-populate BMI input if exists on current page
    const bmiInput = document.getElementById("bmi-input");
    if (bmiInput && !bmiInput.value) {
      bmiInput.value = lastBMI.value;
    }
  }
}

// Utility Functions
function formatNumber(number, decimals = 1) {
  return parseFloat(number).toFixed(decimals);
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

  // Add styles if not already present
  if (!document.getElementById("notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.innerHTML = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
            }
            
            .notification-info {
                background: #ebf8ff;
                border: 1px solid #bee3f8;
                color: #2b6cb0;
            }
            
            .notification-success {
                background: #f0fff4;
                border: 1px solid #9ae6b4;
                color: #276749;
            }
            
            .notification-error {
                background: #fed7d7;
                border: 1px solid #feb2b2;
                color: #c53030;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(styles);
  }

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Form validation utilities
function validateRequired(input, fieldName) {
  if (!input.value.trim()) {
    showNotification(`${fieldName} is required`, "error");
    input.focus();
    return false;
  }
  return true;
}

function validateNumber(input, fieldName, min = null, max = null) {
  const value = parseFloat(input.value);

  if (isNaN(value)) {
    showNotification(`${fieldName} must be a valid number`, "error");
    input.focus();
    return false;
  }

  if (min !== null && value < min) {
    showNotification(`${fieldName} must be at least ${min}`, "error");
    input.focus();
    return false;
  }

  if (max !== null && value > max) {
    showNotification(`${fieldName} must be at most ${max}`, "error");
    input.focus();
    return false;
  }

  return true;
}

// API utility functions
async function makeAPIRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    showNotification("Network error. Please check your connection and try again.", "error");
    throw error;
  }
}

// Smooth scroll for anchor links
document.addEventListener("click", function (e) {
  const target = e.target;
  if (target.tagName === "A" && target.getAttribute("href").startsWith("#")) {
    e.preventDefault();
    const targetId = target.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Print functionality
function printPage() {
  window.print();
}

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    saveBMIData,
    getLastBMI,
    formatNumber,
    showNotification,
    validateRequired,
    validateNumber,
    makeAPIRequest,
  };
}
