import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

class LayoutNav extends React.Component {

  state = {
    isLogin: false,

    checkLogin: localStorage.getItem('isLogin')
  }

  showLogin = e => {
    e.preventDefault();
    this.setState({isLogin: true});
    this.props.changeToPrivate(true);
  }

  closeLogin() {
    this.setState({isLogin: false});
  }

  keluarSistem = e => {
    e.preventDefault();
    this.props.changeToPrivate(false);
  }

  render() {

    console.log('state: ', this.state);

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
                <Link to="/projects" class="nav-link">Project</Link>
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

          <Modal show={this.state.isLogin} onHide={this.closeLogin.bind(this)} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div class="card">
              <div class="card-body login-card-body">
                <p class="login-box-msg">Sign in to start your session</p>

                <form action="../../index3.html" method="post">
                  <div class="input-group mb-3">
                    <input type="email" class="form-control" placeholder="Email" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-envelope"></span>
                      </div>
                    </div>
                  </div>
                  <div class="input-group mb-3">
                    <input type="password" class="form-control" placeholder="Password" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-lock"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8">
                      <div class="icheck-primary">
                        <input type="checkbox" id="remember" />
                        <label for="remember">
                          Remember Me
                        </label>
                      </div>
                    </div>
                    <div class="col-4">
                      <button type="submit" class="btn btn-primary btn-block">Sign In</button>
                    </div>
                  </div>
                </form>

                <div class="social-auth-links text-center mb-3">
                  <p>- OR -</p>
                  <a href="#" class="btn btn-block btn-primary">
                    <i class="fab fa-facebook mr-2"></i> Sign in using Facebook
                  </a>
                  <a href="#" class="btn btn-block btn-danger">
                    <i class="fab fa-google-plus mr-2"></i> Sign in using Google+
                  </a>
                </div>

                <p class="mb-1">
                  <a href="forgot-password.html">I forgot my password</a>
                </p>
                <p class="mb-0">
                  <a href="register.html" class="text-center">Register a new membership</a>
                </p>
              </div>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.closeLogin.bind(this)}>
                Close
              </Button>
              <Button variant="primary" onClick={this.closeLogin.bind(this)}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <ul class="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
          
            {
              !this.state.checkLogin &&
              <>
                <li class="nav-item">
                  <a href="#" class="nav-link">Daftar</a>
                </li>
                <li class="nav-item">
                  <a onClick={this.showLogin} href="#" class="nav-link">Masuk</a>
                </li>
              </>
            }

            {
              this.state.checkLogin &&
              <li class="nav-item">
                <a onClick={this.keluarSistem} href="#" class="nav-link">Keluar</a>
              </li>
            }

          </ul>
        </div>
      </nav>
    )
  }

}

export default LayoutNav;
