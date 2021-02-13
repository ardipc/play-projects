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
import TalentIndex from '../ui/talent/index';
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

{/** ADMIN */}
const menuAdmin = [
  {label: 'Projects', path: '/projects', component: ProjectsIndex },
  {label: 'Projects', path: '/projects-detail/:projectId', component: ProjectDetail },
  {label: 'Projects', path: '/projects-buat', component: ProjectsBuat },
  {label: 'Projects', path: '/projects-edit', component: ProjectEdit },
  {label: 'Projects', path: '/data-project', component: DataProject },

  {label: 'User', path: '/user-level', component: UserLevel },
  {label: 'User', path: '/project-status', component: Status },

  {label: 'Clients', path: '/clients', component: Clients },
  {label: 'Talents', path: '/talents', component: Talents },
  {label: 'Admins', path: '/admins', component: Admins },
];

{/** TALENT */}
const menuTalent = [
  {label: 'Projects', path: '/projects-detail/:projectId', component: ProjectDetail },
  {label: 'Jobs', path: '/jobs', component: Jobs },
];

{/** CLIENT */}
const menuClient = [];

class Private extends React.Component {

  state = {
    level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',
  }

  render() {
    let menu = [];
    if(this.state.level === 1) {
      menu = menuAdmin
    }
    else if(this.state.level === 2) {
      menu = menuTalent
    }
    else {
      menu = menuClient
    }

    return (
      <Router>
        <LayoutNav changeToPrivate={this.props.changeToPrivate} />
        <LayoutSidebar />

        <Switch>
          <Route path="/talents" component={TalentIndex} />
          <Route path="/profil" component={Profil} />
          <Route path="/" exact><HomeIndex /></Route>

          {
            menu.map((item,i) => (
              <Route path={item.path} component={item.component} />
            ))
          }

          <Route><NotFound /></Route>
        </Switch>


        <LayoutFoot />
      </Router>
    )
  }

}

export default Private;
