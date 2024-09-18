const currentYear = new Date().getFullYear();
document.getElementById("currentYear").textContent = `${currentYear}`;

// List of variables
const heroList = document.getElementById("list");
const arrowUp = document.getElementById("arrowUp");
const arrowDown = document.getElementById("arrowDown");
const loader = document.getElementById("loader");
const content = document.getElementById("content");
const errorMessage = document.getElementById("error-message");
let lastScrollTop = 0;

// Utils
function getName(fullName) {
  const regex = /^(.+?)(?:\s+\d-Year|\s+\d-Device|\s+\d+\/\d+|\/|$)/;
  const match = fullName.match(regex);
  return match ? match[1].trim() : fullName.trim();
}

function getLicensePeriod(licenseName) {
  if (licenseName.includes("Year")) {
    return "Per Year";
  }
  return "MO";
}
async function fetchData() {
  try {
    const response = await fetch("https://veryfast.io/t/front_test_api.php");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.result.elements;
  } catch (error) {
    return error;
  }
}

function unhideArrowBlock() {
  heroList.addEventListener("click", (event) => {
    if (event.target && event.target.closest(".hero__button")) {
      setTimeout(() => {
        const browser = detectBrowser();
        if (browser === "Microsoft Edge" || browser === "Chrome") {
          arrowDown.classList.add("visible");
        } else {
          arrowUp.classList.add("visible");
        }
      }, 1500);
    }
  });
}
function detectBrowser() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Edg")) {
    return "Microsoft Edge";
  } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    return "Chrome";
  }
}
// List code
function getList(array) {
  array.forEach((item) => {
    const li = document.createElement("li");
    li.className = "hero__item";
    li.innerHTML = `
         <div class="hero__price-block">
        <div class="hero__bestPrice" style="display: ${
          item.is_best ? "block" : "none"
        }">Best value</div>
        <div class="hero__discount" style="display: ${
          item.price_key.includes("%") ? "block" : "none"
        }"><span class="hero__discount-rate">${item.price_key}</span></div>
        <p class ="hero__price-details">
        <span class="hero__item-amount">${item.amount}</span> 
        <span class="hero__item-licensePeriod">/${getLicensePeriod(
          item.license_name
        )}</span>  
        </p>      
        </div>
         <div class="hero__text">
         <p>${getName(item.name_display)}</p>
         <p class="hero__text-licence">${item.license_name}</p>
         </div>
          <a class="hero__button" href="${item.link}">
            <span class="hero__button-text">download</span>
            <div class="hero__button-img"></div>
          </a>
        `;

    heroList.appendChild(li);
  });
}

async function loadData() {
  loader.style.display = "block";
  content.style.display = "none";

  const resultData = await fetchData();
  if (resultData) {
    getList(resultData);
    loader.style.display = "none";
    content.style.display = "block";
    unhideArrowBlock();
  } else {
    loader.style.display = "none";
    errorMessage.style.display = "block";
  }
}

loadData();
detectBrowser();
