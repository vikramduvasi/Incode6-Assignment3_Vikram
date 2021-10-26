const express = require('express'); // importing express to index.js 
const data = require('./data'); // importing data.js
const app = express(); // asigning to variable and invoking express 

const bcrypt = require('bcrypt');
const morgan = require('morgan');

const db = require('./database')
const PORT = process.env.PORT || 4100


//---------------GET Requests--------------//

//---------Home Page -------------//
app.get('/', (req, res) => {
    //res.send('<h1>Welcome to our Shcheduled Website</h1>')
    res.render('pages/home')

})

app.get('/users', (req, res) => {
    //res.json(data.users)
    // console.log(`before users- ${data.users}`)
    // res.render('pages/users', { users: data.users })
    // console.log(`after users- ${users}`)

    db.any('SELECT * FROM users;')
        .then((users) => {
            res.render('pages/users',
                {
                    users: users
                })
        })
        .catch((error) => {
            console.log(error)
        })

})

app.get('/schedules', (req, res) => {
    //  res.send(data.schedules);
    //    res.render('pages/schedules', { schedules: data.schedules })


    db.any('SELECT * FROM schedules;')
        .then((schedules) => {
            res.render('pages/schedules',
                {
                    schedules: schedules
                }
            )
        })

        .catch((error) => {
            console.log(error)
        })

    // console.log(data.users.length)
})



//-----------Rendering New User Page -----

app.get('/users/new', (req, res) => {
    res.render('pages/new-user')
})

//------------------------------------------

//----------Rendering New schedule for a user-----

app.get('/schedules/new', (req, res) => {
    res.render('pages/new-schedule')
})

//--------------------------------------------


app.get(`/users/:id`, (req, res) => {
    const user = data.users[req.params.id]


    // console.log(id)
    if (user) {
        //   res.send(user)
        res.render('pages/user', { user: user })
    }
    else { res.send("the user does not exist") }


    //   const id = indexOf(users.params.firstname)
    //    res.send(users.filter(user => user.id === parseInt(req.params.id)));

})

app.get('/users/:id/schedules', (req, res) => {

    const user_schedule = data.schedules.filter(schedule => schedule.user_id === parseInt(req.params.id))
    const found = data.schedules.some(schedule => schedule.user_id === parseInt(req.params.id))
    if (found) {
        //res.json(data.schedules.filter(schedule => schedule.user_id === parseInt(req.params.user_id)))
        // res.send(user_schedule)
        res.render('pages/schedule', { user_schedule: user_schedule })

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


//set Static folder
app.use(express.static('public'))

// view enginr  ejs ----
app.set('view engine', 'ejs')

//---------------POST Requests--------------//

// app.post('/schedules', (req, res) => {

//     console.log("Hi this body, ", req.body)
//     res.send(req.body);

// })



app.post('/schedules', (req, res) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const { user_id, day, start_at, end_at } = req.body
    // const dayName = []
    // dayName = day.map((day) => {
    //     return days.indexOf(day);

    // })

    // console.log(dayName)
    //const day1 = days[day]

    db.none('INSERT INTO schedules (user_id, day, start_at, end_at) VALUES ($1, $2, $3, $4);',
        [user_id, day, start_at, end_at])
        .then(() => {
            res.redirect('/schedules')
        })
        .catch((error) => {
            console.log(error)
        })

    // const newSchedule = {
    //     user_id: parseInt(req.body.user_id),
    //     day: parseInt(req.body.day),
    //     start_at: req.body.start_at,
    //     end_at: req.body.end_at
    // }

    // data.schedules.push(newSchedule);
    // //  res.json(data.schedules)
    // //   console.log(req.body)
    // //   res.send(req.body)
    // res.redirect('/schedules')
})


app.post('/users', (req, res) => {

    // TODO: Add hash to user object and then push to user array
    // Using bcryptjs

    const { firstname, lastname, email, password } = req.body

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    // inserting user record into user table using user form through POST request

    db.none('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);',
        [firstname, lastname, email, hash])
        .then(() => {
            res.redirect('/users')
        })
        .catch((error) => {
            res.render(error)
        })


    // const newUser = {
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     email: req.body.email,
    //     password: hash
    // }

    // data.users.push(newUser);
    // // res.send(data.users)
    // res.redirect('/users')


    // changing to res.redirect will cahnge the
})



app.listen(PORT, () => console.log(`we are listening to port 4000 at http://localhost:${PORT}`))

// End of project 3a-----------------
