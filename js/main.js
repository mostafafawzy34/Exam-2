const sideNav = document.getElementById('sideNav');
const mealsContainer = document.getElementById('mealsContainer');

function toggleNav() {
  sideNav.classList.toggle('open');
}

function closeNav() {
  sideNav.classList.remove('open');
}

function removeSearchBar() {
  const existingSearchBar = document.querySelector('.custom-search-bar');
  if (existingSearchBar) {
    existingSearchBar.remove();
  }
}

async function fetchMeals(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.meals ? data.meals.slice(0, 20) : [];
}

function displayMeals(meals) {
  mealsContainer.innerHTML = '';
  meals.forEach(meal => {
    mealsContainer.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div onclick="getMealDetails && getMealDetails('${meal.idMeal || ''}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid w-100 rounded"/>
          <div class="meal-layer position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-black bg-white bg-opacity-75">
            <h3 class="text-center m-0">${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  });
}

async function loadInitialMeals() {
  const meals = await fetchMeals('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  displayMeals(meals);
}

async function getMealDetails(mealId) {
  removeSearchBar();
  closeNav(); 

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await res.json();
  const meal = data.meals[0];

  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients += `<li class="btn btn-info m-2">${measure} ${ingredient}</li>`;
    }
  }

  let tags = '';
  if (meal.strTags) {
    tags = meal.strTags.split(',').map(tag =>
      `<li class="btn btn-light text-black border m-2">${tag}</li>`
    ).join('');
  }

  mealsContainer.innerHTML = `
    <div class="col-md-4 text-white">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100 rounded-3"/>
      <h2 class="my-3">${meal.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="fw-bold">Area</span> : ${meal.strArea}</h3>
      <h3><span class="fw-bold">Category</span> : ${meal.strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="list-unstyled d-flex flex-wrap">${ingredients}</ul>
      <h3>Tags :</h3>
      <ul class="list-unstyled d-flex flex-wrap">${tags}</ul>
      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
  `;
}

async function getCategories() {
  removeSearchBar();
  closeNav();
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await res.json();

  mealsContainer.innerHTML = '';
  data.categories.forEach(cat => {
    mealsContainer.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div onclick="getMealsByCategory('${cat.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}" class="img-fluid w-100 rounded"/>
          <div class="meal-layer position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-black bg-white bg-opacity-75">
            <h3 class="text-center m-0">${cat.strCategory}</h3>
          </div>
        </div>
      </div>
    `;
  });
}

async function getMealsByCategory(category) {
  removeSearchBar();
  closeNav();
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await res.json();
  displayMeals(data.meals || []);
}

async function getAreas() {
  removeSearchBar();
  closeNav();
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const data = await res.json();

  mealsContainer.innerHTML = '';
  data.meals.forEach(area => {
    mealsContainer.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div onclick="getMealsByArea('${area.strArea}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
        <img src="../Exam2/images /area.jpg" alt="${area.strArea}" class="img-fluid w-100 rounded"/>
          <div class="meal-layer position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-black bg-white bg-opacity-75">
            <h3 class="text-center m-0">${area.strArea}</h3>
          </div>
        </div>
      </div>
    `;
  });
}

async function getMealsByArea(area) {
  removeSearchBar();
  closeNav();
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  const data = await res.json();
  displayMeals(data.meals || []);
}

