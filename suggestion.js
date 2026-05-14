// Suggestion Modal Functionality
const modal = document.getElementById("suggestionModal");
const suggestBtn = document.getElementById("suggestBtn");
const closeModal = document.querySelector(".close-modal");
const suggestionForm = document.getElementById("suggestionForm");
const suggestionToast = document.getElementById("suggestionToast");

// Open modal
if (suggestBtn) {
  suggestBtn.onclick = function() {
    modal.style.display = "block";
  }
}

// Close modal
if (closeModal) {
  closeModal.onclick = function() {
    modal.style.display = "none";
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle form submission
if (suggestionForm) {
  suggestionForm.onsubmit = async function(e) {
    e.preventDefault();
    
    // Collect suggestion data
    const suggestion = {
      id: Date.now(),
      name: document.getElementById("mirrorName").value,
      url: document.getElementById("mirrorUrl").value,
      description: document.getElementById("mirrorDesc").value,
      packages: document.getElementById("mirrorPackages").value.split(',').map(p => p.trim()),
      submitter: document.getElementById("submitterName").value || "Anonymous",
      email: document.getElementById("submitterEmail").value || "",
      status: "pending",
      submittedAt: new Date().toISOString()
    };
    
    // IMPORTANT: Use the same key as admin panel - "mirrorSuggestions"
    let existingSuggestions = JSON.parse(localStorage.getItem("mirrorSuggestions") || "[]");
    existingSuggestions.push(suggestion);
    localStorage.setItem("mirrorSuggestions", JSON.stringify(existingSuggestions));
    
    // Also keep old key for backward compatibility
    let pendingSuggestions = JSON.parse(localStorage.getItem("pendingMirrorSuggestions") || "[]");
    pendingSuggestions.push(suggestion);
    localStorage.setItem("pendingMirrorSuggestions", JSON.stringify(pendingSuggestions));
    
    // Show success message
    const isFa = document.documentElement.lang === "fa";
    showSuggestionToast(
      isFa
        ? "پیشنهاد شما ثبت شد و بعد از بررسی اضافه می‌شود."
        : "Suggestion submitted for review.",
    );
    
    // Reset form and close modal
    suggestionForm.reset();
    modal.style.display = "none";
  }
}

function showSuggestionToast(message) {
  if (suggestionToast) {
    suggestionToast.textContent = message;
    suggestionToast.classList.add("show");
    setTimeout(() => {
      suggestionToast.classList.remove("show");
    }, 3000);
  }
}

// Add this function to load approved suggestions from admin
function loadApprovedSuggestions() {
  const approvedMirrors = JSON.parse(localStorage.getItem("approvedMirrors") || "[]");
  return approvedMirrors;
}

// Update your mirror loading to include approved suggestions
async function loadAllMirrorsWithSuggestions() {
  try {
    const response = await fetch("mirror.json");
    const data = await response.json();
    const approvedSuggestions = loadApprovedSuggestions();
    
    const allMirrors = [
      ...(data.official_iran_mirrors || []),
      ...(data.global_mirrors || []),
      ...approvedSuggestions
    ];
    
    return allMirrors;
  } catch (error) {
    console.error("Error loading mirrors:", error);
    return [];
  }
}

// Replace your existing mirror loading code
// Find where you load mirrors and replace with:
if (document.getElementById("mirrorCards") && typeof displayMirrors === "function") {
  loadAllMirrorsWithSuggestions().then(allMirrors => {
    window.allMirrors = allMirrors; // Store globally for search
    displayMirrors(allMirrors);
  });
}
