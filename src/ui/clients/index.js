import React from 'react'
import { Link } from 'react-router-dom'
import { Modal } from 'react-bootstrap';

import axios from 'axios'
import { API_URL } from '../../config/env'

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

class Clients extends React.Component {
  state = {
    id: '',
    name: '',
    email: '',
    pass: '',

    list: [],

    isModal: false,
  }

  selectClient = e => {
    e.preventDefault();
    let IDUser = e.target.getAttribute('data-id');
    let Name = e.target.getAttribute('data-name');
    let Email = e.target.getAttribute('data-email');
    let Pass = e.target.getAttribute('data-pass');
    this.setState({ id: IDUser, name: Name, email: Email, pass: Pass, isModal: true })
  }

  saveClient = e => {
    e.preventDefault();
    let { id, name, email, pass } = this.state;

    if(id) {
      // ACTION FOR UPDATE
      let form = {
        Name: name,
        Email: email,
        Password: pass,
        LevelID: '3'
      };
      let url = `${API_URL}/api/user/${id}`;
      axios.patch(url, form).then(res => {
        this.fetchClients()
        this.clearForm();
        toast.success(`Client has been updated.`)
      })
    }
    else {
      let form = {
        Name: name,
        Email: email,
        Password: pass,
        LevelID: '3'
      };
      let url = `${API_URL}/api/user`;
      axios.post(url, form).then(res => {
        this.fetchClients()
        this.clearForm();
        toast.success(`New client has been saved.`)
      })
    }
  }

  deleteClient = e => {
    e.preventDefault();
    let ClientID = e.target.getAttribute('data-id');
    let url = `${API_URL}/api/user/${ClientID}`;
    axios.delete(url).then(res => {
      toast.success(`Client has been deleted.`)
      this.fetchClients()
    })
  }

  componentDidMount() {
    this.fetchClients()
  }

  clearForm() {
    this.setState({ isModal: false, id: '', name: '', email: '', pass: '' })
  }

  fetchClients() {
    let url = `${API_URL}/api/user?_where=(LevelID,eq,3)`;
    axios.get(url).then(res => {
      this.setState({ list: res.data })
    })
  }

  render() {
    return (
      <div class="content-wrapper">

        <div class="content-header">
          <div class="container">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0">Clients</h1>
              </div>
              <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                  <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li class="breadcrumb-item active">Clients</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="container">
            <div class="row">

              <div class="col-sm-12">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Clients</h3>

                    <div class="card-tools">
                      <button onClick={e => this.setState({ isModal: true })} type="button" class="btn btn-tool border">
                        <i class="fas fa-plus"></i> Create Client
                      </button>
                    </div>
                  </div>
                  <div class="card-body p-0">
                    <table class="table table-striped projects">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>AVATAR</th>
                          <th>NAME</th>
                          <th>EMAIL</th>
                          <th>CREATED AT</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          this.state.list.map(item => (
                            <tr>
                              <td>{item.IDUser}</td>
                              <td>
                                <ul class="list-inline">
                                  <li class="list-inline-item">
                                    <img alt="Avatar" class="table-avatar" src={`https://ui-avatars.com/api/?name=${item.Name}`} />
                                  </li>
                                </ul>
                              </td>
                              <td>{item.Name}</td>
                              <td>{item.Email}</td>
                              <td>{moment(item.CreatedAt).format('DD-MM-YYYY HH:mm')}</td>
                              <td>
                                <a onClick={this.selectClient}
                                  data-id={item.IDUser}
                                  data-name={item.Name}
                                  data-email={item.Email}
                                  data-pass={item.Password}
                                  class="btn btn-info btn-sm mr-2" href="#">
                                  <i class="fas fa-pencil-alt"></i>&nbsp;Edit
                                </a>
                                <a onClick={this.deleteClient} data-id={item.IDUser} class="btn btn-danger btn-sm" href="#">
                                  <i class="fas fa-trash"></i>&nbsp;Delete
                                </a>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <Modal show={this.state.isModal} onHide={this.clearForm.bind(this)} animation={false}>
                <div class="card" style={{marginBottom: 0}}>
                  <div class="card-body login-card-body">
                    <p class="login-box-msg">{this.state.id ? 'Update' : 'Create'} Client</p>

                    <form onSubmit={this.saveClient}>
                      <div class="input-group mb-3">
                        <input required onChange={e => this.setState({ name: e.target.value })} value={this.state.name} type="text" class="form-control" placeholder="Name" />
                        <div class="input-group-append">
                          <div class="input-group-text">
                            <span class="fas fa-user"></span>
                          </div>
                        </div>
                      </div>
                      <div class="input-group mb-3">
                        <input required onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type="email" class="form-control" placeholder="Email" />
                        <div class="input-group-append">
                          <div class="input-group-text">
                            <span class="fas fa-envelope"></span>
                          </div>
                        </div>
                      </div>
                      <div class="input-group mb-3">
                        <input required onChange={e => this.setState({ pass: e.target.value })} value={this.state.pass} type="password" class="form-control" placeholder="Password" />
                        <div class="input-group-append">
                          <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <button type="submit" class="btn btn-primary btn-block">Save</button>
                        </div><br />
                      </div>
                    </form>

                  </div>
                </div>
              </Modal>

            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Clients;
