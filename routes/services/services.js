const router = require('express').Router();
const rp = require('request-promise');
let registeredServices = [];

router.get('/', (req, res) => {
    res.status(200).send({body: registeredServices})
});

router.post('/register', (req, res) => {
    const { service } = req.body;
    console.log("Determining if service exists already.");
    if(!registeredServices.find(subject => subject.name == service.name)){
        console.log(`No duplicate found. Registering ${service.name}.`);
        registeredServices.push(service);
        const foundService = registeredServices[registeredServices.findIndex(subject => subject.name == service.name)];
        res.status(201).send(foundService);
    }
    else {
        res.status(400).send("Bad Request");
    }
});

router.post('/invoke', (req, res) => {
    const { details } = req.body;
    const { service } = details;
    const { name, process } = service;
    const foundService = registeredServices.find(subject => subject.name == name);
    const foundEndpoint = foundService.procedures.find(subject => subject.name == process);

    if(foundService){
        if(foundEndpoint){
            rp(foundEndpoint.options)
            .then((response) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(response);
            })
            .catch((err) =>{
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