async function getIngredients() {
  removeSearchBar();
  closeNav();
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
  const data = await res.json();

  mealsContainer.innerHTML = '';
  data.meals.slice(0, 20).forEach(ingredient => {
    mealsContainer.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div onclick="getMealsByIngredient('${ingredient.strIngredient}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
        <img src="../Exam2/images /ingredients.jpg" alt="${ingredient.strIngredient}" class="img-fluid w-100 rounded"/>
          <div class="meal-layer position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-black bg-white bg-opacity-75">
            <h3 class="text-center m-0">${ingredient.strIngredient}</h3>
          </div>
        </div>
      </div>
    `;
  });
}

async function getMealsByIngredient(ingredient) {
  removeSearchBar();
  closeNav();
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await res.json();
  displayMeals(data.meals || []);
}

function showSearch() {
  removeSearchBar();
  closeNav();

  const searchContainer = document.createElement('div');
  searchContainer.className = 'custom-search-bar w-75 d-flex justify-content-center gap-3 py-4';
  searchContainer.style.backgroundColor = 'black';
  document.body.style.backgroundColor = 'black';
  document.body.style.color = 'white'; 

  const searchByNameInput = document.createElement('input');
  searchByNameInput.className = 'form-control bg-white text-dark border border-1 border-secondary rounded';
  searchByNameInput.placeholder = 'Search By Name';
  searchByNameInput.setAttribute('onkeyup', 'searchByName(this.value)');

  const searchByLetterInput = document.createElement('input');
  searchByLetterInput.className = 'form-control bg-white text-dark border border-1 border-secondary rounded';
  searchByLetterInput.placeholder = 'Search By First Letter';
  searchByLetterInput.maxLength = 1;
  searchByLetterInput.setAttribute('onkeyup', 'searchByLetter(this.value)');

  searchContainer.appendChild(searchByNameInput);
  searchContainer.appendChild(searchByLetterInput);

  if (mealsContainer && mealsContainer.parentNode) {
    mealsContainer.parentNode.insertBefore(searchContainer, mealsContainer);
  } else {
    document.body.prepend(searchContainer);
  }

  mealsContainer.innerHTML = '';
}

async function searchByName(name) {
  const meals = await fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  displayMeals(meals);
}

async function searchByLetter(letter) {
  const meals = await fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  displayMeals(meals);
}

function showContactForm() {
  removeSearchBar();
  closeNav();

  mealsContainer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh; background-color: #0D0D0D;">
      <form class="w-75 text-white" id="contactForm">
        <div class="row g-3">
          <!-- Column 1 -->
          <div class="col-md-6">
            <input type="text" id="nameInput" class="form-control" placeholder="Enter Your Name" />
            <div id="nameAlert" class="d-none text-danger">Please enter a valid name.</div>

            <input type="text" id="phoneInput" class="form-control mt-3" placeholder="Enter Your Phone" />
            <div id="phoneAlert" class="d-none text-danger">Please enter a valid phone number (10 digits).</div>

            <input type="password" id="passwordInput" class="form-control mt-3" placeholder="Enter Your Password" />
            <div id="passwordAlert" class="d-none text-danger">Password must contain at least one letter, one number, and be at least 8 characters long.</div>
          </div>

          <!-- Column 2 -->
          <div class="col-md-6">
            <input type="email" id="emailInput" class="form-control" placeholder="Enter Your Email" />
            <div id="emailAlert" class="d-none text-danger">Please enter a valid email.</div>

            <input type="number" id="ageInput" class="form-control mt-3" placeholder="Enter Your Age" />
            <div id="ageAlert" class="d-none text-danger">Please enter a valid age (between 18 and 120).</div>

            <input type="password" id="repasswordInput" class="form-control mt-3" placeholder="Repassword" />
            <div id="repasswordAlert" class="d-none text-danger">Passwords do not match.</div>
          </div>
        </div>

        <div class="mt-4 text-center">
          <button type="submit" id="submitBtn" class="btn btn-outline-danger px-5" disabled>Submit</button>
        </div>
      </form>
    </div>
  `;

  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('contactForm');
  form.addEventListener('input', validateForm);

  function validateForm() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const ageInput = document.getElementById('ageInput');
    const passwordInput = document.getElementById('passwordInput');
    const repasswordInput = document.getElementById('repasswordInput');

    const nameValid = /^[A-Za-z\s]+$/.test(nameInput.value);
    const emailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(emailInput.value);
    const phoneValid = /^[0-9]{10}$/.test(phoneInput.value);
    const ageValid = ageInput.value >= 18 && ageInput.value <= 120;
    const passwordValid = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(passwordInput.value);
    const repasswordValid = passwordInput.value === repasswordInput.value;

    document.getElementById('nameAlert').classList.toggle('d-none', nameValid);
    document.getElementById('emailAlert').classList.toggle('d-none', emailValid);
    document.getElementById('phoneAlert').classList.toggle('d-none', phoneValid);
    document.getElementById('ageAlert').classList.toggle('d-none', ageValid);
    document.getElementById('passwordAlert').classList.toggle('d-none', passwordValid);
    document.getElementById('repasswordAlert').classList.toggle('d-none', repasswordValid);

    submitBtn.disabled = !(nameValid && emailValid && phoneValid && ageValid && passwordValid && repasswordValid);
  }
}

loadInitialMeals();
