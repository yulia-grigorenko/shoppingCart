// Variables--------------------------------------------------------------------
const courses = document.querySelector('#courses-list');
const shoppingCartContent = document.querySelector('#cart-content tbody');
const clearBtn = document.querySelector('#clear-cart');

// LoadEventListeners-----------------------------------------------------------
function LoadEventListeners() {

  // When new course is added
  courses.addEventListener('click', buyCourse);

  // When the remove button is clicked
  shoppingCartContent.addEventListener('click', removeCourse);

  // When the clearBtn button is clicked
  clearBtn.addEventListener('click', clearCart);

  // Document ready
  document.addEventListener('DOMContentLoaded', getFromLocalStorage);
}

// Functions--------------------------------------------------------------------

function buyCourse(e) {

    e.preventDefault();
    // Use delegation to find the course that was added
    if(e.target.classList.contains('add-to-cart')) {
      const course = e.target.parentElement.parentElement;
      // read the value
      getCourseInfo(course);
    }
}

// Reads the HTML information of the selected course
function getCourseInfo(course) {

    // Create an Object with Course data
    const courseInfo = {
      image: course.querySelector('img').src,
      title: course.querySelector('h4').textContent,
      price: course.querySelector('.price span').textContent,
      id: course.querySelector('a').getAttribute('data-id')
    };
    // Insert into the shopping cart
    addIntoCart(courseInfo);
}

// Display the selected course into the shopping cart
function addIntoCart (course) {

    // create a <tr>
    const row = document.createElement('tr');

    // Build the template
    row.innerHTML =
    `  <tr>
        <td><img src="${course.image}" width='100'></td>
        <td>${course.title}</td>
        <td>${course.price}</td>
        <td><a href='#' class ='remove' data-id='${course.id}'>X</a></td>
      </tr>
    `;
    shoppingCartContent.appendChild(row);

    //Add course into Storage
    saveIntoStorage(course);
}

function saveIntoStorage(course) {

    let courses = getCoursesFromStorage();

    // Add the course into the array
    courses.push(course);

    // Since localstorage only savas strings, we need to convert JSON into string
    localStorage.setItem('courses', JSON.stringify(courses));
}

function getCoursesFromStorage() {

    let courses;

    // If something is in the storage we get the value, or create an empty array
    if(localStorage.getItem('courses') === null) {
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem('courses'));
    }
    return courses;
}

// Remove course from the DOM
function removeCourse(e) {

    let course, courseID;

    // Remove course from the DOM
    if(e.target.classList.contains('remove')){

      course = e.target.parentElement.parentElement;
      course.remove();
    }
    courseID = course.querySelector('a').getAttribute('data-id');

    // Remove course from the localStorage
    removeCourseLocalStorage(courseID);
}

// Remove course from the localStorage
function removeCourseLocalStorage(id) {

    // Get the localStorage data
    let coursesLS = getCoursesFromStorage();

    // Loop throught the array and find the index to remove
    coursesLS.forEach(function(courseLS, index) {
      if(courseLS.id === id) {
        coursesLS.splice(index, 1);
      }
    });

    // Add the rest of the array
    localStorage.setItem('courses', JSON.stringify(coursesLS));
}


// Clear the shClearCartping cart
function clearCart() {

    // shoppingCartContent.innerHTML = '';
    localStorage.clear();
    while (shoppingCartContent.firstChild) {
      shoppingCartContent.removeChild(shoppingCartContent.firstChild);
    }
}

function getFromLocalStorage() {

    let coursesLS = getCoursesFromStorage();

    // Loop throught the courses and print into the cart
    coursesLS.forEach(function(course) {
      // Create the <tr>
      const row = document.createElement('tr');

      // Build the template
      row.innerHTML =
      `  <tr>
          <td><img src="${course.image}" width='100'></td>
          <td>${course.title}</td>
          <td>${course.price}</td>
          <td><a href='#' class ='remove' data-id='${course.id}'>X</a></td>
        </tr>
      `;
      shoppingCartContent.appendChild(row);
    });
}

//init app----------------------------------------------------------------------
LoadEventListeners();
