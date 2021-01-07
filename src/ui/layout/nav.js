import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

import axios from 'axios';
import { API_URL } from '../../config/env';

class LayoutNav extends React.Component {

  state = {
    checkLogin: localStorage.getItem('isLogin'),
    level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',
    isLogin: false,
    isRegister: false,
    isForgot: false,

    name: '',
    email: '',
    pass: '',
    message: 'Sign in to find a new journey',
  }

  showLogin = e => {
    e.preventDefault();
    this.setState({isLogin: true, isRegister: false, isForgot: false});
  }

  closeLogin() {
    this.setState({isLogin: false});
  }

  showRegister = e => {
    e.preventDefault();
    this.setState({isRegister: true, isLogin:false, isForgot: false});
  }

  closeRegister() {
    this.setState({isRegister: false});
  }

  showForgot = e => {
    e.preventDefault();
    this.setState({isForgot: true, isLogin: false, isRegister: false});
  }

  closeForgot(){
    this.setState({isForgot: false});
  }

  keluarSistem = e => {
    e.preventDefault();
    this.props.changeToPrivate(false);
  }

  masukSistem = e => {
    e.preventDefault();
    let { email, pass } = this.state;

    let url = `${API_URL}/api/user?_fields=IDUser,Name,Email,LevelID&_where=(Email,eq,${email})~and(Password,eq,${pass})`;
    axios.get(url).then(res => {
      console.log('repon: ', res.data);
      let data = res.data;

      if(data.length === 1) {
        localStorage.setItem('user', JSON.stringify(data[0]));
        this.props.changeToPrivate(true);
      } else {
        this.setState({ message: "Email / password salah." })
      }
    })

  }

  daftarSistem = e => {
    e.preventDefault();
    let { name, email, pass } = this.state;

    let form = {
      Name: name,
      Email: email,
      Password: pass,
      LevelID: '3'
    };

    let url = `${API_URL}/api/user`;
    axios.post(url, form).then(res => {
      let data = res.data;
      if(data.hasOwnProperty('insertId')) {
        this.setState({ isLogin: true, isRegister: false, email: '', pass: '' })
      } else {
        this.setState({ message: 'Something wrong.' })
      }
    })
  }

  daftarTalent = e => {
    e.preventDefault();
    let { name, email, pass } = this.state;

    let form = {
      Name: name,
      Email: email,
      Password: pass,
      LevelID: '2'
    };

    let url = `${API_URL}/api/user`;
    axios.post(url, form).then( res => {
      let data = res.data;
      if(data.hasOwnProperty('insertId')) {
        this.setState({ isLogin: true, isRegister: false, email: '', pass:''})
      } else {
        this.setState({ message: 'Something wrong.'})
      }
    })
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

              {
                this.state.checkLogin && (this.state.level === 1 || this.state.level === 3) &&
                <li class="nav-item">
                  <Link to="/projects" class="nav-link">Project</Link>
                </li>
              }

              {
                this.state.checkLogin && this.state.level === 2 &&
                <li class="nav-item">
                  <Link to="/jobs" class="nav-link">Jobs</Link>
                </li>
              }

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
            <div class="card" style={{marginBottom: 0}}>
              <div class="card-body login-card-body">
                <p class="login-box-msg">{this.state.message}</p>

                <form onSubmit={this.masukSistem}>
                  <div class="input-group mb-3">
                    <input onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type="email" class="form-control" placeholder="Email" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-envelope"></span>
                      </div>
                    </div>
                  </div>
                  <div class="input-group mb-3">
                    <input onChange={e => this.setState({ pass: e.target.value })} value={this.state.pass} type="password" class="form-control" placeholder="Password" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-lock"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <button type="submit" class="btn btn-primary btn-block">Sign In</button>
                    </div><br />
                    <div class="col-12 mt-2">
                      <button onClick={this.showRegister} type="button" class="btn btn-success btn-block">Register</button>
                    </div>
                  </div>
                </form>

                <p class="mb-1">
                  <a href="#" onClick={this.showForgot}>I forgot my password</a>
                </p>
              </div>
            </div>
          </Modal>

          <Modal show={this.state.isForgot} onHide={this.closeForgot.bind(this)} animation={false}>
            <div class="card" style={{marginBottom: 0}}>
              <div class="card-body login-card-body">
                <p class="login-box-msg">Sign in to find a new journey</p>

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
                    <input type="password" class="form-control" placeholder="Number key" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-lock"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <button type="submit" class="btn btn-primary btn-block">Sign In</button>
                    </div><br />
                  </div>
                </form>

                <p class="mb-1">
                  <a href="#" onClick={this.showLogin}>Login</a>
                </p>
              </div>
            </div>
          </Modal>

          <Modal show={this.state.isRegister} onHide={this.closeRegister.bind(this)} animation={false}>
            <div class="card" style={{marginBottom: 0}}>
              <div class="card-body login-card-body">
                <p class="login-box-msg">{this.state.message}</p>

                <form>
                <div class="input-group mb-3">
                    <input onChange={e => this.setState({ name: e.target.value })} value={this.state.name} type="text" class="form-control" placeholder="Name" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-lock"></span>
                      </div>
                    </div>
                  </div>


                  <div class="input-group mb-3">
                    <input onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type="email" class="form-control" placeholder="Email" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-envelope"></span>
                      </div>
                    </div>
                  </div>

                  <div class="input-group mb-3">
                    <input onChange={e => this.setState({ pass: e.target.value })} value={this.state.pass} type="password" class="form-control" placeholder="Password" />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-lock"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6   mt-2">
                      <button onClick={this.daftarSistem} type="button" class="btn btn-success btn-block">Register Client</button>
                    </div>
                    <div class="col-sm-6 mt-2">
                      <button onClick={this.daftarTalent} type="button"  class="btn btn-primary btn-block">Register Talent</button>
                    </div>
                  </div>
                </form>

                <p class="mb-1">
                  <a href="#" onClick={this.showLogin}>Have a Account? Login</a>
                </p>
              </div>
            </div>
          </Modal>

          <ul class="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">

            {
              !this.state.checkLogin &&
              <>
                <li class="nav-item">
                  <a onClick={this.showRegister} href="#" class="nav-link">Daftar</a>
                </li>
                <li class="nav-item">
                  <a onClick={this.showLogin} href="#" class="nav-link">Masuk</a>
                </li>
              </>
            }

            {
              this.state.checkLogin &&
              <>
              <li class="nav-item">
                <Link to="/profil" class="nav-link">Profil</Link>
              </li>
              <li class="nav-item">
                <a onClick={this.keluarSistem} href="#" class="nav-link">Keluar</a>
              </li>
              </>
            }

          </ul>
        </div>
      </nav>
    )
  }

}


export default LayoutNav;


//kok ngga berubah kak, wkwkwkwkk
// mic e ga kenek ya ?