import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { FetchCustomer } from './components/FetchCustomer';
import { FetchProduct } from './components/FetchProduct';
import { FetchStore } from './components/FetchStore';
import { FetchSale } from './components/FetchSale';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <Layout>
        <Route exact path='/' component={FetchCustomer} />
        <Route path='/fetch-customer' component={FetchCustomer} />
        <Route path='/fetch-store' component={FetchStore} />
        <Route path='/fetch-product' component={FetchProduct} />
        <Route path='/fetch-sale' component={FetchSale} />
      </Layout>
    );
  }
}
