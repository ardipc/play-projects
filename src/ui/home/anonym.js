import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { API_URL } from '../../config/env'
import { toRupiah } from '../../helper/format'
import { Modal, Button } from 'react-bootstrap';

import moment from 'moment-timezone'
import { toast } from 'react-toastify'

import { connect } from 'react-redux'
import Talents from '../talent/list';
import { fetchMyUser } from '../../actions/myUser'

const mapStateToProps = (state) => ({
  loading: state.myUser.loading,
  myUser: state.myUser.user,
  hasErrors: state.myUser.hasErrors
})

const mapDispatchToProps = (dispatch) => ({
  fetchMyUser: () => dispatch(fetchMyUser())
})

class Anonym extends React.Component {

  state = {
    clients: []
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser() {
    let url = `${API_URL}/api/user`;
    axios.get(url).then(res => {
      let client = res.data.filter(item => item.LevelID === 3);
      this.setState({ clients: client })
    })
  }

  render() {
    const { clients } = this.state;

    return (
      <div class="content-wrapper">

        <div class="content">

            <div class="row">
              <div class="col-sm-12" style={{padding: '0px'}}>
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                  <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class=""></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                  </ol>
                  <div class="carousel-inner">
                    <div class="carousel-item active">
                      <img class="d-block w-100" src="/img/pwa2.jpg" style={{objectFit: 'cover'}} alt="Second slide" />
                    </div>
                    <div class="carousel-item">
                      <img class="d-block w-100" src="/img/pwa.png" style={{objectFit: 'cover'}} alt="First slide" />
                    </div>
                    <div class="carousel-item">
                      <img class="d-block w-100" src="/img/mobile.png" style={{objectFit: 'cover'}} alt="Third slide" />
                    </div>
                  </div>
                  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span class="carousel-control-custom-icon" aria-hidden="true">
                      <i class="fas fa-chevron-left"></i>
                    </span>
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span class="carousel-control-custom-icon" aria-hidden="true">
                      <i class="fas fa-chevron-right"></i>
                    </span>
                    <span class="sr-only">Next</span>
                  </a>
                </div>
              </div>
            </div>

            <div class="row p-5" style={{ backgroundColor: 'white' }}>
              <div class="container">
                <div class="row">

                  <div class="col-sm-12 text-center mb-5">
                    <h1>PlayProjects</h1>
                    <h5>Perusahan digital agency dengan expertise dalam pengembangan teknologi digital dan layanan pemasaran digital.</h5>
                  </div>

                  <div class="col-sm-4">
                    <div class="position-relative p-3 bg-success" style={{height: '180px'}}>
                      <div class="ribbon-wrapper">
                        <div class="ribbon bg-danger">
                          New
                        </div>
                      </div>

                      <section>
                        <h5>Web Development</h5>
                        <small>Dengan pertumbuhan hampir 900% dari tahun 2000-2017, pemakaian internet sudah menjadi kebutuhan dalam kehidupan sehari-hari. Gunakan aplikasi web untuk mendorong pertumbuhan bisnis anda.</small>
                      </section>

                    </div>
                  </div>

                  <div class="col-sm-4">
                    <div class="position-relative p-3 bg-success" style={{height: '180px'}}>
                      <div class="ribbon-wrapper">
                        <div class="ribbon bg-warning">
                          Star
                        </div>
                      </div>

                      <section>
                        <h5>Mobile Development</h5>
                        <small>Merupakan sebuah fakta yang tidak bisa dipungkiri kalau pemakaian internet melalui mobile berkembang dengan sangat cepat.</small>
                      </section>

                    </div>
                  </div>

                  <div class="col-sm-4">
                    <div class="position-relative p-3 bg-success" style={{height: '180px'}}>
                      <div class="ribbon-wrapper">
                        <div class="ribbon bg-warning">
                          Star
                        </div>
                      </div>

                      <section>
                        <h5>E-Commerce Development</h5>
                        <small>Tambahkan penjualan anda melalui penjualan online. Dengan memiliki e-commerce atau toko online, anda akan memiliki kanal baru bagi perusahaan anda untuk menaikkan penjualan anda.</small>
                      </section>

                    </div>
                  </div>

                  <div class="col-sm-12 m-2"></div>

                  <div class="col-sm-4">
                    <div class="position-relative p-3 bg-primary" style={{height: '180px'}}>
                      <div class="ribbon-wrapper">
                        <div class="ribbon bg-danger">
                          NEW
                        </div>
                      </div>

                      <section>
                        <h5>Collaboration Teams</h5>
                        <small>Untuk mengoptimalkan pekerjaan dapat menggunakan kolaborasi antar tim anda. Agar semakin cepat untuk menyelesaikan suatu permasalahan yang anda temui.</small>
                      </section>

                    </div>
                  </div>

                  <div class="col-sm-4">
                    <div class="position-relative p-3 bg-primary" style={{height: '180px'}}>
                      <div class="ribbon-wrapper">
                        <div class="ribbon bg-danger">
                          NEW
                        </div>
                      </div>

                      <section>
                        <h5>Google Ads</h5>
                        <small>Iklankan perusahaan atau produk anda ke jaringan situs web yang sangat besar melalui Google Ads Network untuk mencapai jumlah audiens yang luar biasa.</small>
                      </section>

                    </div>
                  </div>

                  <div class="col-sm-4">
                    <div class="position-relative p-3 bg-primary" style={{height: '180px'}}>
                      <div class="ribbon-wrapper">
                        <div class="ribbon bg-danger">
                          New
                        </div>
                      </div>

                      <section>
                        <h5>Instagram Ads</h5>
                        <small>Tampilkan brand dan produk anda menggunakan foto dan video untuk target pasar anda dengan menggunakan aplikasi jaringan sosial Instagram yang luar biasa.</small>
                      </section>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="row p-5">
              <div class="container">
                <div class="row">
                  <div class="col-sm-12 text-center">
                    <h1>Clients</h1>
                    <p>Our passion is to see businesses grow through digital solutions. We work closely with you to ensure that each solution is crafted innovatively into your business. We look forward to grow your business by leveraging the digital platform.</p>
                  </div>

                  {
                    clients.map((item) => (
                      <div class="col-sm-2" style={{marginTop: '24px'}}>
                        <img src={`https://ui-avatars.com/api/?rounded=true&name=${item.Name}`} title={`${item.Name}`} style={{height: '97px'}} />
                      </div>
                    ))
                  }

                </div>
              </div>
            </div>

            <div class="row p-5" style={{ backgroundColor: 'white', padding: '' }}>
              <div class="container">
                <div class="row">
                  <div class="col-sm-12 text-center">
                    <h1>ARE YOU READY FOR JOIN WITH US?</h1>
                    <button class="btn btn-primary mt-4">SIGN UP NOW</button>
                  </div>
                </div>
              </div>
            </div>

        </div>

      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Anonym);
