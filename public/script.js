const socket = io('/');
const myPeer = new Peer(undefined, {
    port: '443'
});

const videoGrid = document.getElementById('video-grid');
const videoGridRemote = document.getElementById('remoteVideo');

const myVideo = document.createElement('video');
myVideo.muted = true;

const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {

    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addRemoteVideo(video, userVideoStream);
        });
    });

    socket.on('user-connected', userId => {
        setTimeout(() => {
            connectToNewRemoteUser(userId, stream)
          }, 1000)
    });
});

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
});

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
    peers[userId] = call;
}

function connectToNewRemoteUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addRemoteVideo(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',  () => {
        video.play();
    });
    videoGrid.append(video);
}

function addRemoteVideo(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',  () => {
        video.play();
    });
    videoGridRemote.append(video);
}

function vgaRes(){
    res = document.getElementById('video-grid').querySelectorAll('video');
    res[0].style.width = "exact: 320";
    res[0].style.height = "exact: 240";
    console.log(res);
}

function xVgaRes(){
    
}

function hd(){
    
}