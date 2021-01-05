import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import axios from 'axios';
import { API_URL } from '../../config/env';

import moment from 'moment-timezone';
import { toast } from 'react-toastify';

class Admins extends React.Component {
    state = {
      userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).IDUser : '',
      name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Name : '',
      level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',
      email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Email : '',
    }

    render(){
        return(
          <div class="content-wrapper">

              <section class="content-header">
                <div class="container">
                  <div class="row mb-2">
                    <div class="col-sm-6">
                      <h1>Profilku</h1>
                    </div>
                    <div class="col-sm-6">
                      <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li class="breadcrumb-item active">User Profil</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </section>

              <section class="content">
                <div class="container">
                  <div class="row">

                    <div class="col-md-3">

                      <div class="card card-primary card-outline">
                        <div class="card-body box-profile">
                          <div class="text-center">
                            <img title={this.state.name} alt="Avatar" class="profile-user-img img-fluid img-circle" src={`https://ui-avatars.com/api/?name=${this.state.name}`} />

                          </div>

                          <h3 class="profile-username text-center">{this.state.name}</h3>

                          <p class="text-muted text-center">{this.state.level === 1 ? 'Admin' : this.state.level === 2 ? 'Talents' : 'Client'}</p>

                          <ul class="list-group list-group-unbordered mb-3">
                            <li class="list-group-item">
                              <b>Followers</b> <a class="float-right">10</a>
                            </li>
                            <li class="list-group-item">
                              <b>Following</b> <a class="float-right">12</a>
                            </li>
                            <li class="list-group-item">
                              <b>Friends</b> <a class="float-right">20</a>
                            </li>
                          </ul>

                          <a href="#" class="btn btn-primary btn-block"><b>Follow</b></a>
                        </div>
                      </div>

                    </div>

                    <div class="col-md-9">
                      <div class="card">
                        <div class="card-body">
                          <form class="form-horizontal">
                            <div class="form-group row">
                              <label for="inputName" class="col-sm-2 col-form-label">Name</label>
                              <div class="col-sm-10">
                                <input onChange={e => this.setState({ name: e.target.value })} value={this.state.name} type="text" class="form-control" id="inputName" placeholder="Name" />
                              </div>
                            </div>
                            <div class="form-group row">
                              <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
                              <div class="col-sm-10">
                                <input onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type="email" class="form-control" id="inputEmail" placeholder="Email" />
                              </div>
                            </div>
                            <div class="form-group row">
                              <div class="offset-sm-2 col-sm-10">
                                <button type="submit" class="btn btn-danger">Submit</button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

          </div>
        )
    }
}




export default Admins;
