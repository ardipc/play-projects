import React from 'react';
import { Link } from 'react-router-dom';

class LayoutNav extends React.Component {

  state = {

  }

  render() {
    return (
      <nav class="main-header navbar navbar-expand-md navbar-light navbar-white">
        <div class="container">
          <a href="/" class="navbar-brand">
            <img src="/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
            <span class="brand-text font-weight-light">&nbsp;PlayProjects</span>
          </a>

          <button class="navbar-toggler order-1" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse order-3" id="navbarCollapse">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
              </li>
              <li class="nav-item">
                <Link to="/" class="nav-link">Beranda</Link>
              </li>
              <li class="nav-item">
                <Link to="/projects" class="nav-link">Buat Project</Link>
              </li>

            </ul>

            <form class="form-inline ml-0 ml-md-3">
              <div class="input-group input-group-sm">
                <input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                <div class="input-group-append">
                  <button class="btn btn-navbar" type="submit">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <ul class="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
            <li class="nav-item">
              <a href="#" class="nav-link">Daftar</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Masuk</a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }

}

export default LayoutNav;
