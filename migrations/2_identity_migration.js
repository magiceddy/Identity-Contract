const Identity = artifacts.require('Identity.vyper');
const moment = require('moment');
const birth = moment('26/11/1985', 'D/M/YYYY').format('X');

const firstName = 'Rinaldo';
const surname = 'Rossi';
const secondName = '';

module.exports = function (deployer) {
  deployer.deploy(Identity, firstName, secondName, surname, birth);
}