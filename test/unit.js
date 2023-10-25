/* global describe it */

/*

process.env.NODE_ENV = 'test';

const chai = require('chai');
// const fetch = require("node-fetch");
const getSseurl = require("../models/trains").getSseurl;

function starWarsMovies () {
    fetch('http://swapi.co/api/films/')
      .then((res) => {
           return res.json()
       })
       .then((res) => res.count)
  }

async function help() {
    const sseurl = await getSseurl();
    console.log(sseurl);
    return sseurl;
}

describe('Get star war movies', () => {
    it('should get 7', () => {
        const sseurl = help();
    
        // assert.equal(starWarsMovies(), 7)
        chai.expect(sseurl).to.be.an('string');
    })
})

*/
