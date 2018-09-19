const Identity = artifacts.require('Identity.vyper');
const moment = require('moment');
const Promise = require("bluebird");

if (typeof web3.eth.getAccountsPromise === "undefined") {
  Promise.promisifyAll(web3.eth, { suffix: "Promise" });
}

contract('Identity', function (accounts) {
  const owner = accounts[0];
  const firstName = "Diego";
  const secondName = "Armando";
  const surname = "Maradona";
  const birth = moment('1960-10-30').format('X');

  describe('constructor', function () {
    describe('fail case', () => {

      it('should revert with undefined firstName', async () => {
        try {
          const instance = await Identity.new(
            0x0, secondName, surname, birth,
            { from: owner }
          );
          assert.isUndefined(instance, 'contract created with undefined firstName');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with undefined firstName');
        }
      });

      it('should revert with undefined surname', async () => {
        try {
          const instance = await Identity.new(
            firstName, secondName, 0x0, birth,
            { from: owner }
          );
          assert.isUndefined(instance, 'contract created with undefined surname');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with undefined surname');
        }
      });

      it('should revert with undefined birth', async () => {
        try {
          const instance = await Identity.new(
            firstName, secondName, surname, 0x0,
            { from: owner }
          );
          assert.isUndefined(instance, 'contract created with undefined birth');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with undefined birth');
        }
      });
    });

    describe('success case', async () => {
      let instance;

      beforeEach(async () => {
        instance = await Identity.new(
          firstName, secondName, surname, birth,
          { from: owner }
        );
      });

      it('should set first name', async () => {
        const _firstName = await instance.firstname.call({ from: owner });
        assert.equal(
          web3.toUtf8(_firstName),
          firstName,
          'incorrect first name'
        );
      });

      it('should set second name', async () => {
        const _secondName = await instance.secondname.call({ from: owner });
        assert.equal(
          web3.toUtf8(_secondName),
          secondName,
          'incorrect second name'
        );
      });

      it('should set surname', async () => {
        const _surname = await instance.surname.call({ from: owner });
        assert.equal(
          web3.toUtf8(_surname),
          surname,
          'incorrect surname'
        );
      });

      it('should set birth', async () => {
        const _birth = await instance.birth.call({ from: owner });
        assert.equal(
          _birth.toString(10),
          birth,
          'incorrect birth'
        );
      });
    });
  });

  describe('isOwner', () => {
    let instance;
    beforeEach(async () => {
      instance = await Identity.new(
        firstName, secondName, surname, birth,
        { from: owner }
      );
    });

    it('should return true', async () => {
      const isOwner = await instance.isOwner.call(owner);
      assert.isTrue(isOwner, 'incorrect owner');
    });

    it('should return false', async () => {
      const isOwner = await instance.isOwner.call(accounts[1]);
      assert.isFalse(isOwner, 'incorrect owner');
    });
  });

  describe('updateFirstName', () => {
    let instance;
    const newName = "Dieghito";

    beforeEach(async () => {
      instance = await Identity.new(
        firstName, secondName, surname, birth,
        { from: owner }
      );
    });

    describe('fail case', async () => {
      it('should revert on incorrect owner', async () => {
        try {
          const txObject = await instance.updateFirstName(newName, { from: accounts[1] });
          assert.isUndefined(txObject, 'name updated with incorrect owner');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with incorrect owner');
        }
      });

      it('should revert on undefined name', async () => {
        try {
          const txObject = await instance.updateFirstName(0x0, { from: owner });
          assert.isUndefined(txObject, 'name updated with undefined first name');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with undefined first name');
        }
      });

      it('should revert on same name', async () => {
        try {
          const txObject = await instance.updateFirstName(firstName, { from: owner });
          assert.isUndefined(txObject, 'name updated with same first name');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with same first name');
        }
      });
    });

    describe('success case', () => {
      it('should update first name', async () => {
        try {
          const txObject = await instance.updateFirstName(newName, { from: owner });
          const newNameFromLog = txObject.logs[0].args._newName;
          const oldNameFromLog = txObject.logs[0].args._oldName;

          assert.equal(
            web3.toUtf8(newNameFromLog),
            newName,
            'incorrect new name'
          );
          assert.equal(
            web3.toUtf8(oldNameFromLog),
            firstName,
            'incorrect old name'
          );
        } catch (err) {
          assert.include(err.message, 'revert', 'revert on success case');
        }
      });
    });
  });

  describe('updateSecondName', () => {
    let instance;
    const newSecondName = "Armandino";

    beforeEach(async () => {
      instance = await Identity.new(
        firstName, secondName, surname, birth,
        { from: owner }
      );
    });

    describe('fail case', async () => {
      it('should revert on incorrect owner', async () => {
        try {
          const txObject = await instance.updateSecondName(newSecondName, { from: accounts[1] });
          assert.isUndefined(txObject, 'second name updated with incorrect owner');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with incorrect owner');
        }
      });

      it('should revert on undefined second name', async () => {
        try {
          const txObject = await instance.updateSecondName(0x0, { from: owner });
          assert.isUndefined(txObject, 'second name updated with undefined second name');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with undefined second name');
        }
      });

      it('should revert on same second name', async () => {
        try {
          const txObject = await instance.updateSecondName(secondName, { from: owner });
          assert.isUndefined(txObject, 'second name updated with same second name');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with same second name');
        }
      });
    });

    describe('success case', () => {
      it('should update second name', async () => {
        try {
          const txObject = await instance.updateSecondName(newSecondName, { from: owner });
          const newSecondNameFromLog = txObject.logs[0].args._newSecondName;
          const oldSecondNameFromLog = txObject.logs[0].args._oldSecondName;

          assert.equal(
            web3.toUtf8(newSecondNameFromLog),
            newSecondName,
            'incorrect new second name'
          );
          assert.equal(
            web3.toUtf8(oldSecondNameFromLog),
            secondName,
            'incorrect old second name'
          );
        } catch (err) {
          assert.include(err.message, 'revert', 'revert on success case');
        }
      });
    });
  });

  describe('updateSurname', () => {
    let instance;
    const newSurname = "Rossi";

    beforeEach(async () => {
      instance = await Identity.new(
        firstName, secondName, surname, birth,
        { from: owner }
      );
    });

    describe('fail case', async () => {
      it('should revert on incorrect owner', async () => {
        try {
          const txObject = await instance.updateSurname(newSurname, { from: accounts[1] });
          assert.isUndefined(txObject, 'surname updated with incorrect owner');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with incorrect owner');
        }
      });

      it('should revert on undefined surname', async () => {
        try {
          const txObject = await instance.updateSurname(0x0, { from: owner });
          assert.isUndefined(txObject, 'surname updated with undefined second name');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with undefined surname');
        }
      });

      it('should revert on same surname', async () => {
        try {
          const txObject = await instance.updateSurname(surname, { from: owner });
          assert.isUndefined(txObject, 'surname updated with same second name');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with same surname');
        }
      });
    });

    describe('success case', () => {
      it('should update surname', async () => {
        try {
          const txObject = await instance.updateSurname(newSurname, { from: owner });
          const newSurnameFromLog = txObject.logs[0].args._newSurname;
          const oldSurnameFromLog = txObject.logs[0].args._oldSurname;

          assert.equal(
            web3.toUtf8(newSurnameFromLog),
            newSurname,
            'incorrect new surname'
          );
          assert.equal(
            web3.toUtf8(oldSurnameFromLog),
            surname,
            'incorrect old surname'
          );
        } catch (err) {
          assert.include(err.message, 'revert', 'revert on success case');
        }
      });
    });
  });

  describe('updateBirth', () => {
    let instance;
    const newBirth = moment('1984-10-30').format('X');

    beforeEach(async () => {
      instance = await Identity.new(
        firstName, secondName, surname, birth,
        { from: owner }
      );
    });

    describe('fail case', async () => {
      it('should revert on incorrect owner', async () => {
        try {
          const txObject = await instance.updateBirth(newBirth, { from: accounts[1] });
          assert.isUndefined(txObject, 'birth updated with incorrect owner');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with incorrect birth');
        }
      });

      it('should revert on undefined birth', async () => {
        try {
          const txObject = await instance.updateBirth(0x0, { from: owner });
          assert.isUndefined(txObject, 'birth updated with undefined birth');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with undefined birth');
        }
      });

      it('should revert on same surname', async () => {
        try {
          const txObject = await instance.updateBirth(birth, { from: owner });
          assert.isUndefined(txObject, 'birth updated with same birth');
        } catch (err) {
          assert.include(err.message, 'revert', 'no revert with same birth');
        }
      });
    });

    describe('success case', () => {
      it('should update surname', async () => {
        try {
          const txObject = await instance.updateBirth(newBirth, { from: owner });
          const newBirthFromLog = txObject.logs[0].args._newBirth;
          const oldBirthFromLog = txObject.logs[0].args._oldBirth;

          assert.equal(
            newBirthFromLog.toString(10),
            newBirth,
            'incorrect new birth'
          );
          assert.equal(
            oldBirthFromLog.toString(10),
            birth,
            'incorrect old birth'
          );
        } catch (err) {
          assert.include(err.message, 'revert', 'revert on success case');
        }
      });
    });
  });

  describe('getIdentity', () => {
    it('should return all identity fields', async () => {
      const instance = await Identity.new(
        firstName, secondName, surname, birth,
        { from: owner }
      );

      const identity = await instance.getIdentity.call();
      const creationTime = await instance.creationTime.call();

      assert.equal(
        web3.toUtf8(identity[0]), firstName,
        'incorrect first name'
      );
      assert.equal(
        web3.toUtf8(identity[1]), secondName,
        'incorrect second name'
      );
      assert.equal(
        web3.toUtf8(identity[2]), surname,
        'incorrect surname'
      );
      assert.equal(
        identity[3].toString(10), birth,
        'incorrect birth'
      );
      assert.equal(
        identity[4].toString(10), creationTime.toString(10),
        'incorrect creation time'
      );
    });
  });

  describe('default function', () => {
    it('should refund sender', async () => {
      const amount = 1000;
      const instance = await Identity.new(
        firstName, secondName, surname, birth,
        { from: owner }
      );

      const startBalance = await web3.eth.getBalance(owner);

      const txObject = await instance.send(amount);

      assert.equal(
        owner, txObject.logs[0].args._to,
        'incorrect refund address'
      );
      assert.equal(
        amount, txObject.logs[0].args._value.toString(10),
        'incorrect refund amount'
      );

      const gasUsed = txObject.receipt.gasUsed;
      const transaction = await web3.eth.getTransaction(txObject.tx);
      const gasPrice = transaction.gasPrice;
      const txFee = gasPrice.times(gasUsed);

      const endBalance = await web3.eth.getBalance(owner);

      assert.equal(
        endBalance.plus(txFee).toString(10),
        startBalance.toString(10),
        'sender not refund'
      )
    });
  });
});