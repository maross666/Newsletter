const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 2770;
const https = require('https');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const URL = process.env.URL;


app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req,res) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;

    const data = {
        members: [
            {
                merge_fields: {
                    FNAME: name
                },
                email_address: email,
                status: "subscribed",
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = URL;

    const options = {
        method: "POST",
        auth:"kakac:" + apiKey,
    }


    const request = https.request(url, options, (response) => {

        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on('data', (d) => {
            console.log(JSON.parse(d));
        });

        

    });

    

    request.write(jsonData);
    request.end();

    

    app.get('/redirect', (req, res) => {
        res.redirect('/'); // Redirect to the root URL
    });



})

app.listen(port, () =>{
    console.log(`app is up and running on port ${port}`);
})



