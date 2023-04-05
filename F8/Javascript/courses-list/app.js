var listCoursesBlock = document.querySelector('#list-courses');
var courseAPI ='http://localhost:3000/courses';

function start() {
    getCourses(renderCourses);

    handleCreateForm();
}

start();

// Initial setup
displayEditBtn(false);

//Functions
function getCourses(callback) {
    fetch(courseAPI)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

function createCourse(data, callback) {
    var options = { //Search for using fetch
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(courseAPI, options)
        .then(function(response) {
            response.json();
        })
        .then(callback);
}

function handleDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(courseAPI + '/' + id, options)
        .then(function(response) {
            response.json();
        })
        .then(function() {
            var courseItem = document.querySelector('.course-item-' + id);
            if (courseItem) {
                courseItem.remove();
            }
        });
}

// https://codepen.io/nguyn-tn-pha/pen/bGxrBzE
function handleUpdateCourse(id) {
    // Lấy data từ existing course
    var courseToUpdate = document.querySelector('.course-item-' + id);
    if (courseToUpdate) {
        // In data vào input field
        oldCourseName = courseToUpdate.querySelector('h4').textContent;
        oldCourseDescription = courseToUpdate.querySelector('p').textContent;

        //Dán old data vào input
        var name = document.querySelector('input[name="name"]');
        var description = document.querySelector('input[name="description"]');
        name.value = oldCourseName;
        description.value = oldCourseDescription;
        console.log(name + " " + description);
        getCourses(renderCourses);
    }

    

    //Hiện nút lưu bên dưới

    //Khi nhấn vào nút lưu sẽ thực hiện lưu data
}

// function editCourse() {
//     var options = { //Search for using fetch
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     };
//     fetch(courseAPI + '/' + id, options)
//         .then(function(response) {
//             response.json();
//         })
//         .then(function() {
//             var updateBtn = document.querySelector(".update");

//             updateBtn.onlick = function() {
//                 //

//             }
//         });
// }

function displayEditBtn(isDisplayed) {
    var confirmUpdateBtn = document.querySelector("#confirm-update");
    if (isDisplayed) {
        confirmUpdateBtn.style.display = "block";
    } else {
        confirmUpdateBtn.style.display = "none";
    }
}

function renderCourses(courses) {
    var listCoursesBlock = document.querySelector('#list-courses');
    var htmls = courses.map(function(course) {
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name}</h4>
                <p>${course.description}</p>
                <button onclick="handleDeleteCourse(${course.id})">Xóa</button>
                <button class="update" onclick="handleUpdateCourse(${course.id})">Chỉnh sửa</button>
            </li>
        `;
    });
    listCoursesBlock.innerHTML = htmls.join('');
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create');

    createBtn.onclick = function() {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;

        var formData = {
            name: name,
            description: description
        };

        createCourse(formData, function() {
            getCourses(renderCourses);
        });
    }
}