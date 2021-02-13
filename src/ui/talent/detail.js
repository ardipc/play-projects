import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import axios from 'axios';
import { API_URL, MACHINE } from '../../config/env';
import { toRupiah } from '../../helper/format'

import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { PDFReader } from 'reactjs-pdf-reader';

class Admins extends React.Component {
    state = {
      idUser: this.props.match.params.idUser,
      talent: {},
      modulDone: [],
      myBalance: 0
    }

    componentDidMount() {
      this.fetchUser()
      this.fetchModule()
    }

    fetchModule() {
      let balance = 0;
      let form = {
        query: `SELECT pm.IDModule, pm.Name AS pm_Name, pm.Description, pm.CreateAt, pm.Budget, pm.IsDone, pm.Assign, p.IDProject, p.StartDate, p.EndDate, p.Name AS p_Name, p.Client, u.Name AS u_Name, count(pt.IDTask) AS t_Count
          FROM project_modul pm JOIN project p ON pm.ProjectID = p.IDProject JOIN user u ON p.Client = u.IDUser LEFT JOIN project_task pt ON pm.IDModule = pt.ModuleID
          WHERE pm.Assign = ?
          GROUP BY pm.IDModule
          ORDER BY pm.IDModule DESC`,
        params: [this.state.idUser]
      };
      let url = `${API_URL}/dynamic`;
      axios.post(url, form).then(res => {
        let undone = res.data.filter(item => item.IsDone === 0);
        let done = res.data.filter(item => item.IsDone === 1);
        done.map(item => {
          balance += item.Budget
        })
        this.setState({ modulDone: res.data, myBalance: balance })
      })
    }

    fetchUser() {
      let form = {
        query: `SELECT u.IDUser, u.Name, u.Email, u.LevelID, u.CreateAt, ua.* FROM user u LEFT JOIN user_account ua ON u.IDUser = ua.UserID WHERE u.IDUser = ? ORDER BY u.IDUser DESC`,
        params: [this.state.idUser]
      }
      let url = `${API_URL}/dynamic`;
      axios.post(url, form).then(res => {
        this.setState({ talent: res.data.length ? res.data[0] : {} })
      })
    }

    render(){
      console.log(this.state, 'state');

      let pecah = (this.state.talent.Headline ? this.state.talent.Headline : '').split('\n');

        return(

          <div class="row">

            <div class="col-md-3">

              <div class="card card-primary card-outline">
                <div class="card-body box-profile">
                  <div class="text-center">
                    <img title={this.state.talent.Name} alt="Avatar" class="profile-user-img img-fluid img-circle" src={`https://ui-avatars.com/api/?name=${this.state.talent.Name}`} />
                  </div>

                  <h3 class="profile-username text-center">{this.state.talent.Name}</h3>

                  <p class="text-muted text-center">{this.state.talent.LevelID === 1 ? 'Admin' : this.state.talent.LevelID === 2 ? `#Talent${this.state.talent.IDUser}` : 'Client'}</p>

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

              <div class="card">
                <div class="card-header p-2">
                  <ul class="nav nav-pills">
                    <li class="nav-item"><a class="nav-link active" href="#activity" data-toggle="tab">Headline</a></li>
                    <li class="nav-item"><a class="nav-link" href="#timeline" data-toggle="tab">Projects Handled</a></li>
                    <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Curriculum Vitae</a></li>
                  </ul>
                </div>
                <div class="card-body">
                  <div class="tab-content">

                    <div class="tab-pane active" id="activity">
                      <div class="post">
                        <div class="user-block">
                          <img class="img-circle img-bordered-sm" src={`https://ui-avatars.com/api/?name=${this.state.talent.Name}`} alt="user image" />
                          <span class="username">
                            <Link>{this.state.talent.Name}</Link>
                          </span>
                          <span class="description">{moment(this.state.talent.CreateAt).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                        <textarea readonly rows={pecah.length+1} value={this.state.talent.Headline} class="form-control" style={{overflowY: 'hidden', height: this.scrollHeight}} />
                      </div>
                    </div>

                    <div class="tab-pane" id="timeline">
                      <div class="timeline timeline-inverse">
                        {
                          this.state.modulDone.map((item,i) => (
                            <>
                              <div class="time-label">
                                <span class={`bg-${item.IsDone ? 'success' : 'primary'}`}>
                                  {moment(item.CreateAt).format('ll')}
                                </span>
                              </div>
                              <div>
                                <i class={`fas fa-envelope bg-${item.IsDone ? 'success' : 'primary'}`}></i>

                                <div class="timeline-item">
                                  <span class="time"><i class="far fa-clock"></i> {moment(item.CreateAt).fromNow()}</span>

                                  <h3 class="timeline-header">
                                    <span class={`badge badge-${item.IsDone ? 'success' : 'primary'}`}>{item.IsDone ? 'DONE' : 'WIP'}</span>
                                    <Link to={`/projects-detail/${item.IDProject}`}> {item.p_Name}</Link> give you job
                                  </h3>

                                  <div class="timeline-body">
                                    <h5>{item.pm_Name}</h5>
                                    <h6><i class="fa fa-stopwatch"></i> {moment(item.StartDate).format('ll')} - {moment(item.EndDate).format('ll')}</h6>

                                    {item.Description}
                                  </div>
                                </div>
                              </div>
                            </>
                          ))
                        }

                        <div>
                          <i class="far fa-clock bg-gray"></i>
                        </div>
                      </div>
                    </div>

                    <div class="tab-pane p-0" id="settings">
                      <div style={{overflow:'hidden'}}>
                        {
                          this.state.talent.hasOwnProperty('CV') && this.state.talent.CV &&
                          <PDFReader showAllPage={true} url={`${API_URL}/download?name=${this.state.talent.CV}`} />
                        }
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




export default Admins;
