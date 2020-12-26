import React from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios'
import { API_URL } from '../../config/env'

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

class ProjectDetail extends React.Component{
    state = {
        projectId: this.props.match.params.projectId,

        project: {},

        modul: [],
        task: [],
    }

    setToDone = e => {
      e.preventDefault();
      let getIDModule = e.target.getAttribute('data-id');
      let form = { IsDone: 1 };

      let url = `${API_URL}/api/project_modul/${getIDModule}`;
      axios.patch(url, form).then(res => {
        this.fetchModule(this.state.projectId)
      })
    }

    setToProgress = e => {
      e.preventDefault();
      let getIDModule = e.target.getAttribute('data-id');
      let form = { IsDone: 0 };

      let url = `${API_URL}/api/project_modul/${getIDModule}`;
      axios.patch(url, form).then(res => {
        this.fetchModule(this.state.projectId)
      })
    }

    componentDidMount() {
      this.fetchProjectsDetail(this.state.projectId)
      this.fetchModule(this.state.projectId)
    }

    fetchProjectsDetail(projectId) {
      let url = `${API_URL}/api/xjoin`;
        url += `?_join=ul.user_level,_j,u.user,_j,p.project,_j,uu.user,_j,s.project_status`
        url += `&_on1=(ul.IDLevel,eq,u.LevelID)`
        url += `&_on2=(u.IDUser,eq,p.Client)`
        url += `&_on3=(uu.IDUser,eq,p.Leader)`
        url += `&_on4=(s.IDStatus,eq,p.StatusID)`
        url += `&_fields=p.IDProject,p.Name,p.Description,p.Leader,p.Client,u.Name,p.Leader,uu.Name,p.StartDate,p.EndDate,p.StatusID,s.Name`
        url += `&_where=(p.IDProject,eq,${projectId})`;

      console.log('state: ', url)

      axios.get(url).then(res => {
        let data = res.data;

        console.log('state: ', data)

        if(data.length === 1) {
          this.setState({ project: data[0] })
        }
      })
    }

    fetchModule(projectId) {
      let url = `${API_URL}/api/project/${projectId}/project_modul`;
      axios.get(url).then(res => {
        this.setState({ modul: res.data })
      })
    }

    fetchTask(moduleId) {
      let url = `${API_URL}/api/project_modul/${moduleId}/project_task`;
      axios.get(url).then(res => {
        this.setState({ task: res.data })
      })
    }

