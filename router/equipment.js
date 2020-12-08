const express = require('express');

module.exports = (models, keycloak) => {
    let router = express.Router();

    router.route("/")
    .get(keycloak.protect("realm:user"), (req, res) => {
        models.Equipment.findAll({where: req.query})
        .then(equipment => res.send(equipment))
        .catch(err => res.status(500).send(err));
    })
    .post(keycloak.protect("realm:user"), (req, res) => {
        models.Equipment.create(req.body)
        .then(equipment => res.send(equipment))
        .catch(err => res.status(500).send(err));
    })
    .put(keycloak.protect("realm:user"), (req, res) => {
        models.Equipment.update(req.body, {where: {id: req.body.id}})
        .then(() => {
            models.Equipment.findByPk(req.body.id)
            .then(equipment => res.send(equipment))
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .delete(keycloak.protect("realm:user"), (req, res) => {
        models.Equipment.destroy({where: {id: req.query.id}})
        .then(result => {
            if(result) res.sendStatus(204);
            else res.sendStatus(404);
        })
        .catch(err => res.status(500).send(err));
    });

    return router;
}