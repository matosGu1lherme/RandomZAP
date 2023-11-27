import React, { useEffect, useState } from "react";
import axios from "axios";
import "./stylesApp.css";
import {
  Grid,
  Segment,
  Card,
  List,
  Button,
  Image,
} from "semantic-ui-react";
import avatar from "./avatar.png";

const UsersList = ({users, toggleConnection, connectedTo, connecting }) => {
    // const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // Faça uma solicitação para a rota do back-end
//     axios.get('http://localhost:9000/users')
//       .then(response => setUsers(response.data))
//       .catch(error => console.error('Erro ao obter usuários:', error));
//   }, []); 
//   console.log(users)

return (
    <Grid.Column width={5}>
      <Card fluid>
        <Card.Content header="Online Users" />
        <Card.Content textAlign="left">
          {users && users.users && users.users.length > 0 ? (
            <List divided verticalAlign="middle" size="large">
              {users.users.map(({ id, nickname }) => (
                <List.Item key={id}>
                  <List.Content floated="right">
                    <Button
                      onClick={() => {
                        toggleConnection(nickname);
                      }}
                      disabled={!!connectedTo && connectedTo !== nickname}
                      loading={connectedTo === nickname && connecting}
                    >
                      {connectedTo === nickname ? "Disconnect" : "Connect"}
                    </Button>
                  </List.Content>
                  {/* <Image avatar src={avatar} /> */}
                  <List.Content>
                    <List.Header>{nickname}</List.Header>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          ) : (
            <Segment>There are no users Online</Segment>
          )}
        </Card.Content>
      </Card>
    </Grid.Column>
  );
};  

export default UsersList;