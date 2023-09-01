import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatItem from "./ChatItem";

const ChatAPI = require("twilio-chat");

function Chat() {
  const email = window.localStorage.getItem("email");
  const room = window.location.pathname.split("/")[1];
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);
  const [text, setText] = useState("");
  const roomsList = ["general"];
  let history = useNavigate();
  const changeRoom = (room) => history.push(room);
  const updateText = (e) => setText(e);
  const getToken = async (email) => {
    const response = await axios.get(`http://localhost:4000/token/${email}`);
    const { data } = response;
    return data.token;
  };
  let scrollDiv = useRef(null);

  const joinChannel = async (channel) => {
    if (channel.channelState.status !== "joined") {
      await channel.join();
    }
    setChannel(channel);
    setLoading(false);
    channel.on("messageAdded", (message) => {
      handleMessageAdded(message);
    });
    scrollToBottom();
  };
  const handleMessageAdded = (message) => {
    setMessages((messages) => [...messages, message]);
    scrollToBottom();
  };
  const scrollToBottom = () => {
    const scrollHeight = scrollDiv.current.scrollHeight;
    const height = scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  const sendMessage = () => {
    if (text) {
      console.log(String(text).trim());
      setLoading(true);
      channel.sendMessage(String(text).trim());
      setText("");
      setLoading(false);
    }
  };

  useEffect(() => {
    const callFunction = async () => {
      let token = "";
      if (!email) {
        history("/");
      }
      setLoading(true);
      try {
        token = await getToken(email);
      } catch {
        throw new Error("Unable to get token, please reload this page");
      }
      const client = await ChatAPI.Client.create(token);
      client.on("tokenAboutToExpire", async () => {
        const token = await getToken(email);
        client.updateToken(token);
      });
      client.on("tokenExpired", async () => {
        const token = await getToken(email);
        client.updateToken(token);
      });
      client.on("channelJoined", async (channel) => {
        const newMessages = await channel.getMessages();
        console.log(newMessages);
        setMessages(newMessages.item || []);
        scrollToBottom();
      });
      try {
        const channel = await client.getChannelByUniqueName(room);
        console.log(channel);
        joinChannel(channel);
        setChannel(channel);
      } catch (err) {
        try {
          const channel = await client.createChannel({
            uniqueName: room,
            friendlyName: room,
          });
          joinChannel(channel);
        } catch {
          throw new Error("Unable to create channel, please reload this page");
        }
      }
    };
    callFunction();
  }, []);

  return (
    <div className="chatScreen">
      <div className="sidebar">
        <h4>{email}</h4>
        <h2>Rooms</h2>
        {roomsList.map((room) => (
          <p key={room} onClick={() => changeRoom(room)}></p>
        ))}
        <div className="chatContainer" ref={scrollDiv}>
          <div className="chatHeader">
            {room === "chat" ? "Choose A Room" : room}
          </div>
          <div className="chatContents">
            {messages &&
              room === "chat" &&
              messages.map((message) => (
                <ChatItem key={message.index} message={message} email={email} />
              ))}
          </div>
          {room === "chat" && (
            <div className="chatFooter">
              <input
                type="text"
                placeholder="Type Message"
                onChange={(e) => updateText(e.target.value)}
                value={text}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
