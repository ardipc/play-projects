import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { API_URL } from '../../config/env'

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

class HomeIndex extends React.Component {

  state = {
    name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Name : '',
    level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',

    list: [],

    module: 0,
    client: 0,
    talent: 0
  }

  componentDidMount() {
    this.fetchProjects()
    this.fetchUser()
    this.fetchModule()
  }

  fetchProjects() {
    let url = `${API_URL}/api/xjoin`;
      url += `?_join=ul.user_level,_j,u.user,_j,p.project,_j,uu.user,_j,s.project_status`
      url += `&_on1=(ul.IDLevel,eq,u.LevelID)`
      url += `&_on2=(u.IDUser,eq,p.Client)`
      url += `&_on3=(uu.IDUser,eq,p.Leader)`
      url += `&_on4=(s.IDStatus,eq,p.StatusID)`
      url += `&_fields=p.IDProject,p.Name,p.Description,p.Leader,p.Client,p.CreateAt,u.Name,p.Leader,uu.Name,p.StartDate,p.EndDate,p.StatusID,s.Name`
      url += `&_sort=-p.IDProject`;
    axios.get(url).then(res => {
      this.setState({ list: res.data })
    })
  }

  fetchUser() {
    let url = `${API_URL}/api/user`;
    axios.get(url).then(res => {
      let client = res.data.filter(item => item.LevelID === 2);
      let talent = res.data.filter(item => item.LevelID === 3);
      this.setState({ client: client.length, talent: talent.length })
    })
  }

  fetchModule() {
    let url = `${API_URL}/api/project_modul`;
    axios.get(url).then(res => {
      this.setState({ module: res.data.length })
    })
  }

  render() {
    return (
      <div class="content-wrapper">

        <div class="content-header">
          <div class="container">
            <div class="row mb-2">
              <div class="col-sm-6">
              {
                this.state.name &&
                <h1 class="m-0"> Welcome back <b>{this.state.name}</b></h1>
              }
              {
                !this.state.name &&
                <h1 class="m-0"> Welcome to PlayProjects</h1>
              }
              </div>
              <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                  <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li class="breadcrumb-item active">Projects</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="container">
            <div class="row">

              <div class="col-lg-3 col-6">
                <div class="small-box bg-info">
                  <div class="inner">
                    <h3>{this.state.list.length}</h3>

                    <p>New Projects</p>
                  </div>
                  <div class="icon">
                    <i class="ion ion-archive"></i>
                  </div>
                  <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                </div>
              </div>

              <div class="col-lg-3 col-6">
                <div class="small-box bg-success">
                  <div class="inner">
                    <h3>{this.state.module}</h3>

                    <p>New Module</p>
                  </div>
                  <div class="icon">
                    <i class="ion ion-cube"></i>
                  </div>
                  <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                </div>
              </div>

              <div class="col-lg-3 col-6">
                <div class="small-box bg-warning">
                  <div class="inner">
                    <h3>{this.state.client}</h3>

                    <p>Clients Joined</p>
                  </div>
                  <div class="icon">
                    <i class="ion ion-person-add"></i>
                  </div>
                  <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                </div>
              </div>

              <div class="col-lg-3 col-6">
                <div class="small-box bg-danger">
                  <div class="inner">
                    <h3>{this.state.talent}</h3>

                    <p>Talents Joined</p>
                  </div>
                  <div class="icon">
                    <i class="ion ion-bowtie"></i>
                  </div>
                  <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                </div>
              </div>

              <div class="col-sm-12">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Projects</h3>

                    <div class="card-tools">
                      {
                        /**
                        <button type="button" class="btn btn-tool border">
                        <i class="fas fa-plus"></i> Create Project
                        </button>
                        */
                      }
                    </div>
                  </div>
                  <div class="card-body p-0">

                    <table class="table table-striped projects">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Project Name</th>
                                <th>Client</th>
                                <th>Leader</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.list.map(item => (
                              <tr>
                                  <td>#{item.p_IDProject}</td>
                                  <td>
                                    <Link to={`/projects-detail/${item.p_IDProject}`}>
                                      {item.p_Name}
                                    </Link>
                                    <br/>
                                    <small>
                                      Created {moment(item.p_CreateAt).format('DD.MM.YYYY HH:mm')}
                                    </small>
                                  </td>
                                  <td>
                                      <ul class="list-inline">
                                          <li class="list-inline-item">
                                              <img title={item.u_Name} alt="Avatar" class="table-avatar" src={`https://ui-avatars.com/api/?name=${item.u_Name}`} />
                                          </li>
                                      </ul>
                                  </td>
                                  <td>
                                      <ul class="list-inline">
                                          <li class="list-inline-item">
                                              <img title={item.uu_Name} alt="Avatar" class="table-avatar" src={`https://ui-avatars.com/api/?name=${item.uu_Name}`} />
                                          </li>
                                      </ul>
                                  </td>
                                  <td class="project-state">
                                      <span class="badge badge-info">{item.s_Name}</span>
                                  </td>
                              </tr>
                            ))
                          }

                        </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    )
  }

}

export default HomeIndex;
