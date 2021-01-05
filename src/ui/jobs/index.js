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
    modulDone: [],

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

  setToDone = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id')
    let name = e.target.getAttribute('data-name')

    let url = `${API_URL}/api/project_modul/${id}`
    axios.patch(url, {IsDone: 1}).then(res => {
      toast.info(`Modul ${name} set to Done`)
      this.fetchModule()
    })
  }

  setTaskToDone = e => {
    e.preventDefault();
    let IDTask = e.target.getAttribute('data-id');
    let form = { IsDone: 1 };
    let url = `${API_URL}/api/project_task/${IDTask}`;
    axios.patch(url, form).then(res => {
      this.fetchTaskByModule(this.state.idModul);
    })
  }

  setTaskToProgress = e => {
    e.preventDefault();
    let IDTask = e.target.getAttribute('data-id');
    let form = { IsDone: 0 };
    let url = `${API_URL}/api/project_task/${IDTask}`;
    axios.patch(url, form).then(res => {
      this.fetchTaskByModule(this.state.idModul);
    })
  }

  componentDidMount() {
    this.fetchModule()
  }

  fetchModule() {
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
      let done = res.data.filter(item => item.IsDone === 1);
      let unDone = res.data.filter(item => item.IsDone === 0);
      this.setState({ modul: unDone, modulDone: done })
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
          <div class="container">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0"> My Jobs</h1>
              </div>
              <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                  <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li class="breadcrumb-item active">Jobs</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="container">
            <div class="row">

              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Jobs Undone</h3>

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
                                <th class="text-center">Action</th>
                                <th>Budget</th>
                                <th>Client</th>
                                <th class="text-center">Task</th>
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
                                      Project on <Link>{item.p_Name}</Link>
                                    </small>
                                  </td>
                                  <td class="text-center">
                                    <a title="Set to done" onClick={this.setToDone} data-name={item.pm_Name} data-id={item.IDModule} class="btn btn-sm btn-primary mr-2">
                                      <i data-name={item.pm_Name} data-id={item.IDModule} class="fa fa-check"></i>
                                    </a>
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

                    <Modal dialogClassName="modal-lg" show={this.state.isTask} onHide={() => this.setState({ isTask: false, idModul: '', nameModul: '', listTask: [] })} animation={false}>
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
                                    {
                                      item.IsDone === 0 &&
                                      <i onClick={this.setTaskToDone} data-id={item.IDTask} style={{cursor: 'pointer'}} class="fa fa-check"></i>
                                    }

                                    {
                                      item.IsDone === 1 &&
                                      <i onClick={this.setTaskToProgress} data-id={item.IDTask} style={{cursor: 'pointer'}} class="fa fa-history"></i>
                                    }
                                  </td>
                                  <td width="20px">
                                    #{item.IDTask}
                                  </td>
                                  <td style={item.IsDone === 1 ? {textDecoration: 'line-through'} : {}}>{item.Name}</td>
                                </tr>
                              ))
                            }
                          </table>

                        </div>
                      </div>
                    </Modal>

                  </div>
                </div>
              </div>

              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Jobs Done</h3>

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
                                <th class="text-center">Task</th>
                            </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.modulDone.map(item => (
                              <tr>
                                  <td>#{item.IDModule}</td>
                                  <td>
                                    <a href="#" onClick={this.selectTask} data-id={item.IDModule} data-name={item.pm_Name}>
                                      {item.pm_Name}
                                    </a>
                                    <br/>
                                    <small>
                                      Project on <Link>{item.p_Name}</Link>
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
