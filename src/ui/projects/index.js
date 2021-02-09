import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { API_URL } from '../../config/env'

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

import { Modal, Button } from 'react-bootstrap';

import Select from 'react-select'

import { connect } from 'react-redux'
import { fetchMyUser } from '../../actions/myUser'

const stateToProps = (state) => ({
  myUser: state.myUser.user,
  loading: state.myUser.loading,
  hasErrors: state.myUser.hasErrors
})

const dispatchToProps = (dispatch) => ({
  fetchMyUser: () => dispatch(fetchMyUser())
})

class ProjectsIndex extends React.Component {

  state = {
    name: JSON.parse(localStorage.getItem('user')).Name,
    level: JSON.parse(localStorage.getItem('user')).LevelID,

    list: [],

    isProject: false,
    id: '',
    nameProject: '',
    description: '',
    status: '',
    client: '',
    leader: '',
    start: '',
    end: '',

    listClient: [],
    listLeader: [],
    listStatus: [],
  }

  saveProject = e => {
    e.preventDefault();

    if(this.state.id) {
      let form = {
        Name: this.state.nameProject,
        Description: this.state.description,
        StartDate: this.state.start,
        EndDate: this.state.end,

        StatusID: this.state.status.value,
        Client: JSON.parse(localStorage.getItem('user')).IDUser
      };

      if(this.state.level === 1) {
        form.StatusID = this.state.status.value;
        form.Client = this.state.client.value;
        form.Leader = this.state.leader.value;
      }

      let url = `${API_URL}/api/project/${this.state.id}`;
      axios.patch(url, form).then(res => {
        toast.success(`Project successfully updated`)
        this.clearForm()
        this.fetchProjects()
      })
    } else {

      let form = {
        Name: this.state.nameProject,
        Description: this.state.description,
        StartDate: this.state.start,
        EndDate: this.state.end,

        StatusID: 1,
        Client: JSON.parse(localStorage.getItem('user')).IDUser
      };

      if(this.state.level === 1) {
        form.StatusID = this.state.status.value;
        form.Client = this.state.client.value;
        form.Leader = this.state.leader.value;
      }

      let url = `${API_URL}/api/project`;
      axios.post(url, form).then(res => {
        toast.success(`Project successfully created`)
        this.clearForm()
        this.fetchProjects()
      })
    }
  }

  deleteProject = e => {
    e.preventDefault()
    let IDProject = e.target.getAttribute('data-id')
    let url = `${API_URL}/api/project/${IDProject}`
    axios.delete(url).then(res => {
      toast.error(`Project deleted`)
      this.fetchProjects()
    })
  }

  selectProject = e => {
    e.preventDefault()
    let IDProject = e.target.getAttribute('data-id')
    let url = `${API_URL}/api/project/${IDProject}`
    axios.get(url).then(res => {

      let status = this.state.listStatus.filter(item => item.value === res.data[0].StatusID);
      let client = this.state.listClient.filter(item => item.value === res.data[0].Client);
      let leader = this.state.listLeader.filter(item => item.value === res.data[0].Leader);

      console.log(res.data, status, client, leader)

      this.setState({
        isProject: true,
        id: res.data[0].IDProject,
        nameProject: res.data[0].Name,
        description: res.data[0].Description,
        status: status[0],
        client: client[0],
        leader: leader[0],
        start: moment(res.data[0].StartDate).format('YYYY-MM-DD'),
        end: moment(res.data[0].EndDate).format('YYYY-MM-DD')
      })
    })
  }

  componentDidMount() {
    this.fetchProjects()
    this.fetchUser()
    this.fetchStatus()

    this.props.fetchMyUser()
  }

  clearForm() {
    this.setState({
      isProject: false, id: '', nameProject: '', description: '', status: '', client: '', leader: '', start: '', end: ''
    })
  }

  fetchProjects() {
    let url = `${API_URL}/api/xjoin`;
      url += `?_join=ul.user_level,_j,u.user,_j,p.project,_lj,uu.user,_j,s.project_status`
      url += `&_on1=(ul.IDLevel,eq,u.LevelID)`
      url += `&_on2=(u.IDUser,eq,p.Client)`
      url += `&_on3=(uu.IDUser,eq,p.Leader)`
      url += `&_on4=(s.IDStatus,eq,p.StatusID)`
      url += `&_fields=p.IDProject,p.Name,p.Description,p.Leader,p.Client,p.CreateAt,u.Name,p.Leader,uu.Name,p.StartDate,p.EndDate,p.StatusID,s.Name`
      url += `&_sort=-p.IDProject`;

    if(this.state.level === 3) {
      url += `&_where=(p.Client,eq,${JSON.parse(localStorage.getItem('user')).IDUser})`;
    }
    axios.get(url).then(res => {
      this.setState({ list: res.data })
    })
  }

