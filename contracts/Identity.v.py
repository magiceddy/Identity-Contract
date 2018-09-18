# @dev Implementation of a simple Identity Contract

# @dev This emits when contract is created.
# @param _owner Owner of the contract.
# @param _firstname Name of identity.
# @param _secondname Second name of identity.
# @param _surname Surname of identity.
# @param _birth of identity.
# @param _creationTime When contract is created.
Creation: event({
    _owner: address,
    _firstname: bytes32,
    _secondname: bytes32,
    _surname: bytes32,
    _birth: timestamp,
    _creationTime: timestamp
})

# @dev This emits when default function is triggered
# @param _to transaction's sender
# @param _value transaction's value;
Default: event(_to: indexed(address), _value: wei_value)

# @dev This emits when firstname changes
# @param _oldName old first name
# @param _newName new first name
NewFirstName: event(_oldName: bytes32, _newName: bytes32)

# @dev This emits when second name changes
# @param _oldSecondName old second name
# @param _newSecondName new second name
NewFirstName: event(_oldSecondName: bytes32, _newSecondName: bytes32)

# @dev This emits when surname changes
# @param _oldSurname old surname
# @param _newSurname new surname
NewSurname: event(_oldSurname: bytes32, _newSurname: bytes32)

# @dev This emits when birth changes
# @param _oldBirth old birth
# @param _newBirth new birth
NewBirth: event(_oldBirth: bytes32, _newBirth: bytes32)

# @dev owners's address
owner: public(address)

# @dev identity name
firstname: public(bytes32)

# @dev identity second name
secondname: public(bytes32)

# @dev identity surname
surname: public(bytes32)

# @dev identity date of birth
birth: public(timestamp)

# @dev contract creation time
creationTime: public(timestamp)

# @dev return true if sender is owner
# @param sender sender of message


@public
@constant
def isOwner(sender: address) -> bool:
    return sender == self.owner


# @dev constructor function


@public
def __init__(
    firstname: address,
    secondname: bytes32,
    surname: bytes32,
    birth: timestamp
) -> bool:
    assert not not firstname
    assert not not surname
    assert not firstname == surname
    assert birth < block.timestamp

    self.owner = msg.sender
    self.firstname = firstname
    self.secondname = secondname
    self.surname = surname
    self.birth = birth
    self.creationTime = block.timestamp
    log.Creation(self.owner, self.firstname, self.secondname,
                 self.surname, self.birth, self.creationTime)
    return True

# @dev change name
# param name new name to set


@public
def setFirstName(name: bytes32) -> bytes32:
    assert not not name
    assert isOwner(msg.sender)

    oldName: bytes32 = self.firstname
    assert not name == oldName

    self.firstname = name
    log.NewFirstName(oldName, self.firstname)
    return self.firstname

# @dev change secondname
# param secondname new secondname to set


@public
def setSecondName(secondname: bytes32) -> bytes32:
    assert not not secondname
    assert isOwner(msg.sender)

    oldSecondName: bytes32 = self.secondname
    assert not secondname == oldSecondName

    self.secondname = secondname
    log.NewSecondName(oldSecondName, self.secondname)
    return self.secondname

# @dev change surname
# param surname new surname to set


@public
def setSurname(surname: bytes32) -> bytes32:
    assert not not surname
    assert isOwner(msg.sender)

    oldSurname: bytes32 = self.surname
    assert not secondname == oldSurname

    self.surname = surname
    log.NewSurname(oldSurname, self.surname)
    return self.surname

# @dev change birth
# param birth new birth to set


@public
def setBirth(birth: bytes32) -> bytes32:
    assert not not birth
    assert isOwner(msg.sender)

    oldBirth: bytes32 = self.birth
    assert not birth == oldBirth

    self.birth = birth
    log.NewBirth(oldBirth, self.birth)
    return self.birth


# @dev default function. Send back value to caller


@public
@payable
def __default__():
    send(msg.sender, msg.value)
    log.Default(msg.sender, msg.value)
