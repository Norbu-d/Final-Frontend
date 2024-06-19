"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Textarea, Button, Avatar, useToast } from "@chakra-ui/react";
import ChatWindow from "./ChatWindow";
import ChatHistory from "./ChatHistory";
import { ScrollArea } from "./scroll-area";
import NavBar from "./NavBar";

const Messages = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Wangs",
  });
  const [chatPartner, setChatPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const toast = useToast();

  const users = [
    { id: 2, name: "Dupchu Wangmo" },
    { id: 3, name: "Karma Wangs" },
    { id: 4, name: "Poms" },
    { id: 5, name: "Tshering Wangs" },
  ];

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      const partnerName =
        receivedMessage.sender === currentUser.name
          ? receivedMessage.receiver
          : receivedMessage.sender;

      setMessages((prevMessages) => ({
        ...prevMessages,
        [partnerName]: [...(prevMessages[partnerName] || []), receivedMessage],
      }));
    };

    return () => ws.close();
  }, [currentUser.name]);

  const sendMessage = () => {
    if (socket && message && chatPartner && chatPartner.id !== currentUser.id) {
      const msg = {
        text: message,
        sender: currentUser.name,
        receiver: chatPartner.name,
      };
      socket.send(JSON.stringify(msg));
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatPartner.name]: [...(prevMessages[chatPartner.name] || []), msg],
      }));
      setMessage("");
    } else {
      toast({
        title: "Error",
        description: "Please select a chat partner and enter a message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSelectUser = (user) => {
    if (user.id !== currentUser.id) {
      setChatPartner(user);
    }
  };

  const handleStartRecording = async () => {
    if (isRecording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];
      const audioUrl = URL.createObjectURL(audioBlob);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64AudioMessage = reader.result.split(",")[1];

        if (socket && chatPartner && chatPartner.id !== currentUser.id) {
          const msg = {
            text: "",
            sender: currentUser.name,
            receiver: chatPartner.name,
            audio: base64AudioMessage,
          };
          socket.send(JSON.stringify(msg));
          setMessages((prevMessages) => ({
            ...prevMessages,
            [chatPartner.name]: [
              ...(prevMessages[chatPartner.name] || []),
              msg,
            ],
          }));
        }
      };
      reader.readAsDataURL(audioBlob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const currentMessages = chatPartner ? messages[chatPartner.name] || [] : [];

  return (
    <Flex h="100vh" bg="black" color="white">
      <Box w="25%" borderRight="1px" borderColor="gray.700">
        <Flex p="4" alignItems="center">
          <Avatar size="lg" />
          <Text ml="4" fontSize="xl" fontWeight="bold">
            {currentUser.name}
          </Text>
        </Flex>
        <ChatHistory users={users} onSelectUser={handleSelectUser} />
      </Box>
      <Box w="75%" display="flex" flexDirection="column">
        {chatPartner && (
          <>
            <Flex justifyContent="space-between" alignItems="center" p="4" borderBottom="1px" borderColor="gray.700">
              <Flex alignItems="center">
                <Avatar size="md" />
                <Text ml="4" fontSize="xl" fontWeight="bold">
                  {chatPartner.name}
                </Text>
              </Flex>
            </Flex>
            <ScrollArea flex="1" p="4" overflowY="auto" bg="black">
              <ChatWindow messages={currentMessages} currentUser={currentUser} />
            </ScrollArea>
            <Flex p="4" borderTop="1px" borderColor="gray.700" alignItems="center">
              <Textarea
                flex="1"
                mr="2"
                bg="gray.800"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
              <Button colorScheme="blue" onClick={sendMessage}>
                Send
              </Button>
              <Button
                ml="2"
                colorScheme={isRecording ? "red" : "green"}
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
              >
                {isRecording ? "Recording..." : "Record"}
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Messages;
