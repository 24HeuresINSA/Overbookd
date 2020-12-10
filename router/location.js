const express = require('express');

module.exports = (models, keycloak) => {
    let router = express.Router();

    router.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Location.findAll({where: req.query})
        .then(location => res.send(location))
        .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Location.create(req.body)
        .then(location => res.send(location))
        .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Location.update(req.body, {where: {id: req.body.id}})
        .then(() => {
            models.Location.findByPk(req.body.id)
            .then(location => res.send(location))
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user_modifier"), (req, res) => {
        models.Location.destroy({where: {id: req.query.id}})
        .then(result => {
            if(result) res.sendStatus(204);
            else res.sendStatus(404);
        })
        .catch(err => res.status(500).send(err));
    });

    return router;
}