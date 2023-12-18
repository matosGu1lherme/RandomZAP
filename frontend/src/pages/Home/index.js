import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";
// import * as C from "./styles";
import UsersList from "./UsersList";
import Container from "./Conteiner";

const Home = () => {
  const { signout } = useAuth();
  const navigate = useNavigate();


  return (
    <Container/>
  );
};

export default Home;

//     // // <Container>
//     //   {/* <C.Title>Home</C.Title> */}
//     //   {/* <Button Text="Sair" onClick={() => [signout(), navigate("/")]}>
//     //     Sair
//     //   </Button> */}
//     //   <UsersList />
//     // // </Container>

// import 'semantic-ui-css/semantic.min.css'
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from '../../App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
