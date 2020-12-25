import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import axios from 'axios';
import { API_URL } from '../../config/env';

import moment from 'moment-timezone';
import { toast } from 'react-toastify';

class Admins extends React.Component {
    state = {
        id: '',
        name: '',
        email: '',
        pass: '',

        list: [],

        isModal: false,
    }
 
    selectAdmins = e => {
        e.preventDefault();
        let IDUser = e.target.getAttribute('data-id');
        let Name = e.target.getAttribute('data-name');
        let Email = e.target.getAttribute('data-email');
        let Password = e.target.getAttribute('data-pass');
        this.setState({ id: IDUser, name: Name, email: Email, pass: Password, isModal: true })
    }

    saveAdmins = e => {
        e.preventDefault();
        let { id, name, email, pass} = this.state;

        if(id){
            let form = {
                Name: name,
                Email: email,
                Password: pass,
                LevelID: '1'
            };

            let url = `${API_URL}/api/user/${id}`;
            axios.patch(url, form).then( res => {
                this.fetchAdmins()
                this.clearForm();
                toast.success('Admins has been updated')
            })
        }
        else {
            let form = {
                Name: name,
                Email: email,
                Password: pass,
                LevelID: '1'
            };
            let url = `${API_URL}/api/user`;
            axios.post(url, form).then( res => {
                this.fetchAdmins()
                this.clearForm();
                toast.success('New Admins has been saved')
            })
        }
    }

        deleteAdmins = e => {
            e.preventDefault();
            let AdminID = e.target.getAttribute('data-id');
            let url = `${API_URL}/api/user/${AdminID}`;
                axios.delete(url).then (res => {
                    toast.error('Admin has been deleted.')
                    this.fetchAdmins()
                })
        }

        componentDidMount(){
            this.fetchAdmins()
        }

        clearForm() {
            this.setState({ isModal: false, id:'', name:'', email:'', pass:'' })
        }

        fetchAdmins(){
            let url = `${API_URL}/api/user?_where=(LevelID,eq,1)`;
            axios.get(url).then( res => {
                this.setState({ list: res.data})
            })
        }
    


    render(){
        return(
            <div class="content-wrapper">
                <div class="content-header">
                    <div class="container">
                        <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0">Admins</h1>
                        </div>
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li class="breadcrumb-item active">Admins</li>
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
                                <h3 class="card-title">Admins</h3>

                                <div class="card-tools">
                                <button onClick={e => this.setState({ isModal: true })} type="button" class="btn btn-tool border">
                                    <i class="fas fa-plus"></i> Create Admins
                                </button>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-striped projects">
                                <thead>
                                    <tr>
                                    <th>ID</th>
                                    <th>AVATAR</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>CREATED AT</th>
                                    <th>ACTION</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                    this.state.list.map(item => (
                                        <tr>
                                        <td>{item.IDUser}</td>
                                        <td>
                                            <ul class="list-inline">
                                            <li class="list-inline-item">
                                                <img alt="Avatar" class="table-avatar" src={`https://ui-avatars.com/api/?name=${item.Name}`} />
                                            </li>
                                            </ul>
                                        </td>
                                        <td>{item.Name}</td>
                                        <td>{item.Email}</td>
                                        <td>{moment(item.CreatedAt).format('DD-MM-YYYY HH:mm')}</td>
                                        <td>
                                            <a onClick={this.selectAdmins}
                                            data-id={item.IDUser}
                                            data-name={item.Name}
                                            data-email={item.Email}
                                            data-pass={item.Password}
                                            class="btn btn-info btn-sm mr-2" href="#">
                                            <i class="fas fa-pencil-alt"></i>&nbsp;Edit
                                            </a>
                                            <a onClick={this.deleteAdmins} data-id={item.IDUser} class="btn btn-danger btn-sm" href="#">
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

                        <Modal show={this.state.isModal} onHide={this.clearForm.bind(this)} animation={false}>
                            <div class="card" style={{marginBottom: 0}}>
                            <div class="card-body login-card-body">
                                <p class="login-box-msg">{this.state.id ? 'Update' : 'Create'} Admins</p>

                                <form onSubmit={this.saveAdmins}>
                                <div class="input-group mb-3">
                                    <input required onChange={e => this.setState({ name: e.target.value })} value={this.state.name} type="text" class="form-control" placeholder="Name" />
                                    <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-user"></span>
                                    </div>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <input required onChange={e => this.setState({ email: e.target.value })} value={this.state.email} type="email" class="form-control" placeholder="Email" />
                                    <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <input required onChange={e => this.setState({ pass: e.target.value })} value={this.state.pass} type="password" class="form-control" placeholder="Password" />
                                    <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-lock"></span>
                                    </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                    <button type="submit" class="btn btn-primary btn-block">Save</button>
                                    </div><br />
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




export default Admins;