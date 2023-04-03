var courses = ['HTML & CSS', 'Javascript', 'PHP', 'Java']

function render(courses) {
    var coursesArray = courses.map(function(course) {
        return `<li>${course}</li>`;
    });
    var coursesString = coursesArray.join('');
    var coursesList = document.querySelector('.courses-list');
    coursesList.innerHTML = coursesString;
}

// render(courses)

render(courses);
