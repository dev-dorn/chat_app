import React,{useEffect, useState} from 'react';
import {over} from "stompjs";
import SockJS from "sockjs-client/dist/sockjs";

var stompClient = null;

const [privateMessage, setPrivateMessage]= useState(new Map());
const [publicMessage, setPublicMessage]= useState([]);
const [chatArea, setChatArea] = useState("PUBLIC");
const [userData, setUserData] = useState({
    username:"",
    recievername:"",
    message:"",
    connected:false,
});
const registerUser = () =>{
    connect();
};
const connect = () =>{
    let sock = new SockJS("http://localhost:8080/ms");

    stompClient = over(sock);

    stompClient.connect({}, ongamepadconnected, onError);
};
const onConnected = () => {
    setUserData({...userData, connected:true});
    stompClient.subscribe("/chatroom/public", onPublicMessageReceived);
    stompClient.subscribe(
        "/user/" + userData.username + "/private",
        onPrivateMessageReceived
    );
    userJoin();
};
const onError =(error) =>{
    console.log(error);
}
const MessageComponent = () => {
  return (
    <div>
      MessageArea
    </div>
  )
}

export default MessageComponent
