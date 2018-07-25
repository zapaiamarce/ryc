import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router'
import barrios from './barrios';
import store from 'store2';
import Link from 'next/link'
import HomeSearchSection from "./home-search-section"
import {getCurrentPosition} from "../../lib/geo"

const LAST_ADDRESS = 'last-address';
const LAST_NEIGHBORHOOD = 'last-neighborhood';


class Container extends PureComponent {
  constructor() {
    super()
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onSubmitAddress = this.onSubmitAddress.bind(this);
    this.searchNearHere = this.searchNearHere.bind(this);
    this.onNeighborhoodChange = this.onNeighborhoodChange.bind(this);

    this.state = {
      address: store.get(LAST_ADDRESS),
      neighborhood: store.get(LAST_NEIGHBORHOOD),
      redirectingToSearch: false
    }
  }
  componentDidMount() {
    // fuerza al componente a tomar el estado del cliente
    this.setState({ 
      a: Math.random(), 
      redirectingToSearch: false
    })
  }
  onAddressChange(e) {
    const { value } = e.target;

    this.setState({
      address: e.target.value
    })
  }
  onNeighborhoodChange(e) {
    const { value } = e.target;
    store.set(LAST_NEIGHBORHOOD, value);

    this.setState({
      neighborhood: e.target.value
    })
  }
  onSubmitAddress(e) {
    const {address, neighborhood} = this.state;

    store.set(LAST_ADDRESS, address);

    Router.push({
      pathname: '/food',
      query: {
        near: address
      }
    })
  }
  async searchNearHere() {
    this.setState({
      redirectingToSearch: true
    })
    
    // this is made like this for safari
    try{
      await getCurrentPosition({
        timeout:10
      });
    }catch(e){
      console.log(e)
    }

    this.setState({
      redirectingToSearch: false
    })

    Router.push({
      pathname: '/food',
      query: {
        near: 'here'
      }
    })
  }
  render() {
    const { redirectingToSearch } = this.state;

    return (
      <div>
        <HomeSearchSection 
          onSearchNearHere={this.searchNearHere} 
          disableSearch={redirectingToSearch}
          
          onAddressChange={this.onAddressChange}
          address={this.state.address}
          onSearchByAddress={this.onSubmitAddress}
        />


        <h1>Buscar comidas:</h1>
        <form onSubmit={this.onSubmitAddress}>
          <div>
            <input
              type="text"
              onChange={this.onAddressChange}
              value={this.state.address}
            />
          </div>
          <div>
            <select
              onChange={this.onNeighborhoodChange}
              value={this.state.neighborhood}
            >
              <option value="">Elegir barrio</option>
              {barrios.map(b => (
                <option value={b} key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <button>
              Cerca de esta dirección
            </button>
          </div>
        </form>
        <br />
        <button onClick={this.searchNearHere}>
          Mi ubicación actual
        </button>
        <div>
          ------------------------------
        </div>
        <div>
          <Link href="/login">
            <button>ingresar</button>
          </Link>
        </div>
      </div>
    );
  }
}

Container.propTypes = {

};

Container.defaultProps = {

}

export default Container;