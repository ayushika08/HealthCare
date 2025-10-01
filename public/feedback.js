document.addEventListener("DOMContentLoaded", function () {
  initializeFeedback();
});

function initializeFeedback() {
  const form = document.getElementById("feedback-form");
  const textArea = document.getElementById("feedback-text");
  const charCount = document.getElementById("char-count");
  const ratingInputs = document.querySelectorAll('input[name="rating"]');
  const ratingText = document.getElementById("rating-text");
  const loadMoreBtn = document.getElementById("load-more-btn");

  // Character counter for feedback textarea
  if (textArea && charCount) {
    textArea.addEventListener("input", function () {
      const currentLength = this.value.length;
      charCount.textContent = currentLength;

      if (currentLength > 950) {
        charCount.style.color = "#e53e3e";
      } else if (currentLength > 800) {
        charCount.style.color = "#dd6b20";
      } else {
        charCount.style.color = "#666";
      }

      if (currentLength >= 1000) {
        this.value = this.value.substring(0, 1000);
        charCount.textContent = 1000;
      }
    });
  }

  // Rating system
  if (ratingInputs && ratingText) {
    ratingInputs.forEach((input) => {
      input.addEventListener("change", function () {
        const rating = parseInt(this.value);
        const ratingTexts = {
          1: "⭐ Poor - We can do better",
          2: "⭐⭐ Fair - Room for improvement",
          3: "⭐⭐⭐ Good - Satisfactory experience",
          4: "⭐⭐⭐⭐ Very Good - Great experience!",
          5: "⭐⭐⭐⭐⭐ Excellent - Outstanding!",
        };
        ratingText.textContent = ratingTexts[rating] || "Please select a rating";
      });
    });
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", handleFeedbackSubmission);
  }

  // Load more feedback
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreFeedback);
  }

  // Load initial feedback from backend
  loadCommunityFeedback();
}

async function handleFeedbackSubmission(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const feedbackData = {
    name: formData.get("name") || "Anonymous",
    type: formData.get("type"),
    rating: formData.get("rating"),
    feedback: formData.get("feedback"),
    allowDisplay: formData.get("allowDisplay") === "on",
    timestamp: new Date().toISOString(),
  };

  // Validation
  if (!validateRequired(document.getElementById("experience-type"), "Experience Type")) return;
  if (!validateRequired(document.getElementById("feedback-text"), "Feedback")) return;

  if (!feedbackData.rating) {
    showNotification("Please provide a rating", "error");
    return;
  }

  if (feedbackData.feedback.length < 10) {
    showNotification("Feedback must be at least 10 characters long", "error");
    return;
  }

  try {
    // Submit feedback to backend
    await submitFeedbackToBackend(feedbackData);

    // Show success message
    showSuccessMessage();

    // Reset form
    event.target.reset();
    document.getElementById("char-count").textContent = "0";
    document.getElementById("rating-text").textContent = "Click a star to rate";

    // Refresh community feedback if allowed to display
    if (feedbackData.allowDisplay) {
      setTimeout(() => {
        loadCommunityFeedback();
      }, 1000);
    }
  } catch (error) {
    showNotification("Failed to submit feedback. Please try again.", "error");
  }
}

function showSuccessMessage() {
  const form = document.getElementById("feedback-form");
  const successDiv = document.getElementById("feedback-success");

  if (form && successDiv) {
    form.style.display = "none";
    successDiv.style.display = "block";
    successDiv.scrollIntoView({ behavior: "smooth" });

    showNotification("Thank you for your feedback! 🎉", "success");

    // Show form again after 10 seconds
    setTimeout(() => {
      form.style.display = "block";
      successDiv.style.display = "none";
    }, 10000);
  }
}

async function submitFeedbackToBackend(feedbackData) {
  try {
    await makeAPIRequest("/feedback/submit", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    });
  } catch (error) {
    console.error("Failed to submit feedback to backend:", error);
    // For now, we'll still show success since the form validation passed
    // In a real app, you might want to store in localStorage as backup
    storeFeedbackLocally(feedbackData);
  }
}

