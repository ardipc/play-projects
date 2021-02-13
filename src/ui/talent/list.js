import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { API_URL } from '../../config/env'
import { toRupiah } from '../../helper/format'
import { Modal, Button } from 'react-bootstrap';

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

import { connect } from 'react-redux'
import { fetchMyUser } from '../../actions/myUser'

const mapStateToProps = (state) => ({
  loading: state.myUser.loading,
  myUser: state.myUser.user,
  hasErrors: state.myUser.hasErrors
})

const mapDispatchToProps = (dispatch) => ({
  fetchMyUser: () => dispatch(fetchMyUser())
})

class TalentList extends React.Component {

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

    // console.log('state: ', this.state)
    // console.log('props: ', this.props);

    return (
      <div class="row d-flex align-items-stretch">

        {
          this.state.talent.map((item,i) => (
            <div key={item+'-'+i} class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
              <div class="card bg-white" style={{width: '100%'}}>
                <div class="card-header text-muted border-bottom-0">
                  Talent #{item.IDUser}
                </div>
                <div class="card-body pt-0">
                  <div class="row">
                    <div class="col-7">
                      <h2 class="lead"><b>{item.Name}</b></h2>
                      <p class="text-muted text-sm">{item.Headline ? item.Headline.toString().substr(0,70) + '...' : 'Saya talent disini'}</p>
                      <ul class="ml-4 mb-0 fa-ul text-muted">
                        <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> {item.Address ? item.Address : '-'}</li>
                        <li class="small"><span class="fa-li"><i class="fas fa-lg fa-envelope"></i></span> {item.Email}</li>
                        <li class="small"><span class="fa-li"><i class="fas fa-lg fa-stopwatch"></i></span> {moment(item.CreateAt).format('DD/MM/YYYY HH:mm')}</li>
                      </ul>
                    </div>
                    <div class="col-5 text-center">
                      <img title={item.Name} src={`https://ui-avatars.com/api/?name=${item.Name}`} alt="user-avatar" class="img-circle img-fluid" />
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="text-right">
                    {/*
                    <a href="#" class="btn btn-sm bg-teal">
                      <i class="fas fa-comments"></i>
                    </a>
                    */}
                    <Link to={`/talents/${item.IDUser}`} class="btn btn-sm btn-primary ml-2">
                      <i class="fas fa-user"></i> View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        }

      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(TalentList);
