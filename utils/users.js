const users = [];

const userJoinRoom = (id, username, room)=>{
    const user = {id, username, room};
    users.push(user);
    return user;
}

const getCurrentUser = (id)=>{
    return users.find(user => user.id === id);
}

const userLeaves = (id)=>{
    let index =  users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

const getRoomUsers = (room)=>{
    return users.filter(user => user.room === room);
}

module.exports = {userJoinRoom, getCurrentUser, userLeaves, getRoomUsers}