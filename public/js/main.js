
//wait for the window loading before doing anything
window.onload = ()=>{

    const messages = document.querySelector(".chat-messages");
    const message = document.querySelector("#msg");
    const form = document.querySelector("#chat-form");
    const roomName = document.querySelector("#room-name");
    const roomUsers = document.querySelector("#users");
    

    //initialize the socket
    const socket = io();

    //get username and room from th URL
    const {username, surname, room } = Qs.parse(location.search,{
        ignoreQueryPrefix : false
    });

    //add roo name to the dom
    outputRoomName = (room)=>{
        roomName.innerHTML = room;
    }

    //add users to dom
    outputUsers = (users)=>{
        const maplist = users.map(user => `<li>${user.username}</li>`).join(" ");
        roomUsers.innerHTML = `${maplist}`;
    }

    console.log(surname,username, room);

    //cutomiz the current Date
    getCurrentTime = ()=>{
        const currentTime = new Date();
        const hours = currentTime.getHours()<10 ? `0${currentTime.getHours()}` : currentTime.getHours();
        const minutes = currentTime.getMinutes()<10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
        return `${hours}:${minutes}`;
    }

    socket.emit("joinRoom", {room: room, username: username})

    //listen on the form submit event
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        socket.emit("message", message.value );
        message.value=" ";
        message.focus();
    });

    //listen on the welcom-back event 
    socket.addEventListener("welcom-back", (msg)=>{
        console.log(msg);
        const welcomed = `
        <div class="welcom-message-box">
            <p class="text-center welcom-message">${getCurrentTime()} ${msg.username} ${msg.text}</p>
        </div>`;
        messages.insertAdjacentHTML("beforeend", welcomed);
    });

    socket.addEventListener("joinAlert", (msg)=>{
        const welcomed = `
        <div class="welcom-message-box">
            <p class="text-center welcom-message">${getCurrentTime()} ${msg.username} ${msg.text}</p>
        </div>`;
        messages.insertAdjacentHTML("beforeend", welcomed);
    });

    //the disposition of the message destined to the Broadcast
    socket.on("broadcastMessage",(msg)=>{
        const msge = `
        <div class="message">
            <p class="meta">${msg.username} <span>${getCurrentTime()}</span></p>
            <p class="text">${msg.text}</p>
        </div>`;
        messages.insertAdjacentHTML("beforeend", msge);
        messages.scrollTop = messages.scrollHeight;
    });

    //the disposition of the message destined to the sender himself
    socket.on("senderMessage",(msg)=>{
        const msge = `
        <div class="message senderMessage">
            <p class="meta">${msg.username} <span>${getCurrentTime()}</span></p>
            <p class="text">${msg.text}</p>
        </div>`;
        messages.insertAdjacentHTML("beforeend", msge);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.addEventListener("room-info",(roomInfos)=>{
        outputRoomName(roomInfos.room);
        outputUsers(roomInfos.users);
    })
}

