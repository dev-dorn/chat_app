import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client/dist/sockjs";

var stompClient = null;
const MessageArea = () => {
  const [privateMessage, setPrivateMessage] = useState(new Map());
  const [publicMessage, setPublicMessage] = useState([]);
  const [chatArea, setChatArea] = useState("PUBLIC");
  const [userData, setUserData] = useState({
    username: "",
    recievername: "",
    message: "",
    connected: false,
  });

  // Register user
  const registerUser = () => {
    connect();
  };

  // Connect the user
  const connect = () => {
    // To connect, set up two things
    let sock = new SockJS("http://localhost:8080/ms");

    // Instantiate the stompClient
    stompClient = over(sock);

    // Finally, connect
    stompClient.connect({}, onConnect, onError);
  };

  // Handle on connection success
  // Subscribe to the different channels available on the backend
  const onConnect = () => {
    // Update user connection to true
    setUserData({ ...userData, connected: true });

    // Subscribe to the public channel
    stompClient.subscribe("/chatroom/public", onPublicMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessageReceived
    );

    // This joins a new user to some private user with status JOIN
    userJoin();
  };

  // Print default error message if connection fails
  const onError = (error) => {
    console.log(error);
  };

  // Performs some business logic on
  // receiving a public message
  const onPublicMessageReceived = (payload) => {
    // Converts the payload body to JSON
    var payloadData = JSON.parse(payload.body);

    switch (payloadData.status) {
      // If the user is joining for the first time
      // with status JOIN, create a private chat map
      // for the user
      case "JOIN":
        if (!privateMessage.get(payloadData.senderName)) {
          privateMessage.set(payloadData.senderName, []);
          setPrivateMessage(new Map(privateMessage));
        }
        break;
      // If the user is sending a message (status MESSAGE)
      // update the user public message if messageid
      case "MESSAGE":
        publicMessage.push(payloadData);
        setPublicMessage([...publicMessage]);
        break;
    }
  };

  // On private message gets the payload on subscription to a particular channel
  const onPrivateMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    // If sender does not exist in the private
    // message map, create a new map for the user
    // with an empty array for private messages
    if (!privateMessage.get(payloadData.senderName)) {
      privateMessage.set(payloadData.senderName, []);
    }
    // Update the private message
    privateMessage.get(payloadData.senderName).push(payloadData);
    setPrivateMessage(new Map(privateMessage));
  };

  // On new user join
  // This handles the first user message on join
  // It sends the user details to the general public.
  // without any message
  // User joins the public chat by default
  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  // Send public message:
  // Handle send public message
  const sendPublicMessage = () => {
    // If client is indeed connected
    if (stompClient) {
      // Set the user detail including the message
      let chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };

      // Send the user details to the message controller
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      // Update the user message to an empty string
      setUserData({ ...userData, message: "" });
    }
  };

  // Handle send private message
  const sendPrivateMessage = () => {
    // Check if the user is connected
    if (stompClient) {
      // Set the user details including the message and the receiver
      let chatMessage = {
        senderName: userData.username,
        receiverName: chatArea,
        message: userData.message,
        status: "MESSAGE",
      };

      if (!privateMessage.get(chatArea)) {
        privateMessage.set(chatArea, []);
      }

      // Finally, update the receiver's private message anyway
      privateMessage.get(chatArea).push(chatMessage);
      setPrivateMessage(new Map(privateMessage));

      // Update the user message to an empty string
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  // Handle message input
  const handleMessageInput = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  // Handle username input
  const handleUsernameInput = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  return (
    <div className="container">
      {userData.connected ? (
        // If the user is connected, display this
        <div className="chat-box">
          <div className="member-list">
            {/* Loop through the member list */}
            <ul>
              {/* Onclick set the tab to the current tab */}
              <li
                onClick={() => {
                  setChatArea("PUBLIC");
                }}
                className={`member ${chatArea === "PUBLIC" && "active"}`}
              >
                PUBLIC CHAT
              </li>
              {/* Spread all the users into an array and then list them out */}
              {[...privateMessage.keys()].map((name, index) => (
                <li
                  onClick={() => {
                    setChatArea(name);
                  }}
                  className={`member ${chatArea === name && "active"}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          {chatArea === "PUBLIC" ? (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicMessage.map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessageInput}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendPublicMessage}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...privateMessage.get(chatArea)].map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessageInput}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendPrivateMessage}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // If the user is not connected, display this
        // This will handle the user login/registration
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsernameInput}
            margin="normal"
          />
          <button type="button" onClick={registerUser}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
