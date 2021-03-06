import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import axios from 'axios';
import { API_URL, MACHINE } from '../../config/env';
import { toRupiah } from '../../helper/format'

import moment from 'moment-timezone';
import { toast } from 'react-toastify';

class Admins extends React.Component {
    state = {
      userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).IDUser : '',
      level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',
      email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Email : '',
      name: '',

      idAccount: '',
      address: '',
      headline: '',
      cv: '',

      cvTemp: Math.random().toString(36),

      modulDone: [],
      modulUnDone: [],
      myBalance: 0,

      talent: {}
    }

    componentDidMount() {
      this.fetchProfile()
      this.fetchModule()
      this.fetchUser()
    }

    fetchModule() {
      let balance = 0;
      let form = {
        query: `SELECT pm.IDModule, pm.Name AS pm_Name, pm.Budget, pm.IsDone, pm.Assign, p.IDProject, p.StartDate, p.EndDate, p.Name AS p_Name, p.Client, u.Name AS u_Name, count(pt.IDTask) AS t_Count
          FROM project_modul pm JOIN project p ON pm.ProjectID = p.IDProject JOIN user u ON p.Client = u.IDUser LEFT JOIN project_task pt ON pm.IDModule = pt.ModuleID
          WHERE pm.Assign = ?
          GROUP BY pm.IDModule
          ORDER BY pm.IDModule DESC`,
        params: [this.state.userId]
      };
      let url = `${API_URL}/dynamic`;
      axios.post(url, form).then(res => {
        let undone = res.data.filter(item => item.IsDone === 0);
        let done = res.data.filter(item => item.IsDone === 1);
        done.map(item => {
          balance += item.Budget
        })
        this.setState({ modulDone: done, modulUnDone: undone, myBalance: balance })
      })
    }

    fetchProfile() {
      let url = `${API_URL}/api/xjoin`;
        url += `?_join=ua.user_account,_rj,u.user`
        url += `&_on1=(ua.UserID,eq,u.IDUser)`
        url += `&_fields=u.IDUser,u.Name,u.Email,ua.IDAccount,ua.Address,ua.Headline,ua.CV`
        url += `&_where=(IDUser,eq,${this.state.userId})`;

      axios.get(url).then(res => {
        console.log(res.data, 'state');
        let data = res.data[0];
        this.setState({ name: data.u_Name, address: data.ua_Address, headline: data.ua_Headline, cv: data.ua_CV, idAccount: data.ua_IDAccount })
      })
    }

    fetchUser() {
      let form = {
        query: `SELECT u.IDUser, u.Name, u.Email, u.LevelID, u.CreateAt, ua.* FROM user u LEFT JOIN user_account ua ON u.IDUser = ua.UserID WHERE u.IDUser = ? ORDER BY u.IDUser DESC`,
        params: [this.state.userId]
      }
      let url = `${API_URL}/dynamic`;
      axios.post(url, form).then(res => {
        this.setState({ talent: res.data.length ? res.data[0] : {} })
      })
    }

    saveProfile = e => {
      e.preventDefault()
      let form = {
        Name: this.state.name
      };
      let url = `${API_URL}/api/user/${this.state.userId}`;
      axios.patch(url, form).then(res => {
        toast.success(`Profile saved.`)
      })
    }

    saveAccount = e => {
      e.preventDefault()

      if(this.state.idAccount) {
        //action update
        let form = {
          Address: this.state.address,
          Headline: this.state.headline,
        }
        let url = `${API_URL}/api/user_account/${this.state.idAccount}`
        axios.patch(url, form).then(res => {
          this.fetchProfile()
          this.fetchUser()
          toast.success(`Information saved.`)

          if(this.state.cv) {
            let form = new FormData();
            form.append('file', this.state.cv[0]);

            axios.post(`${API_URL}/upload`, form).then(res => {
              let data = res.data;
              let split, getFile;

              if(MACHINE === "linux") {
                split = data.split('/');
                getFile = split[2];
              } else {
                split = data.split('\\');
                getFile = split[3];
              }

              let form = {
                CV: getFile
              }

              let url = `${API_URL}/api/user_account/${this.state.idAccount}`
              axios.patch(url, form).then(res => {
                this.fetchUser()
                this.fetchProfile()
                toast.success(`Curriculum Vitae uploaded.`)
              })
            })
          }

        })
      }
      else {
        //action insert
        let form = {
          UserID: this.state.userId,
          Address: this.state.address,
          Headline: this.state.headline
        }
        let url = `${API_URL}/api/user_account`
        axios.post(url, form).then(res => {

          let idAccount = res.data.insertId;
          this.fetchUser()
          this.fetchProfile()
          toast.success(`Information saved.`)

          if(this.state.cv) {
            let form = new FormData();
            form.append('file', this.state.cv[0]);

            axios.post(`${API_URL}/upload`, form).then(res => {
              let data = res.data;
              let split, getFile;

              if(MACHINE === "linux") {
                split = data.split('/');
                getFile = split[2];
              } else {
                split = data.split('\\');
                getFile = split[3];
              }

              let form = {
                CV: getFile
              }
              let url = `${API_URL}/api/user_account/${idAccount}`
              axios.patch(url, form).then(res => {
                this.fetchUser()
                this.fetchProfile()
                toast.success(`Curriculum Vitae uploaded.`)
              })

            })
          }

        })
      }

    }

    render(){
      console.log(this.state, 'state');
        return(
          <div class="content-wrapper">

              <section class="content-header">
                <div class="container-fluid">
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
                <div class="container-fluid">
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
                              <i class="fa fa-envelope"></i><b> {this.state.talent.Email}</b>
                            </li>
                            <li class="list-group-item">
                              <i class="fa fa-building"></i><b> {this.state.talent.Address ? this.state.talent.Address : '-'}</b>
                            </li>
                            <li class="list-group-item">
                              <i class="fa fa-stopwatch"></i><b> {moment(this.state.talent.CreateAt).format('DD/MM/YYYY HH:mm')}</b>
                            </li>
                          </ul>

                        </div>
                      </div>

                    </div>

                    <div class="col-md-9">

                      <div class="row">
                        <div class="col-lg-4 col-6">
                          <div class="small-box bg-success">
                            <div class="inner">
                              <h3>{toRupiah(this.state.myBalance)}</h3>
                              <p>My Balance</p>
                            </div>
                            <div class="icon">
                              <i class="ion ion-card"></i>
                            </div>
                            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                          </div>
                        </div>
                        <div class="col-lg-4 col-6">
                          <div class="small-box bg-info">
                            <div class="inner">
                              <h3>{this.state.modulDone.length}</h3>
                              <p>Module Done</p>
                            </div>
                            <div class="icon">
                              <i class="ion ion-archive"></i>
                            </div>
                            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                          </div>
                        </div>
                        <div class="col-lg-4 col-6">
                          <div class="small-box bg-warning">
                            <div class="inner">
                              <h3>{this.state.modulUnDone.length}</h3>
                              <p>Work In Progress</p>
                            </div>
                            <div class="icon">
                              <i class="ion ion-archive"></i>
                            </div>
                            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-sm-12">
                          <div class="card card-primary card-outline">
                            <div class="card-body">
                              <form class="form-horizontal" onSubmit={this.saveProfile}>
                                <div class="form-group row">
                                  <label for="inputName" class="col-sm-2 col-form-label">Name</label>
                                  <div class="col-sm-10">
                                    <input onChange={e => this.setState({ name: e.target.value })} value={this.state.name} type="text" class="form-control" id="inputName" placeholder="Name" />
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
                                  <div class="col-sm-10">
                                    <input disabled onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type="email" class="form-control" id="inputEmail" placeholder="Email" />
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <div class="offset-sm-2 col-sm-10">
                                    <button type="submit" class="btn btn-success">Submit</button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>

                        <div class="col-sm-12">
                          <div class="card card-primary card-outline">
                            <div class="card-body">
                              <form class="form-horizontal" onSubmit={this.saveAccount}>
                                <div class="form-group row">
                                  <label for="inputName" class="col-sm-2 col-form-label">Headline</label>
                                  <div class="col-sm-10">
                                    <textarea onChange={e => this.setState({ headline: e.target.value })} value={this.state.headline} rows="4" class="form-control" placeholder="Headline" />
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label for="inputEmail" class="col-sm-2 col-form-label">Address</label>
                                  <div class="col-sm-10">
                                    <textarea onChange={e => this.setState({ address: e.target.value })} value={this.state.address} rows="4" class="form-control" placeholder="Address" />
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <label for="inputEmail" class="col-sm-2 col-form-label">CV</label>
                                  <div class="col-sm-10">
                                    <input style={{padding: '3px'}} key={this.state.cvTemp} type="file" onChange={e => this.setState({ cv: e.target.files })} class="form-control" placeholder="CV" />
                                  </div>
                                </div>
                                <div class="form-group row">
                                  <div class="offset-sm-2 col-sm-10">
                                    <button type="submit" class="btn btn-success">Submit</button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
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
