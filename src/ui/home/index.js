import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { API_URL } from '../../config/env'
import { toRupiah } from '../../helper/format'
import { Modal, Button } from 'react-bootstrap';

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

import Client from './client';
import Admin from './admin';
import Anonym from './anonym';

class HomeIndex extends React.Component {

  state = {
    level: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).LevelID : '',
  }

  render() {

    const Dash = ({level}) => level == 3 ? <Client /> : level == 1 ? <Admin /> : <Anonym />;

    return (
      <Dash level={this.state.level} />
    )
  }

}

export default HomeIndex;