    render(){
        return(
            <div class="content-wrapper">
                <div class="content-header">
                    <div class="container">
                        <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0">Detail Project</h1>
                        </div>
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li class="breadcrumb-item active">Detail</li>
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
                                <h3 class="card-title">Projects Detail</h3>

                                <div class="card-tools">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <button type="button" class="btn btn-tool" data-card-widget="remove" title="Remove">
                                    <i class="fas fa-times"></i>
                                </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-12 col-md-12 col-lg-8 order-2 order-md-1">
                                        <div class="row">
                                            <div class="col-12 col-sm-4">
                                                <div class="info-box bg-light">
                                                <div class="info-box-content">
                                                    <span class="info-box-text text-center text-muted">Status project</span>
                                                    <span class="info-box-number text-center text-muted mb-0">{this.state.project.s_Name}</span>
                                                </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <div class="info-box bg-light">
                                                <div class="info-box-content">
                                                    <span class="info-box-text text-center text-muted">Start date</span>
                                                    <span class="info-box-number text-center text-muted mb-0">{moment(this.state.project.p_StartDate).format('DD/MM/YYYY')}</span>
                                                </div>
                                                </div>
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <div class="info-box bg-light">
                                                <div class="info-box-content">
                                                    <span class="info-box-text text-center text-muted">End date</span>
                                                    <span class="info-box-number text-center text-muted mb-0">{moment(this.state.project.p_EndDate).format('DD/MM/YYYY')}</span>
                                                </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-12">
                                                <h4>Modules</h4>
                                                <table class="table table-hover projects">
                                                  <tbody>
                                                    {
                                                      this.state.modul.map(item => (
                                                        <tr>
                                                          <td>#{item.IDModule}</td>
                                                          <td>{item.Name}</td>
                                                          <td>{item.Budget}</td>
                                                          <td>{item.IsDone ? "Done" : "Progress"}</td>
                                                          <td>
                                                            {
                                                              item.Assign &&
                                                              <ul class="list-inline">
                                                                <li class="list-inline-item">
                                                                  <img alt="Avatar" class="table-avatar" src="/dist/img/avatar2.png" />
                                                                </li>
                                                              </ul>
                                                            }

                                                            {
                                                              !item.Assign &&
                                                              <a onClick={this.setToDone} data-id={item.IDModule} class="btn btn-sm btn-primary mr-2">
                                                                Assign to Talent
                                                              </a>
                                                            }
                                                          </td>
                                                          <td>
                                                            {
                                                              item.IsDone === 0 &&
                                                              <a onClick={this.setToDone} data-id={item.IDModule} class="btn btn-sm btn-primary mr-2">
                                                                Set to done
                                                              </a>
                                                            }

                                                            {
                                                              item.IsDone === 1 &&
                                                              <a onClick={this.setToProgress} data-id={item.IDModule} class="btn btn-sm btn-primary mr-2">
                                                                Set to progress
                                                              </a>
                                                            }
                                                          </td>
                                                          <td>
                                                            <i style={{cursor: 'pointer'}} class="fa fa-edit"></i>
                                                          </td>
                                                        </tr>
                                                      ))
                                                    }

                                                  </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-12">
                                                <h4>Activity</h4>
                                                <div class="post">
                                                    <div class="user-block">
                                                    <img class="img-circle img-bordered-sm" src="/dist/img/user1-128x128.jpg" alt="user image" />
                                                    <span class="username">
                                                        <a href="#">Jonathan Burke Jr.</a>
                                                    </span>
                                                    <span class="description">Shared publicly - 7:45 PM today</span>
                                                    </div>
                                                    <p>
                                                    Lorem ipsum represents a long-held tradition for designers,
                                                    typographers and the like. Some people hate it and argue for
                                                    its demise, but others ignore.
                                                    </p>

                                                    <p>
                                                    <a href="#" class="link-black text-sm"><i class="fas fa-link mr-1"></i> Demo File 1 v2</a>
                                                    </p>
                                                </div>

                                                <div class="post clearfix">
                                                    <div class="user-block">
                                                    <img class="img-circle img-bordered-sm" src="/dist/img/user7-128x128.jpg" alt="User Image" />
                                                    <span class="username">
                                                        <a href="#">Sarah Ross</a>
                                                    </span>
                                                    <span class="description">Sent you a message - 3 days ago</span>
                                                    </div>
                                                    <p>
                                                    Lorem ipsum represents a long-held tradition for designers,
                                                    typographers and the like. Some people hate it and argue for
                                                    its demise, but others ignore.
                                                    </p>
                                                    <p>
                                                    <a href="#" class="link-black text-sm"><i class="fas fa-link mr-1"></i> Demo File 2</a>
                                                    </p>
                                                </div>

                                                <div class="post">
                                                    <div class="user-block">
                                                    <img class="img-circle img-bordered-sm" src="/dist/img/user1-128x128.jpg" alt="user image" />
                                                    <span class="username">
                                                        <a href="#">Jonathan Burke Jr.</a>
                                                    </span>
                                                    <span class="description">Shared publicly - 5 days ago</span>
                                                    </div>
                                                    <p>
                                                    Lorem ipsum represents a long-held tradition for designers,
                                                    typographers and the like. Some people hate it and argue for
                                                    its demise, but others ignore.
                                                    </p>

                                                    <p>
                                                    <a href="#" class="link-black text-sm"><i class="fas fa-link mr-1"></i> Demo File 1 v1</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-md-12 col-lg-4 order-1 order-md-2">
                                        <h3 class="text-primary"><i class="fas fa-paint-brush"></i> {this.state.project.p_Name}</h3>
                                        <p class="text-muted">
                                          {this.state.project.p_Description}
                                        </p>
                                        <br />
                                        <div class="text-muted">
                                        <p class="text-sm">Client
                                            <b class="d-block">{this.state.project.u_Name}</b>
                                        </p>
                                        <p class="text-sm">Leader
                                            <b class="d-block">{this.state.project.uu_Name}</b>
                                        </p>
                                        </div>

                                        <h5 class="mt-5 text-muted">Project files</h5>
                                        <ul class="list-unstyled">
                                        <li>
                                            <a href="" class="btn-link text-secondary"><i class="far fa-fw fa-file-word"></i> Functional-requirements.docx</a>
                                        </li>
                                        <li>
                                            <a href="" class="btn-link text-secondary"><i class="far fa-fw fa-file-pdf"></i> UAT.pdf</a>
                                        </li>
                                        <li>
                                            <a href="" class="btn-link text-secondary"><i class="far fa-fw fa-envelope"></i> Email-from-flatbal.mln</a>
                                        </li>
                                        <li>
                                            <a href="" class="btn-link text-secondary"><i class="far fa-fw fa-image "></i> Logo.png</a>
                                        </li>
                                        <li>
                                            <a href="" class="btn-link text-secondary"><i class="far fa-fw fa-file-word"></i> Contract-10_12_2014.docx</a>
                                        </li>
                                        </ul>
                                        <div class="text-center mt-5 mb-3">
                                        <a href="#" class="btn btn-sm btn-primary mr-2">Add files</a>
                                        <a href="#" class="btn btn-sm btn-warning mr-2">Report contact</a>
                                        </div>
                                    </div>
                                </div>
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

export default ProjectDetail;
