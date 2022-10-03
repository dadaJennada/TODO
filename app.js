const mongoose = require('mongoose');
const express = require('express');
const Client = require('./models/client');
const Notes = require('./models/notes');
const session = require('express-session');
const flash = require('connect-flash');
// const methodOvveride = require('m')
const app = express()
mongoose.connect('mongodb://localhost:27017/Todo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connetion Succcessful");
    })
    .catch((err) => {
        console.log("OOps there is ann error in connection", err);
    })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
// app.use(methodOvveride('_method'))
app.use(session({ secret: 'todo', resave: false, saveUninitialized: false }));
app.use(express.static('root'))
app.use(flash());
// app.use(express.static('root2'))

app.listen(3000, (req, res) => {
    console.log("on port 3000")
})

app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});


app.get('/', (req, res) => {
    res.render('app')
})

app.get('/user/checkbox/:username/:date/:id',async(req,res)=>{
    // const {useranme} = req.params;
    console.log(req.params);
    username = req.params.username;
    const clnt = await Client.findOne({username}).populate('notes');
    let notes = clnt.notes;
    let reqNotes = [];
    for(let note of notes){
        if(note.id==req.params.id){
            if(note.done==1){
                note.done = 0;
                console.log(note.done);
            }
            else{
                note.done=1;
                console.log(note.done);
            }
            await note.save();
            clnt.notes = notes;
            await clnt.save();
            break;
        }
    }
    for(let note of notes){
        if(note.date==req.params.date){
            reqNotes.push(note);
        }
    }
    console.log(reqNotes);
    notes = reqNotes;
    const dateNow = req.params.date;
    res.render('user',{clnt,notes,dateNow})
    // res.render('/todo/signin');
})

app.post('/todo/signin', async (req, res) => {
    console.log('TO the signup page');
    const { date } = req.body;
    console.log(typeof date, date);
    if (!date) {
        const { mail, password } = req.body;
        console.log(mail);
        const clnt = await Client.findOne({ password }).populate('notes')
        if (!clnt) {
            req.flash('error', 'Invalid Username or password');
            res.redirect('/')
        }
        else {
            // const req.session.mail= mail
            // var session = req.session;
            // session.mail = mail;
            // session.password = password;
            // session.logged = true;
            req.session.logged = true;
            req.session.username = clnt.username;
            req.session.mail = clnt.mail;
            var notes = clnt.notes;
            const dateNow = new Date().toJSON().slice(0, 10);
            var reqNotes = []
            for (let note in clnt.notes) {
                if (note.date == dateNow) {
                    reqNotes.push(note);
                }
            }
            notes = reqNotes;
            // const day = dateNow.getDay();
            // const mnth = dateNow.getMonth();
            // const year = dateNow.getFullYear();
            // const date = year + '-' + mnth + '-' + day;
            console.log(dateNow);
            // console.log(clnt)
            res.render('user', { clnt, notes, dateNow })
        }
    }
    else {
        var session = req.session;
        const mail = session.mail;
        console.log(mail);
        const clnt = await Client.findOne({ mail }).populate('notes');
        var notes = clnt.notes;
        console.log(notes);
        console.log(date);
        const reqNotes = [];
        for (const note in notes) {
            console.log(note)
            console.log(notes[note].date, date)
            if (notes[note].date == date) {
                reqNotes.push(notes[note]);
            }
        }
        notes = reqNotes;
        const dateNow = date;
        res.render('user', { clnt, notes, dateNow });
    }
})

app.get('/todo/signin', async (req, res) => {
    // res.redirect('/todo/signin')
    // if (!req.session.logged) {
    //     res.redirect('/');
    // }
    const mail = req.session.mail;
    const clnt = await Client.findOne({}).populate('notes');
    var notes = clnt.notes;
    const dateNow = new Date().toJSON().slice(0, 10);
    reqNotes = [];
    for (const note in notes) {
        console.log(dateNow == notes[note].date);
        if (dateNow == notes[note].date) {
            reqNotes.push(notes[note]);
        }
    }
    notes = reqNotes;
    res.render('user', { clnt, notes, dateNow });
})

app.get('/todo/signup', (req, res) => {
    console.log('Request recieved')
    res.render('signup')
})
app.post('/todo/newsingnup', async (req, res) => {
    const { username, mail, password } = req.body;
    if (!username || !mail || !password) {
        res.send("Insufficient data");
    }
    else {

        const clnt = new Client({
            username: username,
            mail: mail,
            password: password,
            notes: [],
        })
        req.session.logged = true;
        req.session.username = clnt.username;
        req.session.mail = clnt.mail;
        const notes = clnt.notes;
        await clnt.save();
        console.log('New User Signed UP...');
        const dateNow = new Date().toJSON().slice(0, 10);
        res.render('user', { clnt, notes, dateNow });
    }
})

app.get('/todo/newnote', (req, res) => {
    console.log(req.session.logged);
    if (!req.session.logged) {
        res.redirect('/');
    }
    res.render('newnote');
})

app.post('/todo/newnote', async (req, res) => {
    if (!req.session.logged) {
        res.render('app')
    }
    else {
        const { heading, text, time, date } = req.body;
        const note = new Notes({
            heading: heading,
            text: text,
            time: time,
            date: date,
        });
        const mail = req.session.mail;
        const dateNow = date;
        var clnt = await Client.findOne({ mail }).populate('notes');
        clnt.notes.push(note);
        var notes = [];
        for (let i in clnt.notes) {
            if (clnt.notes[i].date == date) {
                notes.push(clnt.notes[i]);
            }
        }
        await note.save();
        await clnt.save();
        console.log('Note Saved');
        res.render('user', { clnt, notes, dateNow })
    }
})

app.get('/logout', (req, res) => {
    console.log(req.session.logged);
    req.session.logged = false;
    console.log(req.session.logged);
    res.clearCookie('connect.sid', { path: '/' }).status(200).redirect('/');
})
