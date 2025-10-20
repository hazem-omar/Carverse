// Carverse JavaScript Functions

// Sample Car Data
const carsData = [
  {
    id: 1,
    name: "BMW X5 2024",
    description: "Luxury SUV with premium features",
    price: 89999,
    year: 2024,
    mileage: "0 miles",
    color: "red",
    image: "fas fa-car",
    features: ["Navigation", "Leather Seats", "Sunroof", "AWD"],
  },
  {
    id: 2,
    name: "Mercedes C-Class 2023",
    description: "Elegant sedan with cutting-edge technology",
    price: 65000,
    year: 2023,
    mileage: "5K miles",
    color: "blue",
    image: "fas fa-car",
    features: ["Premium Audio", "Heated Seats", "Parking Assist"],
  },
  {
    id: 3,
    name: "Toyota Camry 2023",
    description: "Reliable and fuel-efficient sedan",
    price: 28500,
    year: 2023,
    mileage: "12K miles",
    color: "green",
    image: "fas fa-car",
    features: ["Backup Camera", "Bluetooth", "Cruise Control"],
  },
  {
    id: 4,
    name: "Audi Q7 2024",
    description: "Premium SUV with advanced safety features",
    price: 78000,
    year: 2024,
    mileage: "2K miles",
    color: "purple",
    image: "fas fa-car",
    features: ["Virtual Cockpit", "Matrix LED", "Air Suspension"],
  },
  {
    id: 5,
    name: "Honda Accord 2023",
    description: "Spacious family sedan with excellent fuel economy",
    price: 32000,
    year: 2023,
    mileage: "8K miles",
    color: "gray",
    image: "fas fa-car",
    features: ["Lane Assist", "Adaptive Cruise", "Wireless Charging"],
  },
  {
    id: 6,
    name: "Ford Mustang 2024",
    description: "Iconic sports car with powerful performance",
    price: 45000,
    year: 2024,
    mileage: "1K miles",
    color: "orange",
    image: "fas fa-car",
    features: ["V8 Engine", "Sport Mode", "Premium Sound"],
  },
];

// DOM Elements
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const carsContainer = document.getElementById("cars-container");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector("nav");

// Initialize App
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  setupMobileMenu();
  setupSmoothScrolling();
  setupScrollEffects();
  renderCars();
  setupButtonEvents();
  setupAnimations();
}

// Mobile Menu Toggle
function setupMobileMenu() {
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");

      // Toggle hamburger icon
      const icon = mobileMenuBtn.querySelector("i");
      if (mobileMenu.classList.contains("hidden")) {
        icon.className = "fas fa-bars text-2xl";
      } else {
        icon.className = "fas fa-times text-2xl";
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.add("hidden");
        const icon = mobileMenuBtn.querySelector("i");
        icon.className = "fas fa-bars text-2xl";
      }
    });
  }
}

// Smooth Scrolling
function setupSmoothScrolling() {
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
          const icon = mobileMenuBtn.querySelector("i");
          icon.className = "fas fa-bars text-2xl";
        }

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Scroll Effects
function setupScrollEffects() {
  window.addEventListener("scroll", function () {
    // Navbar shadow effect
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("shadow-xl");
      } else {
        navbar.classList.remove("shadow-xl");
      }
    }

    // Fade in animations
    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("visible");
      }
    });
  });
}

// Render Cars
function renderCars(cars = carsData) {
  if (!carsContainer) return;

  carsContainer.innerHTML = "";

  cars.forEach((car) => {
    const carCard = createCarCard(car);
    carsContainer.appendChild(carCard);
  });
}

