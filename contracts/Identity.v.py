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
    _birth: int128,
    _creationTime: timestamp
})

# @dev This emits when default function is triggered
# @param _to transaction's sender
# @param _value transaction's value;
Default: event({_to: indexed(address), _value: wei_value})

# @dev This emits when firstname changes
# @param _oldName old first name
# @param _newName new first name
NewFirstName: event({_oldName: bytes32, _newName: bytes32})

# @dev This emits when second name changes
# @param _oldSecondName old second name
# @param _newSecondName new second name
NewSecondName: event({_oldSecondName: bytes32, _newSecondName: bytes32})

# @dev This emits when surname changes
# @param _oldSurname old surname
# @param _newSurname new surname
NewSurname: event({_oldSurname: bytes32, _newSurname: bytes32})

# @dev This emits when birth changes
# @param _oldBirth old birth
# @param _newBirth new birth
NewBirth: event({_oldBirth: int128, _newBirth: int128})

# @dev owners's address
owner: public(address)

# @dev identity name
firstname: public(bytes32)

# @dev identity second name
secondname: public(bytes32)

# @dev identity surname
surname: public(bytes32)

# @dev identity date of birth
birth: public(int128)

# @dev contract creation time
creationTime: public(timestamp)

# @dev check if sender is owner
# @param sender sender of message


@public
@constant
def isOwner(sender: address) -> bool:
    return sender == self.owner


# @dev constructor function
# @param _firstname bytes32 representation of name
# @param _secondname bytes32 representation of second name
# @param _surname bytes32 representation of surname
# @param _birth int128 datetime of birth

@public
def __init__(
    _firstname: bytes32,
    _secondname: bytes32,
    _surname: bytes32,
    _birth: int128
):
    assert not not _firstname
    assert not not _surname
    assert not not _birth

    self.creationTime = block.timestamp
    self.owner = msg.sender
    self.firstname = _firstname
    self.secondname = _secondname
    self.surname = _surname
    self.birth = _birth

    log.Creation(self.owner, self.firstname, self.secondname,
                 self.surname, self.birth, self.creationTime)

# @dev change name
# param name new name to set


@public
def updateFirstName(_firstname: bytes32) -> bytes32:
    assert not not _firstname
    assert self.isOwner(msg.sender)

    oldName: bytes32 = self.firstname
    assert not _firstname == oldName

    self.firstname = _firstname
    log.NewFirstName(oldName, self.firstname)
    return self.firstname

# @dev change secondname
# param secondname new secondname to set


@public
def updateSecondName(_secondname: bytes32) -> bytes32:
    assert not not _secondname
    assert self.isOwner(msg.sender)

    oldSecondName: bytes32 = self.secondname
    assert not _secondname == oldSecondName

    self.secondname = _secondname
    log.NewSecondName(oldSecondName, self.secondname)
    return self.secondname

# @dev change surname
# param surname new surname to set


@public
def updateSurname(_surname: bytes32) -> bytes32:
    assert not not _surname
    assert self.isOwner(msg.sender)

    oldSurname: bytes32 = self.surname
    assert not _surname == oldSurname

    self.surname = _surname
    log.NewSurname(oldSurname, self.surname)
    return self.surname

# @dev change birth
# param birth new birth to set


@public
def updateBirth(_birth: int128) -> int128:
    assert not not _birth
    assert self.isOwner(msg.sender)

    oldBirth: int128 = self.birth
    assert not _birth == oldBirth

    self.birth = _birth
    log.NewBirth(oldBirth, self.birth)
    return self.birth

# @dev full identity getter


@public
def getIdentity() -> (bytes32, bytes32, bytes32, int128, timestamp):
    return (self.firstname, self.secondname, self.surname,
            self.birth, self.creationTime)


# @dev default function. Send back value to caller


@public
@payable
def __default__():
    send(msg.sender, msg.value)
    log.Default(msg.sender, msg.value)
