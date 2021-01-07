import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import LayoutNav from '../ui/layout/nav';
import LayoutSidebar from '../ui/layout/sidebar';
import LayoutFoot from '../ui/layout/foot';

import HomeIndex from '../ui/home/index';
import ProjectsIndex from '../ui/projects/index';
import ProjectsBuat from '../ui/projects/buat';
import ProjectDetail from '../ui/projects/detail';
import ProjectEdit from '../ui/projects/edit';
import DataProject from '../ui/dataProject/data';

import UserLevel from '../ui/master/level';
import Status from '../ui/status/index';
// import Status from '../ui/master/status';

import Clients from '../ui/clients/index';

import Talents from '../ui/talents/index';

import Admins from '../ui/admins/index';
import Profil from '../ui/profil/index';
import Jobs from '../ui/jobs/index';

import NotFound from '../ui/notfound/index';

class Private extends React.Component {

  state = {

  }

  render() {
    return (
      <Router>
        <LayoutNav changeToPrivate={this.props.changeToPrivate} />
        <LayoutSidebar />

        <Switch>
          <Route path="/" exact><HomeIndex /></Route>

          {/** ADMIN */}
          <Route path="/projects" component={ProjectsIndex} />
          <Route path="/projects-detail/:projectId" component={ProjectDetail} />
          <Route path="/projects-buat" component={ProjectsBuat} />
          <Route path="/projects-edit"><ProjectEdit /></Route>
          <Route path="/data-project"><DataProject /></Route>

          <Route path="/user-level"><UserLevel /></Route>
          <Route path="/project-status"><Status /></Route>


          <Route path="/clients"><Clients /></Route>
          <Route path="/talents"><Talents /></Route>
          <Route path="/admins"><Admins /></Route>

          <Route path="/profil"><Profil /></Route>
          <Route path="/jobs"><Jobs /></Route>

          {/** CLIENT */}

          {/** TALENT */}

          <Route><NotFound /></Route>
        </Switch>
        

        <LayoutFoot />
      </Router>
    )
  }

}

export default Private;
