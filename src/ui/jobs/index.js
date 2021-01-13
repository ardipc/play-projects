import React from 'react';
import { Link } from 'react-router-dom';

import SocketContext from '../../helper/socket'

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
    idProject: '',
    idModul: '',
    nameModul: '',
    listTask: [],

    files: [],
    isFiles: false,
    idFile: '',
    fileName: '',
    tempFile: Math.random().toString(36),

    convers: [],
    komentar: '',
  }

  uploadFile = e => {
    e.preventDefault()
    let form = new FormData();
    form.append('file', this.state.fileName[0]);

    let url = `${API_URL}/upload`;
    axios.post(url, form).then(res => {

      let data = res.data;
      let split = data.split('\\');

      let getFile = split[3];
      let form = { FileName: getFile, ProjectID: this.state.idProject };
      let url = `${API_URL}/api/project_files`;
      axios.post(url, form).then(res => {
        toast.success(`File has been uploaded.`);
        this.fetchFiles(this.state.idProject);
        this.clearFile();
      })
    })
  }

  deleteFile = e => {
    e.preventDefault()
    let IDFiles = e.target.getAttribute('data-id');
    let url = `${API_URL}/api/project_files/${IDFiles}`;
    axios.delete(url).then(res => {
      toast.error(`File deleted.`)
      this.fetchFiles(this.state.idProject);
    })
  }

  clearFile() {
    this.setState({ idFile: '', fileName: '', tempFile: Math.random().toString(36) })
  }

  fetchFiles(projectId) {
    let url = `${API_URL}/api/project/${projectId}/project_files`;
    axios.get(url).then(res => {
      let data = [];
      res.data.map(item => {
        let fileName = item.FileName.split('/');
        let splitFormat = fileName[fileName.length-1].split('.');
        let getFormat = splitFormat[splitFormat.length-1] === 'pdf' ? 'file-pdf'
          : ['png','jpg','jpeg'].includes(splitFormat[splitFormat.length-1]) ? 'image'
          : ['doc','docx'].includes(splitFormat[splitFormat.length-1]) ? 'file-word'
          : 'file';
        data.push({IDFiles: item.IDFiles, FileName: fileName[fileName.length-1], Url: item.FileName, Icon: getFormat })
      })
      this.setState({ files: data })
    })
  }

  selectTask = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    let name = e.target.getAttribute('data-name')
    let project = e.target.getAttribute('data-project')
    this.setState({ idModul: id, nameModul: name, idProject: project, isTask: true })
    this.fetchTaskByModule(id)
    this.fetchConvers(id)
    this.fetchFiles(project)

    this.props.socket.on('response', (data) => {
      if(data.event === "task") {
        this.fetchConvers(id);
      }
    })
  }

  sendKomentar = e => {
    e.preventDefault()
    let form = {
      Jenis: 2,
      TujuanID: this.state.idModul,
      UserID: this.state.userId,
      Description: this.state.komentar
    }

    let url = `${API_URL}/api/project_activity`
    axios.post(url, form).then(res => {
      this.setState({ komentar: '' })
      this.props.socket.emit('request', {event: "task"})
      this.fetchConvers(this.state.idModul)
    })
  }

  setToDone = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id')
    let name = e.target.getAttribute('data-name')

    let url = `${API_URL}/api/project_modul/${id}`
    axios.patch(url, {IsDone: 1}).then(res => {
      toast.info(`Modul ${name} set to Done`)
      this.props.socket.emit('request', {event: 'module'})
      this.fetchModule()
    })
  }

  setTaskToDone = e => {
    // e.preventDefault();
    // let IDTask = e.target.getAttribute('data-id');
    let IDTask = e.target.value;
    let form = { IsDone: 1 };
    let url = `${API_URL}/api/project_task/${IDTask}`;
    axios.patch(url, form).then(res => {
      this.fetchTaskByModule(this.state.idModul);
    })
  }

  setTaskToProgress = e => {
    // e.preventDefault();
    // let IDTask = e.target.getAttribute('data-id');
    let IDTask = e.target.value;
    let form = { IsDone: 0 };
    let url = `${API_URL}/api/project_task/${IDTask}`;
    axios.patch(url, form).then(res => {
      this.fetchTaskByModule(this.state.idModul);
    })
  }

  componentDidMount() {
    this.fetchModule()

    this.props.socket.on('response', (data) => {
      if(data.event === "module") {
        this.fetchModule()
      }
    })
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

  fetchConvers(id) {
    let form = {
      query: `SELECT pa.*, u.Name
        FROM project_activity pa JOIN user u ON pa.UserID = u.IDUser
        WHERE pa.Jenis = 2 AND pa.TujuanID = ?
        ORDER BY IDActivity ASC`,
      params: [id]
    }
    let url = `${API_URL}/dynamic`
    axios.post(url, form).then(res => {
      this.setState({ convers: res.data })
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
          <div class="container-fluid">
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
                                    <a href="#" onClick={this.selectTask} data-id={item.IDModule} data-project={item.IDProject} data-name={item.pm_Name}>
                                      {item.pm_Name}
                                    </a>
                                    <br/>
                                    <small>
                                      Project on <Link to={`/projects-detail/${item.IDProject}`}>{item.p_Name}</Link>
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
                                    <a href="#" onClick={this.selectTask} data-project={item.IDProject} data-id={item.IDModule} data-name={item.pm_Name}>
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

                  </div>
                </div>
              </div>

              <Modal dialogClassName="modal-lg" show={this.state.isTask} onHide={() => this.setState({ isTask: false, idModul: '', nameModul: '', idProject: '', listTask: [] })} animation={false}>
                <div class="card" style={{marginBottom: 0}}>
                  <div class="card-body login-card-body row">

                    <div class="col-sm-12 mb-3 text-center">
                      <h4><b>{this.state.nameModul}</b></h4>

                      {
                        this.state.listTask.length === 0 && <span>No task available.</span>
                      }
                    </div>

                    <div class="col-sm-6">
                      <h6>All tasks</h6>
                      <ul class="todo-list ui-sortable" data-widget="todo-list">

                        {
                          this.state.listTask.map((item,i) => (
                            <li class={item.IsDone ? 'done' : ''}>
                              <div class="icheck-primary d-inline ml-2">
                                <input onChange={item.IsDone ? this.setTaskToProgress : this.setTaskToDone} type="checkbox" value={item.IDTask} name={`task${i}`} id={`task${i}`} checked={item.IsDone ? 'checked' : ''} />
                                <label for="todoCheck2"></label>
                              </div>
                              <span class="text ml-3">{item.Name}</span>
                            </li>
                          ))
                        }

                      </ul>

                      <hr/>

                      <h6>Attachment Files</h6>
                      {
                        this.state.files.length === 0 && <span>No files available.</span>
                      }
                      <ul class="list-unstyled">
                        {
                          this.state.files.map(item => (
                            <li>
                              <div>
                                <i class={`far fa-fw fa-${item.Icon}`}></i> {item.FileName}

                                <i style={{cursor: 'pointer'}} onClick={this.deleteFile} data-id={item.IDFiles} class="fa fa-trash float-right"></i>
                                <a href={`${API_URL}/download?name=${item.Url}`} target="_blank" class="btn-link text-secondary">
                                  <i class="fa fa-download float-right mr-2"></i>
                                </a>
                              </div>
                            </li>
                          ))
                        }
                      </ul>

                      <button onClick={e => this.setState({ isFiles: true })} class="btn btn-sm btn-primary mr-2">Add file</button>

                      <Modal style={{ marginTop: '30px'}} show={this.state.isFiles} onHide={() => this.setState({ isFiles: false })} animation={false}>
                        <div class="card" style={{marginBottom: 0}}>
                          <div class="card-body login-card-body">
                            <div class="form-group">
                              <input onChange={e => this.setState({ fileName: e.target.files })} key={this.state.tempFile} type="file" class="form-control" style={{paddingBottom: '37px'}} />
                            </div>
                            <div class="form-group" style={{marginBottom: 0}}>
                              <button onClick={this.uploadFile} type="button" class="btn btn-sm btn-primary float-right">Upload</button>
                              <button onClick={() => this.setState({ isFiles: false })} type="button" class="btn btn-sm btn-default">Close</button>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>

                    <div class="col-sm-6">
                      <h6>Conversations</h6>
                      <div class="p-0">

                        <div class="card-footer card-comments">

                          {
                            this.state.convers.map((item,i) => (
                              <div class="card-comment">
                                <img title={item.Name} class="img-circle img-sm" src={`https://ui-avatars.com/api/?name=${item.Name}`} alt="Avatar" />

                                <div class="comment-text">
                                  <span class="username">
                                    {item.Name}
                                    <span class="text-muted float-right">{moment(item.CreateAt).format('DD/MM/YYYY HH:mm')}</span>
                                  </span>
                                  {item.Description}
                                </div>
                              </div>
                            ))
                          }

                        </div>

                        <div class="card-footer">
                          <form onSubmit={this.sendKomentar}>
                            <img title={this.state.name} alt="Avatar" class="img-fluid img-circle img-sm" src={`https://ui-avatars.com/api/?name=${this.state.name}`} />

                            <div class="img-push">
                              <input required onChange={e => this.setState({ komentar: e.target.value })} value={this.state.komentar} type="text" class="form-control form-control-sm" placeholder="Press enter to post comment" />
                            </div>
                          </form>
                        </div>

                      </div>
                    </div>

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

const HomeIndexSocket = (props) => (
  <SocketContext.Consumer>
    {socket => <HomeIndex {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default HomeIndexSocket;
