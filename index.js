const express = require('express'); // importing express to index.js 
const data = require('./data'); // importing data.js
const app = express(); // asigning to variable and invoking express 
//const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const morgan = require('morgan')
const PORT = process.env.PORT || 4000

//---------------GET Requests--------------//

app.get('/', (req, res) => res.send('<h1>Welcome to our Shcheduled Website</h1>'))

app.get('/users', (req, res) => {
    res.json(data.users)
})

app.get('/schedules', (req, res) => {
    res.send(data.schedules);

    console.log(data.users.length)
})


app.get(`/users/:id`, (req, res) => {
    const user = data.users[req.params.id]
    if (user) { res.send(user) }
    else { res.send("the user does not exist") }


    //   const id = indexOf(users.params.firstname)
    //    res.send(users.filter(user => user.id === parseInt(req.params.id)));

})

app.get('/users/:id/schedules', (req, res) => {

    const user_schedule = data.schedules.filter(schedule => schedule.user_id === parseInt(req.params.id))
    const found = data.schedules.some(schedule => schedule.user_id === parseInt(req.params.id))
    if (found) {
        //res.json(data.schedules.filter(schedule => schedule.user_id === parseInt(req.params.user_id)))
        res.send(user_schedule)

    }
    else {
        // res.send("Either user does not exist or this user dosent have a schedule ")
        res.status(400).send(`"Either user ${req.params.id} does not exist or this user dosent have a schedule "`)
    }
})

//----------Body Parser Middleware-------
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }));

//Logging middleware
app.use(morgan('dev'))

// view enginr  ejs ----
app.set('view engine', 'ejs')

//---------------POST Requests--------------//

// app.post('/schedules', (req, res) => {

//     console.log("Hi this body, ", req.body)
//     res.send(req.body);

// })

app.post('/schedules', (req, res) => {

    const newSchedule = {
        user_id: parseInt(req.body.user_id),
        day: parseInt(req.body.day),
        start_at: req.body.start_at,
        end_at: req.body.end_at
    }

    data.schedules.push(newSchedule);
    res.json(data.schedules)
    //   console.log(req.body)
    //   res.send(req.body)
})


app.post('/users', (req, res) => {


    // TODO: Add hash to user object and then push to user array
    // Using bcryptjs

    const password = req.body.password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)


    const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash
    }

    data.users.push(newUser);
    res.send(data.users)
    //  res.redirect('/users')
})



app.listen(PORT, () => console.log(`we are listening to port 4000 at http://localhost:${PORT}`))

// End of project 3a-----------------
