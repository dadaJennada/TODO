const mongoose = require('mongoose')
const Client = require('../client')
const Notes = require('../notes')
mongoose.connect('mongodb://localhost:27017/Todo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connetion Succcessful");
    })
    .catch((err) => {
        console.log("OOps there is ann error in connection", err);
    })

// const note1 = new Notes({
//     heading: 'Exam',
//     text: "TCS NQT round-2",
//     time: "10:00AM",
//     date: '12-09-2022',
// })

const save = async function (client, note) {
    // await note.save();
    // console.log("Note saved")
    await Client.deleteMany();
    // console.log(client);
    // console.log(client.notes);
    // const note = client.notes[0];
    // console.log('*******');
    // console.log(typeof client);
    // console.log(typeof client.notes);
    // console.log(note);
    // await note.save();
    client.notes.push(note);
    // console.log(client);
    await note.save();
    await client.save();
    console.log('Client Saved');
}

const client1 = new Client({
    mail: "dadakhalandarj@gmail.com",
    username: 'JDK',
    password: '8080',
    notes: [],
})
const note = new Notes({
    heading: 'Celebrations',
    text: 'Freshers for the 1st year students',
    time: '10:00AM',
    date: '10/10/2022',
})
// save(note1);
// save(clnt); 
const show = async function () {
    const clt = await Client.findOne({ username: 'khalandar' }).populate('notes');
    console.log("In SHOw function");
    console.log(clt);
    // console.log(clt.notes)
    // const id = clt.notes[0];
    // const note = await Notes.findOne({ _id: id })
    // console.log(note);
}
// console.log(client);
// save(client, note);
const client2 = new Client({
    mail: 'khalandarj@gmail.com',
    username: 'khalandar',
    password: '123456',
    notes: [],
})
const note2 = new Notes({
    heading: 'Games',
    text: 'Play cricket with my friends',
    time: '06:00AM',
    date: '2022-10-10',
})

const addNote = async function (note2) {
    const client = await Client.findOne({ username: 'khalandar' }).populate('notes')
    client.notes.push(note2);
    console.log(client);
    await note2.save();
    await client.save();
}

const delAll = async function () {
    await Client.deleteMany();
    console.log("Deleted");
}

// addNote(note2);
// show()
// delAll()
save(client2, note2);
show();
