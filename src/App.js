import './App.css';
import React from 'react';

import Public from './routes/public';
import Private from './routes/private';

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

    const Main = ({isPrivate}) => isPrivate ? <Private changeToPrivate={this.changeToPrivate} /> : <Public changeToPrivate={this.changeToPrivate} />;

    return (
      <Main isPrivate={this.state.isLogin} />
    );
  }

}

export default App;
