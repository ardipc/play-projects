import React from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'
import { API_URL } from '../../config/env'

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

class UserLevel extends React.Component {
  state = {
    id: '',
    level: '',

    list: [],
  }

  selectLevel = e => {
    e.preventDefault();
    let LevelID = e.target.getAttribute('data-id');
    let Level = e.target.getAttribute('data-level');
    this.setState({ level: Level, id: LevelID });
  }

  saveLevel = e => {
    e.preventDefault();
    let { id, level } = this.state;

    if(id) {
      // JIKA ID ada maka ACTION UPDATE
      let form = { Level: level };
      let url = `${API_URL}/api/user_level/${id}`;
      axios.patch(url, form).then(res => {
        toast.success('Level has been updated.')
        this.fetchLevel();
        this.clearForm();
      })

    } else {

      // JIKA ID kosong maka ACTION CREATE
      let form = { Level: level };
      let url = `${API_URL}/api/user_level`;
      axios.post(url, form).then(res => {

        toast.success(`New level has been saved.`)
        this.fetchLevel();
        this.clearForm();
      })
    }
  }

  deleteLevel = e => {
    e.preventDefault();
    let LevelID = e.target.getAttribute('data-id');
    let url = `${API_URL}/api/user_level/${LevelID}`;
    axios.delete(url).then(res => {
      toast.info(`Level has been deleted.`)
      this.fetchLevel()
    })
  }

  componentDidMount() {
    this.fetchLevel()
  }

  clearForm() {
    this.setState({ id: '', level: '' });
  }

  fetchLevel() {
    let url = `${API_URL}/api/user_level`;
    axios.get(url).then(res => {
      this.setState({ list: res.data })
    })
  }

  render() {
    return (
      <div class="content-wrapper">

        <div class="content-header">
          <div class="container">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0">User Level</h1>
              </div>
              <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                  <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li class="breadcrumb-item active">User Level</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="container">
            <div class="row">

              <div class="col-sm-4">
                <div class="card">
                  <div class="card-body">
                    <form onSubmit={this.saveLevel}>
                      <div class="form-group">
                        <label>Level</label>
                        <input required onChange={e => this.setState({ level: e.target.value })} value={this.state.level} type="text" class="form-control" />
                      </div>
                      <div class="form-group">
                        <button type="submit" class="btn btn-sm btn-success mr-2"><i class="fas fa-save"></i>&nbsp;Save</button>
                        <button type="button" class="btn btn-sm btn-default"><i class="fas fa-history"></i>&nbsp;Reset</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div class="col-sm-8">
                <div class="card">
                  <div class="card-body">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>LEVEL</th>
                          <th>CREATED AT</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          this.state.list.map(item => (
                            <tr>
                              <td>{item.IDLevel}</td>
                              <td>{item.Level}</td>
                              <td>{moment(item.CreatedAt).format('DD-MM-YYYY HH:mm')}</td>
                              <td>
                                <a onClick={this.selectLevel} data-id={item.IDLevel} data-level={item.Level} class="btn btn-info btn-sm mr-2" href="#">
                                  <i class="fas fa-pencil-alt"></i>&nbsp;Edit
                                </a>
                                <a onClick={this.deleteLevel} data-id={item.IDLevel} class="btn btn-danger btn-sm" href="#">
                                  <i class="fas fa-trash"></i>&nbsp;Delete
                                </a>
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

export default UserLevel;
