import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import LayoutNav from './ui/layout/nav';
import LayoutSidebar from './ui/layout/sidebar';
import LayoutFoot from './ui/layout/foot';

import HomeIndex from './ui/home/index';
import ProjectsIndex from './ui/projects/index';
import ProjectsBuat from './ui/projects/buat';
import ProjectDetail from './ui/projects/detail';
import ProjectEdit from './ui/projects/edit';

class App extends React.Component {

  state = {

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
    return (
      <Router>
        <LayoutNav />
        <LayoutSidebar />

        <Switch>
          <Route path="/" exact><HomeIndex /></Route>
          <Route path="/projects"><ProjectsIndex /></Route>
          <Route path="/projects-buat"><ProjectsBuat /></Route>
          <Route path="/projects-detail"><ProjectDetail /></Route>
          <Route path="/projects-edit"><ProjectEdit /></Route>
        </Switch>

        <LayoutFoot />
      </Router>
    );
  }

}

export default App;
