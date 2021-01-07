import React from 'react';
import { Link } from 'react-router-dom'

class LayoutSidebar extends React.Component {

  state = {
    name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Name : 'Anonymous',
    level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : 'Unknown'
  }

  render() {
    return (
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <Link to="/" class="brand-link">
          <img src="/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
          <span class="brand-text font-weight-light">PlayProjects</span>
        </Link>

        <div class="sidebar">
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
            </div>
            <div class="info">
              <a href="#" class="d-block">{this.state.name}</a>
            </div>
          </div>

          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

              <li class="nav-header">MASTER DATA</li>
              <li class="nav-item">
                <Link to="/user-level" class="nav-link">
                  <i class="nav-icon fas fa-th"></i>
                  <p>
                    User Level
                  </p>
                </Link>
              </li>
              <li class="nav-item">
                <Link to="/project-status" class="nav-link">
                  <i class="nav-icon fas fa-th-list"></i>
                  <p>
                    Project Status
                  </p>
                </Link>
              </li>

              <li class="nav-header">USERS</li>
              <li class="nav-item">
                <Link to="/clients" class="nav-link">
                  <i class="nav-icon fas fa-users"></i>
                  <p>
                    Clients
                  </p>
                </Link>
              </li>
              <li class="nav-item">
                <Link to="/talents" class="nav-link">
                  <i class="nav-icon fas fa-users"></i>
                  <p>
                    Talents
                  </p>
                </Link>
              </li>
              <li class="nav-item">
                <Link to="/admins" class="nav-link">
                  <i class="nav-icon fas fa-users"></i>
                  <p>
                    Admins
                  </p>
                </Link>
              </li>

              <li class="nav-header">PROJECT</li>
              <li class="nav-item">
                <Link to="/createProject" class="nav-link">
                  <i class="nav-icon fas fa-users"></i>
                  <p>
                    Create Project
                  </p>
                </Link>
              </li>
              <li class="nav-item">
                <Link to="/DataProject" class="nav-link">
                  <i class="nav-icon fas fa-users"></i>
                  <p>
                    Data Project
                  </p>
                </Link>
              </li>

            </ul>
          </nav>
        </div>
      </aside>
    )
  }

}

export default LayoutSidebar;
