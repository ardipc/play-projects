import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';

import axios from 'axios'
import { API_URL } from '../../config/env'
import { toRupiah } from '../../helper/format'
import { Modal, Button } from 'react-bootstrap';

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

import { connect } from 'react-redux'
import { fetchMyUser } from '../../actions/myUser'

import List from './list';
import Detail from './detail'

const mapStateToProps = (state) => ({
  loading: state.myUser.loading,
  myUser: state.myUser.user,
  hasErrors: state.myUser.hasErrors
})

const mapDispatchToProps = (dispatch) => ({
  fetchMyUser: () => dispatch(fetchMyUser())
})

class TalentIndex extends React.Component {

  state = {
    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).IDUser : '',
    name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Name : '',
    level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',

    client: [],
    talent: [],
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser() {
    let form = {
      query: `SELECT u.IDUser, u.Name, u.Email, u.LevelID, u.CreateAt, ua.* FROM user u LEFT JOIN user_account ua ON u.IDUser = ua.UserID ORDER BY u.IDUser DESC`,
      params: []
    }
    let url = `${API_URL}/dynamic`;
    axios.post(url, form).then(res => {
      let talent = res.data.filter(item => item.LevelID === 2);
      let client = res.data.filter(item => item.LevelID === 3);
      this.setState({ client: client, talent: talent })
    })
  }

  render() {

    console.log('state: ', this.state)
    console.log('propsindex: ', this.props);

    return (
      <div class="content-wrapper">

        <div class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0">Talents PlayProjects</h1>
              </div>
              <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                  <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li class="breadcrumb-item active">Talents</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="container-fluid">

            <Switch>
              <Route path="/talents" exact component={List} />
              <Route path="/talents/:idUser" component={Detail} />
            </Switch>

          </div>
        </div>

      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(TalentIndex);
