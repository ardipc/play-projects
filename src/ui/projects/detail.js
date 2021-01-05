import React from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios'
import { API_URL } from '../../config/env'
import { toRupiah, toNumber } from '../../helper/format'

import { Modal, Button } from 'react-bootstrap';

import moment from 'moment-timezone'
import { toast } from 'react-toastify'
import Select from 'react-select'

class ProjectDetail extends React.Component{
    state = {
        projectId: this.props.match.params.projectId,

        project: {},

        files: [],
        isFiles: false,
        idFile: '',
        fileName: '',
        tempFile: Math.random().toString(36),

        modulDone: 0,
        modul: [],
        isModule: false,
        id: '',
        name: '',
        budget: 0,
        assign: '',

        listTalents: [],

        task: [],
        isTask: false,
        idTask: '',
        nameTask: '',

        isCandidate: false,
        listCandidate: [],
        idModul: '',
        nameModul: ''
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

    saveModule = e => {
      e.preventDefault();

      if(this.state.id) {
        // action update patch

        let form = {
          Name: this.state.name,
          Budget: this.state.budget
        };

        if(this.state.assign) {
          form.Assign = this.state.assign.value
        }

        let url = `${API_URL}/api/project_modul/${this.state.id}`;
        axios.patch(url, form).then(res => {
          toast.success(`Module has been updated.`)
          this.fetchModule(this.state.projectId);
          this.clearModule()
        })
      }
      else {
        // action create post
        let form = {
          Name: this.state.name,
          Budget: this.state.budget,
          Assign: this.state.assign.value,
          ProjectID: this.state.projectId
        };

        let url = `${API_URL}/api/project_modul`;
        axios.post(url, form).then(res => {
          toast.success(`Module has been saved.`)
          this.fetchModule(this.state.projectId);
          this.clearModule()
        })
      }
    }

    deleteModule = e => {
      e.preventDefault()
      let id = e.target.getAttribute('data-id');
      let url = `${API_URL}/api/project_modul/${id}`;
      axios.delete(url).then(res => {
        toast.error(`Module has been deleted.`)
        this.fetchModule(this.state.projectId)
      })
    }

    selectModule = e => {
      e.preventDefault();
      let id      = e.target.getAttribute('data-id')
      let name    = e.target.getAttribute('data-name')
      let budget  = e.target.getAttribute('data-budget')
      let assign  = e.target.getAttribute('data-assign')

      let lihatTalents = [...this.state.listTalents];
      let getTalents = lihatTalents.filter(item => item.value == parseInt(assign))

      this.setState({
        isModule: true, id: id, name: name, budget: budget, assign: getTalents[0]
      })
    }

    selectModuleTask = e => {
      e.preventDefault();
      let getIDModule = e.target.getAttribute('data-id');
      let getNameModule = e.target.getAttribute('data-name');
      this.setState({ id: getIDModule, name: getNameModule, isTask: true });
      this.fetchTask(getIDModule);
    }

    setTaskToDone = e => {
      e.preventDefault();
      let IDTask = e.target.getAttribute('data-id');
      let form = { IsDone: 1 };
      let url = `${API_URL}/api/project_task/${IDTask}`;
      axios.patch(url, form).then(res => {
        this.fetchTask(this.state.id);
      })
    }

    setTaskToProgress = e => {
      e.preventDefault();
      let IDTask = e.target.getAttribute('data-id');
      let form = { IsDone: 0 };
      let url = `${API_URL}/api/project_task/${IDTask}`;
      axios.patch(url, form).then(res => {
        this.fetchTask(this.state.id);
      })
    }

    saveTask = e => {
      e.preventDefault();
      let form = { ModuleId: this.state.id, Name: this.state.nameTask };
      let url = `${API_URL}/api/project_task`;
      axios.post(url, form).then(res => {
        toast.success(`Task added.`)
        this.setState({ nameTask: '' })
        this.fetchTask(this.state.id);
      })
    }

    deleteTask = e => {
      e.preventDefault();
      let IDTask = e.target.getAttribute('data-id');
      let url = `${API_URL}/api/project_task/${IDTask}`;
      axios.delete(url).then(res => {
        toast.error(`Task deleted.`)
        this.fetchTask(this.state.id)
      })
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
        let form = { FileName: getFile, ProjectID: this.state.projectId };
        let url = `${API_URL}/api/project_files`;
        axios.post(url, form).then(res => {
          toast.success(`File has been uploaded.`);
          this.fetchFiles(this.state.projectId);
          this.clearFile();
        })
      })
    }

    deleteFile = e => {
      e.preventDefault()
      let IDFiles = e.target.getAttribute('data-id');
      let url = `${API_URL}/api/project_files/${IDFiles}`;
      axios.delete(url).then(res => {
        this.fetchFiles(this.state.projectId);
      })
    }

    showCandidate = e => {
      e.preventDefault()
      let idModul = e.target.getAttribute('data-id')
      let nameModul = e.target.getAttribute('data-name')

      // let url = `${API_URL}/api/project_modul_candidate?_where=(ModuleID,eq,${idModul})`
      let url = `${API_URL}/api/xjoin`;
        url += `?_join=pmc.project_modul_candidate,_j,u.user`
        url += `&_on1=(pmc.UserID,eq,u.IDUser)`
        url += `&_fields=pmc.IDCandidate,pmc.ModuleID,pmc.UserID,u.Name,u.Email,pmc.CreatedAt,pmc.Status`
        url += `&_where=(pmc.ModuleID,eq,${idModul})`;

      axios.get(url).then(res => {
        this.setState({ isCandidate: true, idModul: idModul, nameModul: nameModul, listCandidate: res.data })
      })
    }

    updateAssignModule = e => {
      e.preventDefault()
      let id = e.target.getAttribute('data-id')
      let talent = e.target.getAttribute('data-talent')
      let idModul = this.state.idModul

      let form = {
        Assign: talent
      };
      let url = `${API_URL}/api/project_modul/${idModul}`
      axios.patch(url, form).then(res => {
        toast.success(`Assign talent to module successfully.`)
        this.fetchModule(this.state.projectId)
      })
    }

    removeAssignModule = e => {
      e.preventDefault()
      let id = e.target.getAttribute('data-id')
      let form = { Assign: null };
      let url = `${API_URL}/api/project_modul/${id}`;
      axios.patch(url, form).then(res => {
        toast.info(`Remove all talent from module.`)
        this.fetchModule(this.state.projectId)
      })
    }

    clearModule() {
      this.setState({ name: '', budget: '', assign: '' })
    }

    closeCandidate() {
      this.setState({ isCandidate: false, idModul: '', nameModul: '', listCandidate: [] })
    }

    closeModule() {
      this.setState({ isModule: false, name: '', budget: '', assign: '' })
    }

    clearTask() {
      this.setState({ idTask: '', nameTask: '' })
    }

    clearFile() {
      this.setState({ idFile: '', fileName: '', tempFile: Math.random().toString(36) })
    }

    componentDidMount() {
      this.fetchProjectsDetail(this.state.projectId)
      this.fetchModule(this.state.projectId)
      this.fetchFiles(this.state.projectId)
      this.fetchTalents()
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
      let url = `${API_URL}/api/xjoin`;
        url += `?_join=m.project_modul,_lj,u.user`;
        url += `&_on1=(m.Assign,eq,u.IDUser)`;
        url += `&_fields=m.IDModule,m.Name,m.Budget,m.Assign,u.Name,m.IsDone`;
        url += `&_where=(m.ProjectID,eq,${projectId})`;
      axios.get(url).then(res => {
        let summaryDone = res.data.filter(item => item.m_IsDone === 1);
        this.setState({ modul: res.data, modulDone: summaryDone.length })
      })
    }

    fetchTask(moduleId) {
      let url = `${API_URL}/api/project_modul/${moduleId}/project_task`;
      axios.get(url).then(res => {
        this.setState({ task: res.data })
      })
    }

    fetchTalents() {
      let url = `${API_URL}/api/user?_where=(LevelID,eq,2)`;
      axios.get(url).then(res => {

        let data = [];
        res.data.map(item => {
          data.push({ value: item.IDUser, label: item.Name })
        })

        this.setState({ listTalents: data })
      })
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

    render(){

        console.log('state: ', this.state)

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
                      <li class="breadcrumb-item">
                        <Link to="/">Home</Link>
                      </li>
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
                          {
                            /**
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse">
                            <i class="fas fa-minus"></i>
                            </button>
                            <button type="button" class="btn btn-tool" data-card-widget="remove" title="Remove">
                            <i class="fas fa-times"></i>
                            </button>
                            */
                          }
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-12 col-md-12 col-lg-8 order-2 order-md-1">
                            <div class="row">
                              <div class="col-12 col-sm-3">
                                <div class="info-box bg-light">
                                  <div class="info-box-content">
                                    <span class="info-box-text text-center text-muted">Progress</span>
                                    <span class="info-box-number text-center text-muted mb-0">{this.state.modulDone/this.state.modul.length * 100}%</span>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 col-sm-3">
                                <div class="info-box bg-light">
                                  <div class="info-box-content">
                                    <span class="info-box-text text-center text-muted">Status project</span>
                                    <span class="info-box-number text-center text-muted mb-0">{this.state.project.s_Name}</span>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 col-sm-3">
                                <div class="info-box bg-light">
                                  <div class="info-box-content">
                                    <span class="info-box-text text-center text-muted">Start date</span>
                                    <span class="info-box-number text-center text-muted mb-0">{moment(this.state.project.p_StartDate).format('DD/MM/YYYY')}</span>
                                  </div>
                                </div>
                              </div>
                              <div class="col-12 col-sm-3">
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
                                    <h4>
                                      Modules
                                      <button onClick={e => this.setState({ isModule: true })} class="btn btn-sm btn-primary float-right">
                                        <i class="fa fa-plus"></i>&nbsp;Add module
                                      </button>
                                    </h4>

                                    <table class="table table-hover projects">
                                      <tbody>
                                        {
                                          this.state.modul.map(item => (
                                            <tr>
                                              <td>#{item.m_IDModule}</td>
                                              <td>
                                                <a href="#" onClick={this.selectModuleTask} data-id={item.m_IDModule} data-name={item.m_Name}>
                                                  {item.m_Name}
                                                </a>
                                              </td>
                                              <td>{toRupiah(item.m_Budget)}</td>
                                              <td>{item.m_IsDone ? <span class="badge badge-success">Done</span> : <span class="badge badge-danger">Undone</span>}</td>

                                              <td>
                                                {
                                                  item.m_IsDone === 0 &&
                                                  <a title="Set to done" onClick={this.setToDone} data-id={item.m_IDModule} class="btn btn-sm btn-primary mr-2">
                                                    <i data-id={item.m_IDModule} class="fa fa-check"></i>
                                                  </a>
                                                }

                                                {
                                                  item.m_IsDone === 1 &&
                                                  <a title="Set to progress" onClick={this.setToProgress} data-id={item.m_IDModule} class="btn btn-sm btn-danger mr-2">
                                                    <i data-id={item.m_IDModule} class="fa fa-history"></i>
                                                  </a>
                                                }
                                              </td>
                                              <td class="text-center">
                                                {
                                                  item.m_Assign &&
                                                  <ul class="list-inline">
                                                    <li class="list-inline-item">
                                                      <img title={item.u_Name} alt="Avatar" class="table-avatar" src={`https://ui-avatars.com/api/?name=${item.u_Name}`} />
                                                    </li>
                                                  </ul>
                                                }

                                                {
                                                  !item.m_Assign &&
                                                  <a title="See all candidate" onClick={this.showCandidate} data-name={item.m_Name} data-id={item.m_IDModule} class="btn btn-sm btn-primary mr-2">
                                                    <i data-id={item.m_IDModule} data-name={item.m_Name} class="fa fa-users"></i>
                                                  </a>
                                                }
                                              </td>
                                              <td>
                                                <i title={`Remove assign talents from module.`} onClick={this.removeAssignModule} data-id={item.m_IDModule} style={{cursor: 'pointer'}} class="fa fa-cogs mr-2"></i>
                                                <i onClick={this.selectModule} data-id={item.m_IDModule} data-name={item.m_Name} data-budget={item.m_Budget} data-assign={item.m_Assign} style={{cursor: 'pointer'}} class="fa fa-edit mr-2"></i>
                                                <i onClick={this.deleteModule} data-id={item.m_IDModule} style={{cursor: 'pointer'}} class="fa fa-trash"></i>
                                              </td>
                                            </tr>
                                          ))
                                        }

                                      </tbody>
                                    </table>

                                    <Modal show={this.state.isModule} onHide={this.closeModule.bind(this)} animation={false}>
                                      <div class="card" style={{marginBottom: 0}}>
                                        <div class="card-body login-card-body">

                                          <form onSubmit={this.saveModule}>
                                            <div class="form-group mb-3">
                                              <label>Name</label>
                                              <input onChange={e => this.setState({ name: e.target.value })} value={this.state.name} type="text" class="form-control" placeholder="Name" />
                                            </div>
                                            <div class="form-group mb-3">
                                              <label>Budget</label>
                                              <input onChange={e => this.setState({ budget: e.target.value })} value={this.state.budget} type="number" class="form-control" placeholder="Budget" />
                                            </div>

                                            <div class="form-group mb-3">
                                              <label>Assign to</label>
                                              <Select onChange={e => this.setState({ assign: e })} value={this.state.assign} options={this.state.listTalents} />
                                            </div>
                                            <div class="form-group" style={{marginBottom: 0}}>
                                              <button type="submit" class="btn btn-primary float-right">Save</button>
                                              <button onClick={this.closeModule.bind(this)} type="button" class="btn btn-default">Close</button>
                                            </div>
                                          </form>

                                        </div>
                                      </div>
                                    </Modal>

                                    <Modal show={this.state.isTask} onHide={() => this.setState({ isTask: false, id: '', name: ''})} animation={false}>
                                      <div class="card" style={{marginBottom: 0}}>
                                        <div class="card-body login-card-body">
                                          <h4>Task on module <b>{this.state.name}</b></h4>

                                          <div class="input-group mt-3">
                                            <input onChange={e => this.setState({ nameTask: e.target.value })} value={this.state.nameTask} type="text" class="form-control" />
                                            <span class="input-group-append">
                                              <button onClick={this.saveTask} type="button" class="btn btn-info btn-flat">Add</button>
                                            </span>
                                          </div>

                                          <table class="table mt-3">
                                            {
                                              this.state.task.map(item => (
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
                                                  <td style={item.IsDone === 1 ? {textDecoration: 'line-through'} : {}}>{item.Name}</td>
                                                  <td class="text-right" width="30px">
                                                    <i onClick={this.deleteTask} data-id={item.IDTask} style={{cursor: 'pointer'}} class="fa fa-trash"></i>
                                                  </td>
                                                </tr>
                                              ))
                                            }
                                          </table>

                                        </div>
                                      </div>
                                    </Modal>

                                    <Modal show={this.state.isCandidate} onHide={() => this.closeCandidate()} animation={false}>
                                      <div class="card" style={{marginBottom: 0}}>
                                        <div class="card-body login-card-body">
                                          <h4>Candidate on <b>{this.state.nameModul}</b></h4>

                                          <table class="table projects mt-3">
                                            {
                                              this.state.listCandidate.map(item => (
                                                <tr key={item.pmc_IDCandidate}>
                                                  <td width="20px">
                                                    #{item.pmc_IDCandidate}
                                                  </td>
                                                  <td width="20px">
                                                    <ul class="list-inline">
                                                        <li class="list-inline-item">
                                                            <img title={item.u_Name} alt="Avatar" class="table-avatar" src={`https://ui-avatars.com/api/?name=${item.u_Name}`} />
                                                        </li>
                                                    </ul>
                                                  </td>
                                                  <td>{item.u_Name}</td>
                                                  <td class="text-right" width="30px">
                                                    <i onClick={this.updateAssignModule} data-talent={item.pmc_UserID} data-id={item.pmc_IDCandidate} style={{cursor: 'pointer'}} class="fa fa-check"></i>
                                                  </td>
                                                </tr>
                                              ))
                                            }
                                          </table>

                                        </div>
                                      </div>
                                    </Modal>

                                </div>
                            </div>

                            <div class="row">
                              <div class="col-12">
                                <h4>Activity</h4>

                                <span>Under Construction</span>

                                {
                                  /**

                                <div class="post">
                                  <div class="user-block">
                                    <img class="img-circle img-bordered-sm" src="/dist/img/user1-128x128.jpg" alt="user image" />
                                    <span class="username">
                                                                  <a href="#">Jonathan Burke Jr.</a>
                                                              </span>
                                    <span class="description">Shared publicly - 7:45 PM today</span>
                                  </div>
                                  <p>
                                    Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it and argue for its demise, but others ignore.
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
                                    Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it and argue for its demise, but others ignore.
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
                                    Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it and argue for its demise, but others ignore.
                                  </p>

                                  <p>
                                    <a href="#" class="link-black text-sm"><i class="fas fa-link mr-1"></i> Demo File 1 v1</a>
                                  </p>
                                </div>

                                  */
                                }

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

                            <Modal show={this.state.isFiles} onHide={() => this.setState({ isFiles: false })} animation={false}>
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

                            <div class="mt-2 mb-3">
                              <button onClick={e => this.setState({ isFiles: true })} class="btn btn-sm btn-primary mr-2">Add file</button>
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
