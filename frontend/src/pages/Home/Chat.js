import React, { Fragment, useState, useEffect, useRef } from "react";
import {
  Header,
  Icon,
  Input,
  Grid,
  Segment,
  Button,
  Loader
} from "semantic-ui-react";
import SweetAlert from "react-bootstrap-sweetalert";
import { format } from "date-fns";
import "./stylesApp.css";
import UsersList from "./UsersList";
import MessageBox from "./MessageBox";
import axios from "axios";
import signin from "../Signin";
import useAuth from "../../hooks/useAuth";

// Use for remote connections
const configuration = {
  iceServers: [{ url: "stun:stun.1.google.com:19302" }]
};

// Use for local connections
// const configuration = null;

const Chat = ({ connection, updateConnection, channel, updateChannel }) => {
  const [socketOpen, setSocketOpen] = useState(false);
  const { user, login } = useAuth();
  const [socketMessages, setSocketMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [connectedTo, setConnectedTo] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [alert, setAlert] = useState(null);
  const connectedRef = useRef();
  const webSocket = useRef(null);
  const [message, setMessage] = useState("");
  const messagesRef = useRef({});
  const [messages, setMessages] = useState({});
  
  useEffect(() => {
    webSocket.current = new WebSocket('ws://localhost:9000');
    webSocket.current.onmessage = message => {
      const data = JSON.parse(message.data);
      setSocketMessages(prev => [...prev, data]);
    };
    webSocket.current.onclose = () => {
      webSocket.current.close();
    };
    return () => webSocket.current.close();
  }, []);

  useEffect(() => {
    let data = socketMessages.pop();
    if (data) {
      switch (data.type) {
        case "connect":
          setSocketOpen(true);
          break;
        case "login":
            console.log("oii")
          onLogin(data);
          break;
        case "updateUsers":
          updateUsersList(data);
          break;
        case "removeUser":
          removeUser(data);
          break;
        case "offer":
          onOffer(data);
          break;
        case "answer":
          onAnswer(data);
          break;
        case "candidate":
          onCandidate(data);
          break;
        default:
          break;
      }
    }
  }, [socketMessages]);

//   useEffect(() => {
//     // Faça uma solicitação para a rota do back-end
//     axios.get('http://localhost:9000/users')
//       .then(response => setUsers(response.data))
//       .catch(error => console.error('Erro ao obter usuários:', error));
//   }, []); 

const toggleRandomConnection = () => {
    if (loggedIn.length < 3) {
      console.log("Não há usuários suficientes para conectar.");
      return;
    }
  
    let randomIndex;
    do {
    // Obtenha um índice aleatório
    randomIndex = Math.floor(Math.random() * users.length);
    } while (randomIndex === 0);
  
    // Selecione o usuário aleatório
    const randomUser = loggedIn[randomIndex];
  
    // Inicie a conexão com o usuário aleatório
    console.log("tratala"+randomUser.userName + ramdomIndex);
    handleConnection(randomUser.userName);
  };
  

 

  const closeAlert = () => {
    setAlert(null);
  };

  const send = data => {
    webSocket.current.send(JSON.stringify(data));
  };

  const handleLogin = (user) => {
    console.log(JSON.stringify(users, null, 2));
    setLoggingIn(true);
    send({
      type: "login",
      name: user.nickname,
    });
    console.log("name:" +  user.nickname)
  };

  const updateUsersList = ({ user }) => {
    setUsers(prev => [...prev, user]);
  };

  const removeUser = ({ user }) => {
    setUsers(prev => prev.filter(u => u.userName !== user.userName));
  }

  const handleDataChannelMessageReceived = ({ data }) => {
    const message = JSON.parse(data);
    const { name: user } = message;
    let messages = messagesRef.current;
    let userMessages = messages[user];
    if (userMessages) {
      userMessages = [...userMessages, message];
      let newMessages = Object.assign({}, messages, { [user]: userMessages });
      messagesRef.current = newMessages;
      setMessages(newMessages);
    } else {
      let newMessages = Object.assign({}, messages, { [user]: [message] });
      messagesRef.current = newMessages;
      setMessages(newMessages);
    }
  };

// const onLogin = async ({ status, message, user, token}) => {
//     console.log("aqui");
//     setLoggingIn(false);
  
//     if (status === 1) {
//       setAlert(
//         <SweetAlert
//           success
//           title="Success!"
//           onConfirm={closeAlert}
//           onCancel={closeAlert}
//         >
//           {message}
//         </SweetAlert>
//       );
  
//       setIsLoggedIn(true);
//       setUsers([user]); // Se necessário, ajuste como os usuários são definidos
  
//       // Chame a função de login do contexto do chat
//       //await signin(email, senha);
  
//       let localConnection = new RTCPeerConnection(configuration);
//       console.log(localConnection);
//       //when the browser finds an ice candidate we send it to another peer
//       localConnection.onicecandidate = ({ candidate }) => {
//         let connectedTo = connectedRef.current;

//         if (candidate && !!connectedTo) {
//           send({
//             name: connectedTo,
//             type: "candidate",
//             candidate
//           });
//         }
//       };
//       localConnection.ondatachannel = event => {
//         console.log("Data channel is created!");
//         let receiveChannel = event.channel;
//         receiveChannel.onopen = () => {
//           console.log("Data channel is open and ready to be used.");
//         };
//         receiveChannel.onmessage = handleDataChannelMessageReceived;
//         updateChannel(receiveChannel);
//       };
//       updateConnection(localConnection);
//       // Restante do código...
//     } else {
//       // Trate falhas de login aqui
//       setAlert(
//         <SweetAlert
//           warning
//           confirmBtnBsStyle="danger"
//           title="Failed"
//           onConfirm={closeAlert}
//           onCancel={closeAlert}
//         >
//           {message}
//         </SweetAlert>
//       );
//     }
//   };
  
const onLogin = ({ success, message, users: loggedIn }) => {
    setLoggingIn(false);
    if (success) {
      setAlert(
        <SweetAlert
          success
          title="Success!"
          onConfirm={closeAlert}
          onCancel={closeAlert}
        >
          Logged in successfully!
        </SweetAlert>
      );
      setIsLoggedIn(true);
      setUsers(loggedIn);
      console.dir("users lista: "+ loggedIn);
      console.log("users:0" + users);
      console.log(JSON.stringify(loggedIn, null, 2));
      console.log(loggedIn[0]);
      console.log(loggedIn[1]);
      let localConnection = new RTCPeerConnection(configuration);
      console.log(localConnection);
      //when the browser finds an ice candidate we send it to another peer
      localConnection.onicecandidate = ({ candidate }) => {
        let connectedTo = connectedRef.current;
        if (candidate && !!connectedTo) {
          send({
            name: connectedTo,
            type: "candidate",
            candidate
          });
        }
      };
      localConnection.ondatachannel = event => {
        console.log("Data channel is created!");
        let receiveChannel = event.channel;
        receiveChannel.onopen = () => {
          console.log("Data channel is open and ready to be used.");
        };
        receiveChannel.onmessage = handleDataChannelMessageReceived;
        updateChannel(receiveChannel);
      };
      updateConnection(localConnection);
    } else {
      setAlert(
        <SweetAlert
          warning
          confirmBtnBsStyle="danger"
          title="Failed"
          onConfirm={closeAlert}
          onCancel={closeAlert}
        >
          {message}
        </SweetAlert>
      );
    }
  };

  //when somebody wants to message us
  const onOffer = ({ offer, name }) => {
    setConnectedTo(name);
    connectedRef.current = name;

    connection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => connection.createAnswer())
      .then(answer => connection.setLocalDescription(answer))
      .then(() =>
        send({ type: "answer", answer: connection.localDescription, name })
      )
      .catch(e => {
        console.log({ e });
        setAlert(
          <SweetAlert
            warning
            confirmBtnBsStyle="danger"
            title="Failed"
            onConfirm={closeAlert}
            onCancel={closeAlert}
          >
            An error has occurred.
          </SweetAlert>
        );
      });
  };

  //when another user answers to our offer
  const onAnswer = ({ answer }) => {
    connection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  //when we got ice candidate from another user
  const onCandidate = ({ candidate }) => {
    connection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  //when a user clicks the send message button
  const sendMsg = () => {
    const time = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    let text = { time, message, name };
    let messages = messagesRef.current;
    let connectedTo = connectedRef.current;
    let userMessages = messages[connectedTo];
    if (messages[connectedTo]) {
      userMessages = [...userMessages, text];
      let newMessages = Object.assign({}, messages, {
        [connectedTo]: userMessages
      });
      messagesRef.current = newMessages;
      setMessages(newMessages);
    } else {
      userMessages = Object.assign({}, messages, { [connectedTo]: [text] });
      messagesRef.current = userMessages;
      setMessages(userMessages);
    }
    channel.send(JSON.stringify(text));
    setMessage("");
  };

  const handleConnection = name => {
    if (!connection) {
        console.error("Connection is not initialized.");
        return;
    }

    var dataChannelOptions = {
      reliable: true
    };

    let dataChannel = connection.createDataChannel("messenger");

    dataChannel.onerror = error => {
      setAlert(
        <SweetAlert
          warning
          confirmBtnBsStyle="danger"
          title="Failed"
          onConfirm={closeAlert}
          onCancel={closeAlert}
        >
          An error has occurred.
        </SweetAlert>
      );
    };

    dataChannel.onmessage = handleDataChannelMessageReceived;
    updateChannel(dataChannel);

    connection
      .createOffer()
      .then(offer => connection.setLocalDescription(offer))
      .then(() =>
        send({ type: "offer", offer: connection.localDescription, name })
      )
      .catch(e =>
        setAlert(
          <SweetAlert
            warning
            confirmBtnBsStyle="danger"
            title="Failed"
            onConfirm={closeAlert}
            onCancel={closeAlert}
          >
            An error has occurred.
          </SweetAlert>
        )
      );
  };

  const toggleConnection = userName => {
    console.log("nome: " + userName);
    if (connectedRef.current === userName) {
        console.log("no if")
      setConnecting(true);
      setConnectedTo("");
      connectedRef.current = "";
      setConnecting(false);
    } else {
        console.log("no else" + userName)
      setConnecting(true);
      setConnectedTo(userName);
      connectedRef.current = userName;
      handleConnection(userName);
      setConnecting(false);
    }
  };
  return (
    <div className="App">
      {alert}
      <Header as="h2" icon>
        <Icon name="users" />
        RandomZap Chat
      </Header>
      {(socketOpen && (
        <Fragment>
          <Grid centered columns={4}>
            <Grid.Column>
              {(!isLoggedIn && (
                // <Input
                //   fluid
                //   disabled={loggingIn}
                //   type="text"
                //   onChange={e => setName(e.target.value)}
                //   placeholder="Username..."
                //   action
                // >
                //   <input />
                <div>
                <p>Deseja iniciar uma conversa?</p>
                  <Button
                    // color="teal"
                    // disabled={!name || loggingIn}
                    onClick={() => handleLogin(user)}
                  >
                    <Icon name="sign-in" />
                    Iniciar
                  </Button>
                  </div>
                // {/* </Input> */}
              )) || (
                <Segment raised textAlign="center" color="olive">
                  Logged In as: {user.nickname}
                </Segment>
              )}
            </Grid.Column>
          </Grid>
          <Grid>
            <UsersList
              users={users}
              toggleConnection={toggleConnection}
              connectedTo={connectedTo}
              connection={connecting}
            />
            <MessageBox
              messages={messages}
              connectedTo={connectedTo}
              message={message}
              setMessage={setMessage}
              sendMsg={sendMsg}
              name={name}
            />
            <Button
            onClick={() => toggleRandomConnection()}
            disabled={!loggingIn || loggingIn.length < 2}
            >
            <Icon name="random" />
            Conectar Aleatoriamente
            </Button>

          </Grid>
        </Fragment>
      )) || (
        <Loader size="massive" active inline="centered">
          Loading
        </Loader>
      )}
    </div>
  );
};

export default Chat;