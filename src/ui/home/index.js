import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { API_URL } from '../../config/env'
import { toRupiah } from '../../helper/format'
import { Modal, Button } from 'react-bootstrap';

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

class HomeIndex extends React.Component {

  state = {
    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).IDUser : '',
    name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Name : '',
    level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',

    list: [],

    modul: [],

    module: 0,
    client: 0,
    talent: 0,

    isTask: false,
    idModul: '',
    nameModul: '',
    listTask: [],
  }

  selectTask = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    let name = e.target.getAttribute('data-name')
    this.setState({ idModul: id, nameModul: name, isTask: true })
    this.fetchTaskByModule(id)
  }

  letMeDoIt = e => {
    e.preventDefault()
    if(this.state.userId) {
      if(this.state.level === 2) {
        let userId = e.target.getAttribute('data-user')
        let modulId = e.target.getAttribute('data-modul')

        let cek = `${API_URL}/api/project_modul_candidate?_where=(UserID,eq,${userId})~and(ModuleID,eq,${modulId})`;
        axios.get(cek).then(res => {
          if(res.data.length === 1) {
            toast.info(`Ehh, Kamu sudah pernah ambil modul ini lohh. Coba tunggu informasi dari Administrator yaa...`)
          } else {
            let form = {
              UserID: userId,
              ModuleID: modulId
            };
            let url = `${API_URL}/api/project_modul_candidate`;
            axios.post(url, form).then(res => {
              toast.success(`Tunggu konfirmasi Administrator untuk memilih kamu yaa.`)
              this.setState({ isTask: false, idModul: '', nameModul: '', listTask: [] })
            })
          }
        })
      } else {
        toast.info(`Kamu bukan talent, jadi tidak bisa mengerjakan ini...`)
      }
    } else {
      toast.info(`Masuk ke sistem dulu yaa...`)
    }
  }

  componentDidMount() {
    this.fetchProjects()
    this.fetchUser()
    this.fetchModule()
    this.fetchCountModule()
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
      url += `&_size=6`;
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
    let form = {
      query: `SELECT pm.IDModule, pm.Name AS pm_Name, pm.Budget, pm.IsDone, pm.Assign, p.IDProject, p.StartDate, p.EndDate, p.Name AS p_Name, p.Client, u.Name AS u_Name, count(pt.IDTask) AS t_Count
        FROM project_modul pm JOIN project p ON pm.ProjectID = p.IDProject JOIN user u ON p.Client = u.IDUser LEFT JOIN project_task pt ON pm.IDModule = pt.ModuleID
        WHERE pm.Assign IS null
        GROUP BY pm.IDModule
        ORDER BY pm.IDModule DESC`,
      params: []
    };
    let url = `${API_URL}/dynamic`;
    axios.post(url, form).then(res => {
      this.setState({ modul: res.data })
    })
  }

  fetchCountModule() {
    let url = `${API_URL}/api/project_modul`;
    axios.get(url).then(res => {
      this.setState({ module: res.data.length })
    })
  }

  fetchTaskByModule(moduleId) {
    let url = `${API_URL}/api/project_task?_where=(ModuleID,eq,${moduleId})`;
    axios.get(url).then(res => {
      this.setState({ listTask: res.data })
    })
  }

  render() {

    console.log('state: ', this.state)

    return (
      <div class="content-wrapper">

        <div class="content-header">
          <div class="container-fluid">
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
          <div class="container-fluid">
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

              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Newest Module</h3>

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
                                <th>Name</th>
                                <th>Budget</th>
                                <th>Client</th>
                                <th>Task</th>
                            </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.modul.map(item => (
                              <tr>
                                  <td>#{item.IDModule}</td>
                                  <td>
                                    <a href="#" onClick={this.selectTask} data-id={item.IDModule} data-name={item.pm_Name}>
                                      {item.pm_Name}
                                    </a>
                                    <br/>
                                    <small>
                                      Project on <Link to={`/projects-detail/${item.IDProject}`}>{item.p_Name}</Link>
                                    </small>
                                  </td>
                                  <td>
                                      {toRupiah(item.Budget)}
                                  </td>
                                  <td>
                                      <ul class="list-inline">
                                          <li class="list-inline-item">
                                              <img title={item.u_Name} alt="Avatar" class="table-avatar" src={`https://ui-avatars.com/api/?name=${item.u_Name}`} />
                                          </li>
                                      </ul>
                                  </td>
                                  <td class="project-state">
                                      <span class="badge badge-info">{item.t_Count}</span>
                                  </td>
                              </tr>
                            ))
                          }

                        </tbody>
                    </table>

                    <Modal show={this.state.isTask} onHide={() => this.setState({ isTask: false, idModul: '', nameModul: '', listTask: [] })} animation={false}>
                      <div class="card" style={{marginBottom: 0}}>
                        <div class="card-body login-card-body">
                          <h4>Task on <b>{this.state.nameModul}</b></h4>

                          {
                            this.state.listTask.length === 0 && <span>No task available.</span>
                          }

                          <table class="table mt-3">
                            {
                              this.state.listTask.map(item => (
                                <tr key={item.IDTask}>
                                  <td width="20px">
                                    #{item.IDTask}
                                  </td>
                                  <td style={item.IsDone === 1 ? {textDecoration: 'line-through'} : {}}>{item.Name}</td>
                                </tr>
                              ))
                            }
                          </table>

                          {
                            this.state.level === 2 &&
                            <button onClick={this.letMeDoIt} data-user={this.state.userId} data-modul={this.state.idModul} class="btn btn-sm btn-primary mt-3">Let me do it</button>
                          }

                        </div>
                      </div>
                    </Modal>

                  </div>
                </div>
              </div>


              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Newest Projects</h3>

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
