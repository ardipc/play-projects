import './App.css';
import React from 'react';

import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'

import { SOCKET_URL, SOCKET_PREFIX } from './config/env';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// inisiasi for socket realtime
import io from 'socket.io-client';
import SocketContext from './helper/socket';

import Public from './routes/public';
import Private from './routes/private';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

class App extends React.Component {

  state = {
    isLogin: localStorage.getItem('isLogin')
  }

  changeToPrivate = (value) => {
    if(value) {
      localStorage.setItem('isLogin', value);
    } else {
      localStorage.clear();
      window.location.href = '/';
    }

    this.setState({ isLogin: value })
  }

  componentDidMount() {
    const bootstrap = document.createElement('script');
    bootstrap.src = '/plugins/bootstrap/js/bootstrap.bundle.min.js';
    bootstrap.async = true;
    document.body.appendChild(bootstrap);

    const adminlte = document.createElement('script');
    adminlte.src = '/dist/js/adminlte.min.js';
    adminlte.async = true;
    document.body.appendChild(adminlte);
  }

  render() {
    const socket = io(SOCKET_URL, {path: SOCKET_PREFIX});
    const Main = ({isPrivate}) => isPrivate ? <Private changeToPrivate={this.changeToPrivate} /> : <Public changeToPrivate={this.changeToPrivate} />;

    return (
      <Provider store={store}>
        <SocketContext.Provider value={socket}>
          <Main isPrivate={this.state.isLogin} />
          <ToastContainer autoClose={2000} />
        </SocketContext.Provider>
      </Provider>
    );
  }

}

export default App;