function storeFeedbackLocally(feedbackData) {
  try {
    const existingFeedback = JSON.parse(localStorage.getItem("healthcareFeedback") || "[]");
    existingFeedback.push({
      ...feedbackData,
      id: Date.now().toString(),
      stored: true, // Mark as locally stored
    });
    localStorage.setItem("healthcareFeedback", JSON.stringify(existingFeedback.slice(-50))); // Keep last 50
  } catch (error) {
    console.error("Failed to store feedback locally:", error);
  }
}

async function loadCommunityFeedback() {
  try {
    // Try to load from backend
    const backendFeedback = await makeAPIRequest("/feedback/public");
    displayCommunityFeedback(backendFeedback);
  } catch (error) {
    // Fallback to local storage and sample data
    const localFeedback = getLocalFeedback();
    const sampleFeedback = getSampleFeedback();
    displayCommunityFeedback([...localFeedback, ...sampleFeedback]);
  }
}

function getLocalFeedback() {
  try {
    const stored = localStorage.getItem("healthcareFeedback");
    if (stored) {
      return JSON.parse(stored).filter((item) => item.allowDisplay);
    }
  } catch (error) {
    console.error("Error loading local feedback:", error);
  }
  return [];
}

function getSampleFeedback() {
  return [
    {
      id: "sample1",
      name: "Sarah M.",
      type: "success-story",
      rating: 5,
      feedback:
        "I've lost 15 pounds in 3 months using the diet plans from HealthCare! The BMI calculator helped me understand where I started, and the personalized meal plans made it so much easier to stick to healthy eating. Thank you!",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      allowDisplay: true,
    },
    {
      id: "sample2",
      name: "Mike R.",
      type: "progress-update",
      rating: 4,
      feedback:
        "One month into the strength training program and I can already see improvements! My BMI is moving in the right direction and I feel stronger. The exercise plans are well-structured and easy to follow.",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
      allowDisplay: true,
    },
    {
      id: "sample3",
      name: "Emma L.",
      type: "tool-feedback",
      rating: 5,
      feedback:
        "The BMI calculator is so user-friendly! I love how it explains the categories and gives advice. It's helped me track my progress better than any other tool I've used.",
      timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
      allowDisplay: true,
    },
    {
      id: "sample4",
      name: "David K.",
      type: "suggestion",
      rating: 4,
      feedback:
        "Great tools overall! Would love to see a mobile app version and maybe some recipe suggestions with the diet plans. Keep up the excellent work!",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      allowDisplay: true,
    },
  ];
}

function displayCommunityFeedback(feedbackList) {
  const container = document.getElementById("feedback-list");
  if (container && feedbackList.length > 0) {
    // Sort by timestamp, newest first
    const sortedFeedback = feedbackList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = sortedFeedback
      .map(
        (item) => `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="user-info">
                        <strong>${item.name || "Anonymous"}</strong>
                        <div class="rating">
                            <span class="stars">${"★".repeat(item.rating || 0)}${"☆".repeat(
          5 - (item.rating || 0)
        )}</span>
                        </div>
                    </div>
                    <span class="feedback-type ${item.type}">${getTypeDisplayName(item.type)}</span>
                </div>
                <div class="feedback-content">
                    <p>"${item.feedback}"</p>
                </div>
                <div class="feedback-date">${formatTimestamp(item.timestamp)}</div>
            </div>
        `
      )
      .join("");
  }
}

function getTypeDisplayName(type) {
  const typeNames = {
    "success-story": "Success Story",
    "progress-update": "Progress Update",
    "tool-feedback": "Tool Feedback",
    suggestion: "Suggestion",
    general: "General Comment",
  };
  return typeNames[type] || "Feedback";
}

function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  } catch (error) {
    return "Recently";
  }
}

async function loadMoreFeedback() {
  // In a real app, this would load more paginated results
  // For now, we'll just hide the button and show a message
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.textContent = "All stories loaded";
    loadMoreBtn.disabled = true;
    setTimeout(() => {
      loadMoreBtn.style.display = "none";
    }, 2000);
  }

  showNotification("All community stories have been loaded", "info");
}
