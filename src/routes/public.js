import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import LayoutNav from '../ui/layout/nav';
import LayoutSidebar from '../ui/layout/sidebar';
import LayoutFoot from '../ui/layout/foot';

import TalentIndex from '../ui/talent/index';
import HomeIndex from '../ui/home/index';
import NotFound from '../ui/notfound/index';

class Public extends React.Component {

  state = {

  }

  render() {
    return (
      <Router>
        <LayoutNav changeToPrivate={this.props.changeToPrivate} />
        <LayoutSidebar />

        <Switch>
          <Route path="/talents" component={TalentIndex} />
          <Route path="/" exact component={HomeIndex} />

          <Route><NotFound /></Route>
        </Switch>

        <LayoutFoot />
      </Router>
    )
  }

}

export default Public;
