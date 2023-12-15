import React, { useState, createContext } from "react";
import Container from "./pages/Home/Conteiner";
import GlobalStyle from './styles/global';
import RoutesApp from './routes';
import { AuthProvider } from './contexts/auth';

const ConnectionContext = createContext({
    connection: null,
    updateConnection: () => {}
  });
  const ChannelContext = createContext({
    channel: null,
    updateChannel: () => {}
  });  

const App = () => {
    const [connection, setconnection] = useState(null);
    const [channel, setChannel] = useState(null);
    const updateConnection = conn => {
      setconnection(conn);
    };
    const updateChannel = chn => {
      setChannel(chn);
    };
    // return (
    //     <AuthProvider>
    //     <RoutesApp/>
    //     <GlobalStyle/>
    //     </AuthProvider>
    // )
    // return (
    //     <ConnectionContext.Provider value={{ connection, updateConnection }}>
    //       <ChannelContext.Provider value={{ channel, updateChannel }}>
    //         <Container />
    //       </ChannelContext.Provider>
    //     </ConnectionContext.Provider>
        
    //   );
    return (
        <AuthProvider>
          <ConnectionContext.Provider value={{ connection, updateConnection }}>
            <ChannelContext.Provider value={{ channel, updateChannel }}>
              <RoutesApp />
              {/* <Container /> */}
            </ChannelContext.Provider>
          </ConnectionContext.Provider>
           <GlobalStyle /> 
        </AuthProvider>
      );
      
}


export const ConnectionConsumer = ConnectionContext.Consumer
export const ChannelConsumer = ChannelContext.Consumer
export default App;



