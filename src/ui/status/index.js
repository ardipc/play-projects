import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { API_URL } from '../../config/env';

import moment from 'moment-timezone';
import { toast } from 'react-toastify';

class Status extends React.Component {

    state = {
        id: '',
        name: '',

        list: []
    }

    selectStatus = e => {
        e.preventDefault()
        let IDStatus = e.target.getAttribute('data-id');
        let Name = e.target.getAttribute('data-name');
        this.setState({ id: IDStatus, name: Name });
    }

    saveStatus = e => {
        e.preventDefault();
        let { id, name} = this.state;

        if(id) {
            let form = { Name: name};
            let url = `${API_URL}/api/user/${id}`;
            axios.patch(url, form).then ( res => {
                toast.success('Status has been updated')
                this.fetchStatus();
                this.clearForm();
            })
        }
        else {
            let form = { Name: name};
            let url = `${API_URL}/api/project_status`;
            axios.post(url, form).then( res => {
                toast.success('Status has been saved')
                this.fetchStatus();
                this.clearForm();
            })
        }
    }

    deleteStatus = e => {
        e.preventDefault();
        let IDStatus = e.target.getAttribute('data-id');
        let url = `${API_URL}/api/project_status/${IDStatus}`;
        axios.delete(url).then( res => {
            toast.info('Status has been deleted')
            this.fetchStatus()
        })
    }

    componentDidMount(){
        this.fetchStatus()
    }

    clearForm(){
        this.setState({ id: '', status: ''})
    }

    fetchStatus(){
        let url = `${API_URL}/api/user/project_status`;
        axios.get(url).then( res => {
            this.setState({ list: res.data})
        })
    }

    render(){
        return (
            <div class="content-wrapper">
                <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1 class="m-0">Project status</h1>
                    </div>
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li class="breadcrumb-item active">Project Status</li>
                        </ol>
                    </div>
                    </div>
                </div>
                </div>

                <div class="content">
                <div class="container-fluid">
                    <div class="row">

                    <div class="col-sm-4">
                        <div class="card">
                        <div class="card-body">
                            <form onSubmit={this.saveStatus}>
                            <div class="form-group">
                                <label>Status</label>
                                <input required onChange={e => this.setState({ level: e.target.value })} value={this.state.status} type="text" class="form-control" />
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
                                <th>NAME</th>
                                <th>STATUS</th>
                                <th>CREATED AT</th>
                                <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                this.state.list.map(item => (
                                    <tr>
                                    <td>{item.IDStatus}</td>
                                    <td>{item.Name}</td>
                                    <td class="text-center">Status</td>
                                    <td>{moment(item.CreatedAt).format('DD-MM-YYYY HH:mm')}</td>
                                    <td>
                                        <a onClick={this.selectStatus} data-id={item.IDStatus} data-name={item.Name} class="btn btn-info btn-sm mr-2" href="#">
                                        <i class="fas fa-pencil-alt"></i>&nbsp;Edit
                                        </a>
                                        <a onClick={this.deleteStatus} data-id={item.IDStatus} class="btn btn-danger btn-sm" href="#">
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

export default Status;