// Create Car Card
function createCarCard(car) {
  const cardElement = document.createElement("div");
  cardElement.className =
    "car-card bg-white rounded-xl shadow-md overflow-hidden fade-in";
  cardElement.setAttribute("data-car-id", car.id);

  const colorClasses = {
    red: "from-red-400 to-red-600",
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    purple: "from-purple-400 to-purple-600",
    gray: "from-gray-400 to-gray-600",
    orange: "from-orange-400 to-orange-600",
  };

  cardElement.innerHTML = `
        <div class="car-image h-48 bg-gradient-to-r ${
          colorClasses[car.color]
        } flex items-center justify-center">
            <i class="${car.image} text-white text-6xl"></i>
        </div>
        <div class="p-6">
            <h3 class="text-xl font-bold mb-2">${car.name}</h3>
            <p class="text-gray-600 mb-4">${car.description}</p>
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-blue-600">${car.price.toLocaleString()}</span>
                <span class="text-sm text-gray-500">${car.year} • ${
    car.mileage
  }</span>
            </div>
            <div class="mb-4">
                <div class="flex flex-wrap gap-1">
                    ${car.features
                      .slice(0, 2)
                      .map(
                        (feature) =>
                          `<span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${feature}</span>`
                      )
                      .join("")}
                </div>
            </div>
            <div class="flex gap-2">
                <button class="view-details-btn flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors" data-car-id="${
                  car.id
                }">
                    View Details
                </button>
                <button class="wishlist-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-car-id="${
                  car.id
                }">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;

  return cardElement;
}

// Button Events
function setupButtonEvents() {
  // Browse Cars Button
  const browseCarsBtn = document.querySelector(".browse-cars-btn");
  if (browseCarsBtn) {
    browseCarsBtn.addEventListener("click", function () {
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Loan Calculator Button
  const loanCalcBtn = document.querySelector(".loan-calc-btn");
  if (loanCalcBtn) {
    loanCalcBtn.addEventListener("click", function () {
      openLoanCalculator();
    });
  }

  // Sign In Buttons
  const signInBtns = document.querySelectorAll(".signin-btn");
  signInBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      showSignInModal();
    });
  });

  // Car Card Events (Event Delegation)
  document.addEventListener("click", function (e) {
    if (
      e.target.matches(".view-details-btn") ||
      e.target.closest(".view-details-btn")
    ) {
      const carId =
        e.target.getAttribute("data-car-id") ||
        e.target.closest(".view-details-btn").getAttribute("data-car-id");
      showCarDetails(carId);
    }

    if (
      e.target.matches(".wishlist-btn") ||
      e.target.closest(".wishlist-btn")
    ) {
      const carId =
        e.target.getAttribute("data-car-id") ||
        e.target.closest(".wishlist-btn").getAttribute("data-car-id");
      toggleWishlist(carId, e.target);
    }
  });
}

// Car Details Modal
function showCarDetails(carId) {
  const car = carsData.find((c) => c.id == carId);
  if (!car) return;

  const modal = createModal(`
        <div class="max-w-2xl mx-auto bg-white rounded-xl p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-800">${car.name}</h2>
                <button class="close-modal text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <div class="h-64 bg-gradient-to-r from-${
                      car.color
                    }-400 to-${
    car.color
  }-600 flex items-center justify-center rounded-lg mb-4">
                        <i class="${car.image} text-white text-8xl"></i>
                    </div>
                </div>
                
                <div>
                    <p class="text-gray-600 mb-4">${car.description}</p>
                    
                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between">
                            <span class="font-semibold">Price:</span>
                            <span class="text-blue-600 font-bold text-xl">${car.price.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Year:</span>
                            <span>${car.year}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Mileage:</span>
                            <span>${car.mileage}</span>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <h4 class="font-semibold mb-2">Features:</h4>
                        <div class="flex flex-wrap gap-2">
                            ${car.features
                              .map(
                                (feature) =>
                                  `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${feature}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                    
                    <div class="flex gap-3">
                        <button class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-credit-card mr-2"></i>
                            Buy Now
                        </button>
                        <button class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-calculator mr-2"></i>
                            Financing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);

  document.body.appendChild(modal);
}

// Wishlist Toggle
function toggleWishlist(carId, button) {
  const heart = button.querySelector("i") || button;
  const isWishlisted = heart.classList.contains("fas");

  if (isWishlisted) {
    heart.className = "far fa-heart";
    button.style.color = "#6b7280";
    showNotification("Removed from wishlist", "info");
  } else {
    heart.className = "fas fa-heart";
    button.style.color = "#ef4444";
    showNotification("Added to wishlist!", "success");
  }

  // Add animation
  button.style.transform = "scale(1.2)";
  setTimeout(() => {
    button.style.transform = "scale(1)";
  }, 200);
}

// Loan Calculator
function openLoanCalculator() {
  const modal = createModal(`
        <div class="max-w-md mx-auto bg-white rounded-xl p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Loan Calculator</h2>
                <button class="close-modal text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form id="loan-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Car Price ($)</label>
                    <input type="number" id="car-price" class="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="50000" value="50000">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
                    <input type="number" id="down-payment" class="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="10000" value="10000">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                    <input type="number" id="interest-rate" class="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="5" value="5" step="0.1">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
                    <select id="loan-term" class="w-full border border-gray-300 rounded-lg px-4 py-2">
                        <option value="3">3 Years</option>
                        <option value="4">4 Years</option>
                        <option value="5" selected>5 Years</option>
                        <option value="6">6 Years</option>
                        <option value="7">7 Years</option>
                    </select>
                </div>
                
                <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Calculate Payment
                </button>
            </form>
            
            <div id="loan-result" class="mt-6 p-4 bg-gray-50 rounded-lg hidden">
                <h3 class="font-semibold mb-2">Monthly Payment:</h3>
                <p class="text-2xl font-bold text-blue-600" id="monthly-payment">$0</p>
                <div class="mt-3 text-sm text-gray-600">
                    <p>Total Amount: <span id="total-amount">$0</span></p>
                    <p>Total Interest: <span id="total-interest">$0</span></p>
                </div>
            </div>
        </div>
    `);

  document.body.appendChild(modal);

  // Loan calculation logic
  document.getElementById("loan-form").addEventListener("submit", function (e) {
    e.preventDefault();
    calculateLoan();
  });
}

// Calculate Loan
function calculateLoan() {
  const carPrice = parseFloat(document.getElementById("car-price").value);
  const downPayment = parseFloat(document.getElementById("down-payment").value);
  const interestRate =
    parseFloat(document.getElementById("interest-rate").value) / 100 / 12;
  const loanTerm = parseInt(document.getElementById("loan-term").value) * 12;

  const principal = carPrice - downPayment;
  const monthlyPayment =
    (principal * (interestRate * Math.pow(1 + interestRate, loanTerm))) /
    (Math.pow(1 + interestRate, loanTerm) - 1);
  const totalAmount = monthlyPayment * loanTerm;
  const totalInterest = totalAmount - principal;

  document.getElementById(
    "monthly-payment"
  ).textContent = `${monthlyPayment.toFixed(2)}`;
  document.getElementById("total-amount").textContent = `${totalAmount.toFixed(
    2
  )}`;
  document.getElementById(
    "total-interest"
  ).textContent = `${totalInterest.toFixed(2)}`;
  document.getElementById("loan-result").classList.remove("hidden");
}

// Sign In Modal
function showSignInModal() {
  const modal = createModal(`
        <div class="max-w-md mx-auto bg-white rounded-xl p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Sign In</h2>
                <button class="close-modal text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="your@email.com">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" class="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="••••••••">
                </div>
                
                <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Sign In
                </button>
                
                <div class="text-center">
                    <a href="#" class="text-blue-600 hover:underline">Forgot Password?</a>
                </div>
                
                <div class="text-center text-gray-600">
                    Don't have an account? <a href="#" class="text-blue-600 hover:underline">Sign Up</a>
                </div>
            </form>
        </div>
    `);

  document.body.appendChild(modal);
}

// Create Modal
function createModal(content) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  modal.innerHTML = content;

  // Close modal events
  modal.addEventListener("click", function (e) {
    if (
      e.target === modal ||
      e.target.matches(".close-modal") ||
      e.target.closest(".close-modal")
    ) {
      document.body.removeChild(modal);
    }
  });

  return modal;
}

// Show Notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full`;
  notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${
              type === "success" ? "check" : type === "error" ? "times" : "info"
            } mr-2"></i>
            ${message}
        </div>
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(full)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Setup Animations
function setupAnimations() {
  // Add fade-in class to elements
  const animatedElements = document.querySelectorAll(
    ".feature-card, .car-card, .contact-card"
  );
  animatedElements.forEach((element) => {
    element.classList.add("fade-in");
  });

  // Trigger initial scroll check
  window.dispatchEvent(new Event("scroll"));
}

// Search Functionality (for future use)
function searchCars(query) {
  const filteredCars = carsData.filter(
    (car) =>
      car.name.toLowerCase().includes(query.toLowerCase()) ||
      car.description.toLowerCase().includes(query.toLowerCase())
  );
  renderCars(filteredCars);
}

// Filter Cars (for future use)
function filterCars(filters) {
  let filteredCars = [...carsData];

  if (filters.minPrice) {
    filteredCars = filteredCars.filter((car) => car.price >= filters.minPrice);
  }

  if (filters.maxPrice) {
    filteredCars = filteredCars.filter((car) => car.price <= filters.maxPrice);
  }

  if (filters.year) {
    filteredCars = filteredCars.filter((car) => car.year >= filters.year);
  }

  renderCars(filteredCars);
}

// Export functions for global use
window.CarverseApp = {
  searchCars,
  filterCars,
  showCarDetails,
  openLoanCalculator,
  showSignInModal,
};
