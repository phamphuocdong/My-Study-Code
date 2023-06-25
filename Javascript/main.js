const courses = [
    {name: 'HTML, CSS'},
    {name: 'Responsive web design'},
    {name: 'ReactJS'},
]

const ul = courses.map(course => `<li>${course.name}</li>`)

console.log(ul)
    
