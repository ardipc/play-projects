import React from 'react';
import { Link } from 'react-router-dom'

import SocketContext from '../../helper/socket'

import axios from 'axios'
import { API_URL, MACHINE } from '../../config/env'
import { toRupiah, toNumber } from '../../helper/format'

import { Modal, Button } from 'react-bootstrap';

import moment from 'moment-timezone'
import { toast } from 'react-toastify'
import Select from 'react-select'

class ProjectDetail extends React.Component{
    state = {
      userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).IDUser : '',
      nameId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Name : '',
      levelId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',

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
      descModule: '',
      assign: '',

      listTalents: [],

      task: [],
      isTask: false,
      idTask: '',
      nameTask: '',

      isCandidate: false,
      listCandidate: [],
      idModul: '',
      nameModul: '',

      convers: [],
      komentar: '',

      listStatus: [],
      status: {},

      leader: {},

      chat: '',
      chatList: [],

      desc: ''
    }

    setToDone = e => {
      e.preventDefault();
      let getIDModule = e.target.getAttribute('data-id');
      let form = { IsDone: 1 };

      let url = `${API_URL}/api/project_modul/${getIDModule}`;
      axios.patch(url, form).then(res => {
        this.props.socket.emit('request', {event: 'module'})
      })
    }

    setToProgress = e => {
      e.preventDefault();
      let getIDModule = e.target.getAttribute('data-id');
      let form = { IsDone: 0 };

      let url = `${API_URL}/api/project_modul/${getIDModule}`;
      axios.patch(url, form).then(res => {
        this.props.socket.emit('request', {event: 'module'})
      })
    }

    saveModule = e => {
      e.preventDefault();

      if(this.state.id) {
        // action update patch

        let form = {
          Name: this.state.name,
          Budget: this.state.budget,
          Description: this.state.descModule
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
          Description: this.state.descModule,
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
      let desc  = e.target.getAttribute('data-desc')
      let assign  = e.target.getAttribute('data-assign')

      let lihatTalents = [...this.state.listTalents];
      let getTalents = lihatTalents.filter(item => item.value == parseInt(assign))

      this.setState({
        isModule: true, id: id, name: name, budget: budget, descModule: desc, assign: getTalents[0]
      })
    }

    selectModuleTask = e => {
      e.preventDefault();
      let getIDModule = e.target.getAttribute('data-id');
      let getNameModule = e.target.getAttribute('data-name');
      this.setState({ id: getIDModule, name: getNameModule, isTask: true });
      this.fetchTask(getIDModule);
      this.fetchConvers(getIDModule);

      this.props.socket.on('response', (data) => {
        if(data.event === "task") {
          this.fetchConvers(getIDModule);
        }
      })
    }

    setTaskToDone = e => {
      // e.preventDefault();
      // let IDTask = e.target.getAttribute('data-id');
      let IDTask = e.target.value;
      let form = { IsDone: 1 };
      let url = `${API_URL}/api/project_task/${IDTask}`;
      axios.patch(url, form).then(res => {
        this.fetchTask(this.state.id);
      })
    }

    setTaskToProgress = e => {
      // e.preventDefault();
      // let IDTask = e.target.getAttribute('data-id');
      let IDTask = e.target.value;
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
        let split, getFile;

        if(MACHINE === "linux") {
          split = data.split('/');
          getFile = split[2];
        } else {
          split = data.split('\\');
          getFile = split[3];
        }

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
        toast.info(`Remove talent from module.`)
        this.fetchModule(this.state.projectId)
      })
    }

    sendKomentar = e => {
      e.preventDefault()
      let form = {
        Jenis: 2,
        TujuanID: this.state.id,
        UserID: this.state.userId,
        Description: this.state.komentar
      }

      let url = `${API_URL}/api/project_activity`
      axios.post(url, form).then(res => {
        this.setState({ komentar: '' })
        this.props.socket.emit('request', {event: "task"})
        this.fetchConvers(this.state.id)
      })
    }

    updateStatusProject = e => {
      if(this.state.levelId === 1) {

        let form = {
          StatusID: e.value
        }

        let url = `${API_URL}/api/project/${this.state.projectId}`;
        axios.patch(url, form).then(res => {
          toast.success(`Status project updated.`);
          this.props.socket.emit('request', {event: 'project'})
        })
      }
      else {
        toast.info(`Anda siapa mau mengubah status project, hehehee`)
      }
    }

    updateLeaderProject = e => {
      if(this.state.levelId === 1) {
        let form = {
          Leader: e.value
        }

        let url = `${API_URL}/api/project/${this.state.projectId}`;
        axios.patch(url, form).then(res => {
          toast.success(`Leader project updated.`);
          this.props.socket.emit('request', {event: 'project'})
        })
      }
      else {
        toast.info(`Anda siapa mau mengubah status project, hehehee`)
      }
    }

    sendChat = e => {
      e.preventDefault()
      let form = {
        Jenis: 0,
        TujuanID: this.state.projectId,
        UserID: this.state.userId,
        Description: this.state.chat
      }

      let url = `${API_URL}/api/project_activity`
      axios.post(url, form).then(res => {
        this.setState({ chat: '' })
        this.props.socket.emit('request', {event: 'project-conversation'})
      })
    }

    clearModule() {
      this.setState({ name: '', budget: '', assign: '', descModule: '' })
    }

    closeCandidate() {
      this.setState({ isCandidate: false, idModul: '', nameModul: '', listCandidate: [] })
    }

    closeModule() {
      this.setState({ isModule: false, name: '', budget: '', descModule: '', assign: '', idModul: '' })
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
      this.fetchChat(this.state.projectId)
      this.fetchTalents()

      this.props.socket.on('response', (data) => {
        if(data.event === "module") {
          this.fetchModule(this.state.projectId)
        }

        if(data.event === "project-conversation") {
          this.fetchChat(this.state.projectId)
        }

        if(data.event === "project") {
          this.fetchProjectsDetail(this.state.projectId)
        }

      })
    }

    fetchChat(projectId) {
      let url = `${API_URL}/api/xjoin`;
        url += `?_join=u.user,_j,pa.project_activity`
        url += `&_on1=(u.IDUser,eq,pa.UserID)`
        url += `&_fields=pa.IDActivity,u.Name,pa.Description,pa.Jenis,pa.TujuanID,pa.UserID,pa.Link,pa.CreateAt`
        url += `&_where=(pa.TujuanID,eq,${projectId})~and(pa.Jenis,eq,0)`;

      axios.get(url).then(res => {
        this.setState({ chatList: res.data })
      })
    }

    fetchProjectsDetail(projectId) {
      let url = `${API_URL}/api/project_status`;
      axios.get(url).then(async res => {
        let data = [];
        res.data.map(item => {
          data.push({ value: item.IDStatus, label: item.Name });
        })
        this.setState({ listStatus: data })

        let urlT = `${API_URL}/api/user?_where=(LevelID,eq,2)`;
        await axios.get(urlT).then(res => {

          let data = [];
          res.data.map(item => {
            data.push({ value: item.IDUser, label: item.Name })
          })

          this.setState({ listTalents: data })
        })

        let url = `${API_URL}/api/xjoin`;
          url += `?_join=ul.user_level,_j,u.user,_j,p.project,_lj,uu.user,_j,s.project_status`
          url += `&_on1=(ul.IDLevel,eq,u.LevelID)`
          url += `&_on2=(u.IDUser,eq,p.Client)`
          url += `&_on3=(uu.IDUser,eq,p.Leader)`
          url += `&_on4=(s.IDStatus,eq,p.StatusID)`
          url += `&_fields=p.IDProject,p.Name,p.Description,p.Leader,p.Client,u.Name,p.Leader,uu.Name,p.StartDate,p.EndDate,p.StatusID,s.Name`
          url += `&_where=(p.IDProject,eq,${projectId})`;

        await axios.get(url).then(res => {
          let data = res.data;

          if(data.length === 1) {
            let status = this.state.listStatus.filter(item => item.value === data[0].p_StatusID)

            let leader = this.state.listTalents.filter(item => item.value === data[0].p_Leader);
            console.log('leader: ', leader)

            this.setState({ project: data[0], status: status[0], leader: leader[0], desc: data[0].p_Description })
          }
        })
      })
    }

    fetchModule(projectId) {
      let url = `${API_URL}/api/xjoin`;
        url += `?_join=m.project_modul,_lj,u.user`;
        url += `&_on1=(m.Assign,eq,u.IDUser)`;
        url += `&_fields=m.IDModule,m.Name,m.Budget,m.Assign,m.Description,u.Name,m.IsDone`;
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

    updateDesc = e => {
      if(this.state.levelId === 1) {
        let form = {
          Description: this.state.desc
        }
        let url = `${API_URL}/api/project/${this.state.projectId}`
        axios.patch(url, form).then(res => {
          toast.success(`Description updated`)
          this.fetchProjectsDetail(this.state.projectId)
        })
      }
      else {
        toast.info(`Anda siapa mau mengubah status project, hehehee`)
      }
    }

    render(){

        console.log('state: ', this.state)

        return(
          <div class="content-wrapper">
            <div class="content-header">
              <div class="container-fluid">
                <div class="row mb-2">
                  <div class="col-sm-6">
                    <h1 class="m-0">Detail Project</h1>
                  </div>
                  <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                      <li class="breadcrumb-item">
                        <Link to="/">Home</Link>
                      </li>
                      <li onClick={this.sendSocket} class="breadcrumb-item active">Detail</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div class="content">
              <div class="container-fluid">
                <div class="row">

                  <div class="col-sm-8">

                    <div class="card card-primary card-outline">

                      <div class="card-header">
                        <h3 class="text-primary" style={{margin: 0}}>{this.state.project.p_Name}</h3>
                      </div>

                      <div class="card-body">
                        <div class="row">

                          <div class="col-12 col-sm-12">
                            <p class="text-sm"><b>Description</b>
                              <textarea onChange={e => this.setState({ desc: e.target.value })} onBlur={this.updateDesc} class="form-control mb-2" rows="4" value={this.state.desc} />
                            </p>
                          </div>

                          <div class="col-12 col-sm-6">
                            <p class="text-sm"><b>Leader</b>
                              <Select onChange={this.updateLeaderProject} value={this.state.leader} options={this.state.listTalents} />
                            </p>
                          </div>

                          <div class="col-12 col-sm-6">
                            <p class="text-sm"><b>Client</b>
                              <input class="form-control" value={this.state.project.u_Name} />
                            </p>
                          </div>

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
                                <span class="info-box-text text-center text-muted" style={{marginTop: '-6px'}}>Status project</span>
                                <Select onChange={this.updateStatusProject} value={this.state.status} options={this.state.listStatus} />
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

                        <div class="row mt-4">
                            <div class="col-12">
                                <h4>
                                  Modules
                                  {
                                    this.state.levelId === 1 &&
                                    <button onClick={e => this.setState({ isModule: true })} class="btn btn-sm btn-primary float-right">Add</button>
                                  }
                                </h4>

                                <table class="table table-hover projects mt-3">
                                  <tbody>
                                    {
                                      this.state.modul.map(item => (
                                        <tr>
                                          <td>#{item.m_IDModule}</td>
                                          <td>
                                            <Link data-id={item.m_IDModule} data-name={item.m_Name}>
                                              {item.m_Name}
                                            </Link>
                                          </td>
                                          <td>{toRupiah(item.m_Budget)}</td>
                                          <td>{item.m_IsDone ? <span class="badge badge-success">DONE</span> : <span class="badge badge-danger">WIP</span>}</td>

                                          <td>
                                            {
                                              item.m_IsDone === 0 && (this.state.userId === item.m_Assign || this.state.levelId === 1) &&
                                              <a title="Set to done" onClick={this.setToDone} data-id={item.m_IDModule} class="btn btn-sm btn-primary mr-2">
                                                <i data-id={item.m_IDModule} class="fa fa-check"></i>
                                              </a>
                                            }

                                            {
                                              item.m_IsDone === 1 && this.state.levelId === 1 &&
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
                                                  {
                                                    this.state.levelId === 1 &&
                                                    <i title={`Remove assign talents from module.`} onClick={this.removeAssignModule} data-id={item.m_IDModule} style={{cursor: 'pointer'}} class="fa fa-times ml-2"></i>
                                                  }
                                                </li>
                                              </ul>
                                            }

                                            {
                                              !item.m_Assign && this.state.levelId === 1 &&
                                              <a title="See all candidate" onClick={this.showCandidate} data-name={item.m_Name} data-id={item.m_IDModule} class="btn btn-sm btn-primary mr-2">
                                                <i data-id={item.m_IDModule} data-name={item.m_Name} class="fa fa-users"></i>
                                              </a>
                                            }
                                          </td>
                                          <td class="text-center">
                                            {
                                              this.state.levelId === 1 &&
                                              <span>
                                                <i onClick={this.selectModule} data-id={item.m_IDModule} data-name={item.m_Name} data-budget={item.m_Budget} data-desc={item.m_Description} data-assign={item.m_Assign} style={{cursor: 'pointer'}} class="fa fa-edit mr-2"></i>
                                                <i onClick={this.deleteModule} data-id={item.m_IDModule} style={{cursor: 'pointer'}} class="fa fa-trash"></i>
                                              </span>
                                            }
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
                                          <label>Description</label>
                                          <textarea onChange={e => this.setState({ descModule: e.target.value })} value={this.state.descModule} rows="4" class="form-control" placeholder="Desc" />
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

                                <Modal dialogClassName="modal-lg" show={this.state.isTask} onHide={() => this.setState({ isTask: false, id: '', name: ''})} animation={false}>
                                  <div class="card" style={{marginBottom: 0}}>
                                    <div class="card-body login-card-body row">
                                      <div class="col-sm-12 mb-3 text-center">
                                        <h4><b>{this.state.name}</b></h4>
                                      </div>

                                      <div class="col-sm-6">
                                        <h6>All tasks</h6>

                                        <div class="input-group mt-3">
                                          <input onChange={e => this.setState({ nameTask: e.target.value })} value={this.state.nameTask} type="text" class="form-control" />
                                          <span class="input-group-append">
                                            <button onClick={this.saveTask} type="button" class="btn btn-info btn-flat">Add</button>
                                          </span>
                                        </div>

                                        {
                                          this.state.task.length === 0 && <span>No task available.</span>
                                        }


                                        <ul class="todo-list ui-sortable mt-3" data-widget="todo-list">

                                          {
                                            this.state.task.map((item,i) => (
                                              <li class={item.IsDone ? 'done' : ''}>
                                                <div class="icheck-primary d-inline ml-2">
                                                  <input onChange={item.IsDone ? this.setTaskToProgress : this.setTaskToDone} type="checkbox" value={item.IDTask} name={`task${i}`} id={`task${i}`} checked={item.IsDone ? 'checked' : ''} />
                                                  <label for="todoCheck2"></label>
                                                </div>
                                                <span class="text ml-3">{item.Name}</span>
                                                <span onClick={this.deleteTask} data-id={item.IDTask} class="float-right" style={{cursor: 'pointer'}}><i data-id={item.IDTask} class="fa fa-trash"></i></span>
                                              </li>
                                            ))
                                          }

                                        </ul>
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
                                              <img title={this.state.nameId} alt="Avatar" class="img-fluid img-circle img-sm" src={`https://ui-avatars.com/api/?name=${this.state.nameId}`} />

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

                                <Modal show={this.state.isCandidate} onHide={() => this.closeCandidate()} animation={false}>
                                  <div class="card" style={{marginBottom: 0}}>
                                    <div class="card-body login-card-body">
                                      <h4>Candidate on <b>{this.state.nameModul}</b></h4>

                                      <table class="table projects mt-3">
                                        {
                                          this.state.listCandidate.length === 0 && <span>No candidates yet</span>
                                        }
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

                        <div class="row mt-3">
                          <div class="col-12">
                            <h4>
                              Attachments
                              <button onClick={e => this.setState({ isFiles: true })} class="btn btn-sm btn-primary float-right">Add</button>
                            </h4>

                            <ul class="list-unstyled mt-3">
                              {
                                this.state.files.map(item => (
                                  <li>
                                    <div>
                                      <i class={`far fa-fw fa-${item.Icon}`}></i> {item.FileName}

                                      {
                                        this.state.levelId === 1 &&
                                        <i style={{cursor: 'pointer'}} onClick={this.deleteFile} data-id={item.IDFiles} class="fa fa-trash float-right"></i>
                                      }
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

                          </div>
                        </div>

                        {/**
                        <div class="row mt-3">
                          <div class="col-12">
                            <h4>Activity</h4>

                            <span>Under Construction</span>
                            */}

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

                            { /*
                          </div>
                        </div>
                        */ }

                      </div>
                    </div>

                  </div>

                  <div class="col-sm-4">

                    <div class="card card-primary card-outline direct-chat direct-chat-primary">
                      <div class="card-header">
                        <h3 class="text-primary" style={{margin: 0}}>Direct Chat</h3>
                      </div>

                      <div class="card-body">
                        <div class="direct-chat-messages" style={{height: '400px'}}>

                          {
                            this.state.chatList.map((item, i) => (
                              <div class={`direct-chat-msg ${item.pa_UserID == this.state.userId ? 'right' : ''}`} key={i+item.pa_IDActivity}>
                                <div class="direct-chat-infos clearfix">
                                  <span class={`direct-chat-name float-${item.pa_UserID == this.state.userId ? 'right' : 'left'}`}>{item.u_Name}</span>
                                  <span class={`direct-chat-timestamp float-${item.pa_UserID == this.state.userId ? 'left' : 'right'}`}>{moment(item.pa_CreateAt).format('DD MMM YYYY HH:mm')}</span>
                                </div>
                                <img title={item.u_Name} alt="Avatar" class="direct-chat-img" src={`https://ui-avatars.com/api/?name=${item.u_Name}`} />
                                <div class="direct-chat-text">
                                  {item.pa_Description}
                                </div>
                              </div>
                            ))
                          }

                        </div>
                      </div>

                      <div class="card-footer">
                        <form onSubmit={this.sendChat}>
                          <div class="input-group">
                            <input onChange={e => this.setState({ chat: e.target.value })} value={this.state.chat} type="text" name="message" placeholder="Type Message ..." class="form-control" />
                            <span class="input-group-append">
                              <button type="submit" class="btn btn-primary">Send</button>
                            </span>
                          </div>
                        </form>
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

const ProjectDetailSocket = (props) => (
  <SocketContext.Consumer>
    {socket => <ProjectDetail {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default ProjectDetailSocket;
