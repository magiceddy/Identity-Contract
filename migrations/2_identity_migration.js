const Identity = artifacts.require('Identity.vyper');
const birth = Date.parse('26-11-1985');
const firstName = 'Rinaldo';
const surname = 'Rossi';
const secondName = '';

module.exports = function (deployer) {
  deployer.deploy(Identity, firstName, secondName, surname, birth);
}