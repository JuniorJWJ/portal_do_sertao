// const Upload = require('../model/autor')

const { create } = require("./autorController")

module.exports = {
    async get(req,res){
        return res.render("upload")
    }
}