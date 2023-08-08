import { useEffect, useState, useRef } from "react";
import "./ChatRoom.css";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import { useSelector } from "react-redux";

export type message = {
  username: string;
  content: string;
};

function ChatRoom() {
  const [chatMessages, setChatMessages] = useState<message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [stompClient] = useState(
    Stomp.over(new SockJS("https://busanwavrserver.store/ws-stomp"))
  );

  const { accessToken, userId } = useSelector((state: any) => state.userInfo);

  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (stompClient != null) {
      stompClient.connect({}, () => {
        console.log("연결됨");
        stompClient.subscribe(
          "/sub/chat/message/room/892e0daa-966d-4683-a826-d004c253db30/Mon Aug 07 13:00:00 UTC 2023",
          (data) => {
            console.log("--------------------------------");
            const receivedMessage = JSON.parse(data.body);
            const newChatMessage = {
              msgType: receivedMessage.type,
              userType: receivedMessage.sender.type,
              senderId: receivedMessage.sender.id,
              username: receivedMessage.sender.nickname,
              content: receivedMessage.body,
            };

            // 일단 넣어두기
            scrollToBottom();

            console.log(receivedMessage);

            setChatMessages((prevMessages) => [
              ...prevMessages,
              newChatMessage,
            ]);
          }
        );
      });
    }
  }, []);

  const handleEnter = () => {
    // 단 넣어두기22
    scrollToBottom();

    const newMessage = {
      roomUid:
        "892e0daa-966d-4683-a826-d004c253db30/Mon Aug 07 13:00:00 UTC 2023",
      token: accessToken,
      message: inputMessage,
    };

    stompClient.send(
      "/pub/chat/message/normal",
      {},
      JSON.stringify(newMessage)
    );
    console.log(chatMessages);
    setInputMessage("");
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleEnter();
    }
  };

  return (
    <div className="chatroom-container">
      <div className="chat-card">
        <div className="chat-header">
          <div className="h2">chatroom</div>
        </div>
        <div className="chat-body" ref={messageEndRef}>
          {chatMessages.map((msg, index) => {
            switch (msg.msgType) {
              case "LEAVE":
                return (
                  <p key={index}>{msg.username}님이 채팅방에서 퇴장했습니다.</p>
                );
              case "VOTE":
                return (
                  <p key={index}>
                    {msg.username}님이 {msg.content}번에 투표했습니다.
                  </p>
                );
              default:
                return (
                  <div key={index}>
                    {msg.senderId == userId ? (
                      <p className="message outgoing" key={index}>
                        {msg.content}
                      </p>
                    ) : (
                      <p className="message incoming" key={index}>
                        <strong>{msg.username}</strong> | {msg.content}
                      </p>
                    )}
                  </div>
                );
            }
          })}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleEnterPress}
            placeholder="메세지를 입력하세요."
          />
          <button onClick={handleEnter}>send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