  fetchStatus() {
    let url = `${API_URL}/api/project_status`;
    axios.get(url).then(res => {
      let data = [];
      res.data.map(item => {
        data.push({ value: item.IDStatus, label: item.Name });
      })
      this.setState({ listStatus: data })
    })
  }

  fetchUser() {
    let url = `${API_URL}/api/user`;
    axios.get(url).then(res => {
      let client = [];
      res.data.filter(item => item.LevelID === 3).map(item => { client.push({ value: item.IDUser, label: item.Name }) });

      let leader = [];
      res.data.filter(item => item.LevelID === 2).map(item => { leader.push({ value: item.IDUser, label: item.Name }) });

      this.setState({ listClient: client, listLeader: leader })
    })
  }

  render() {

    console.log('state: ', this.state)
    console.log('props: ', this.props)

    return (
      <div class="content-wrapper">

        <div class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0"> Welcome back <b>{this.state.name}</b></h1>
                <p>{this.props.myUser.title}</p>
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

              <div class="col-sm-12">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Projects</h3>

                    <div class="card-tools">
                      <button onClick={() => this.setState({ isProject: true })} type="button" class="btn btn-tool border">
                        <i class="fas fa-plus"></i> Create Project
                      </button>
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
                                <th class="text-center">Action</th>
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
                                      <span class={`badge badge-${item.s_Name === "Done" ? "success" : item.s_Name === "Canceled" ? "danger" : item.s_Name === "On Hold" ? "warning" : "primary"}`}>{item.s_Name.toUpperCase()}</span>
                                  </td>
                                  <td class="project-actions text-center">
                                    <i onClick={this.selectProject} data-id={item.p_IDProject} style={{cursor: 'pointer'}} class="fas fa-pencil-alt mr-2"></i>
                                    <i onClick={this.deleteProject} data-id={item.p_IDProject} style={{cursor: 'pointer'}} class="fas fa-trash"></i>
                                  </td>
                              </tr>
                            ))
                          }

                        </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <Modal dialogClassName="modal-lg" show={this.state.isProject} onHide={() => this.clearForm()} animation={false}>
                <div class="card" style={{marginBottom: 0}}>
                  <div class="card-body login-card-body">

                    <form onSubmit={this.saveProject}>

                      <div class="form-group mb-3">
                        <label>Name</label>
                        <input onChange={e => this.setState({ nameProject: e.target.value })} value={this.state.nameProject} type="text" class="form-control" placeholder="Name" />
                      </div>

                      <div class="form-group mb-3">
                        <label>Description</label>
                        <textarea onChange={e => this.setState({ description: e.target.value })} value={this.state.description} rows="4" class="form-control" placeholder="Description" />
                      </div>

                      <div class="form-group mb-3 row">
                        <div class="col-sm-4">
                          <label>Start Date</label>
                          <input onChange={e => this.setState({ start: e.target.value })} value={this.state.start} type="date" class="form-control" placeholder="Date" />
                        </div>
                        <div class="col-sm-4">
                          <label>End Date</label>
                          <input onChange={e => this.setState({ end: e.target.value })} value={this.state.end} type="date" class="form-control" placeholder="Date" />
                        </div>
                        {
                          this.state.level === 1 &&
                          <div class="col-sm-4">
                            <label>Status</label>
                            <Select onChange={e => this.setState({ status: e })} value={this.state.status} options={this.state.listStatus} />
                          </div>
                        }

                      </div>

                      {
                        this.state.level === 1 &&

                        <div class="form-group mb-3 row">
                          <div class="col-sm-6">
                            <label>Client</label>
                            <Select onChange={e => this.setState({ client: e })} value={this.state.client} options={this.state.listClient} />
                          </div>
                          <div class="col-sm-6">
                            <label>Leader</label>
                            <Select onChange={e => this.setState({ leader: e })} value={this.state.leader} options={this.state.listLeader} />
                          </div>
                        </div>
                      }

                      <div class="form-group" style={{marginBottom: 0}}>
                        <button type="submit" class="btn btn-primary float-right">Save</button>
                        <button onClick={() => this.clearForm()} type="button" class="btn btn-default">Close</button>
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

export default connect(stateToProps, dispatchToProps)(ProjectsIndex);
