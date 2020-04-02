const router = require('express').Router();
const rp = require('request-promise');
const axios = require('axios');
let registeredServices = [];

router.get('/', (req, res) => {
    res.status(200).send({body: registeredServices})
});

router.post('/register', (req, res) => {
    const { service } = req.body;
    console.log("Determining if service exists already.");
    const foundIndex = registeredServices.findIndex(subject => subject.name === service.name)
    if(foundIndex === -1 && service){
        console.log(`No duplicate found. Registering ${service.name}.`);
        registeredServices.push(service);
        const foundService = registeredServices[registeredServices.findIndex(subject => subject.name == service.name)];
        res.status(201).send(foundService);
    } else if(foundIndex >= 0 && service) {
        console.log(`Found duplicate @ ${foundIndex}. Updating ${service.name}.`);
        registeredServices[foundIndex] = service;
        res.status(201).send(registeredServices[foundIndex]);
    }
    else {
        res.status(400).send("Bad Request");
    }
});

router.post('/invoke', (req, res) => {
    const { serviceDetails, data } = req.body;
    const { service } = serviceDetails;
    const { name, process } = service;
    const foundService = registeredServices.find(subject => subject.name == name);
    if(foundService){
        const foundEndpoint = foundService.procedures.find(subject => subject.name == process);
        const path = foundEndpoint.options.path;
        if(foundEndpoint){
            const newUrl = `http://${foundService.ip}:${foundService.port}${path}`;
            const options = {
                ...foundEndpoint.options,
                url: newUrl,
                data
            }
            axios.request(options)
            .then((response) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(response.data);
            })
            .catch((err) =>{
                console.log(err);
                console.log("Unknown Error")
                res.status(400).send(err);
            });
        } else {
            console.log("Cant find endpoint");
            res.sendStatus(400);
        }
    } else {
        console.log("Can't find service");
        res.sendStatus(400);
    }
});

module.exports = router; 