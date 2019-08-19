import React, { Component } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

export class FetchCustomer extends Component {
    static displayName = FetchCustomer.name;
    show = size => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })
    show1 = size1 => () => this.setState({ size1, open1: true })
    close1 = () => this.setState({ open1: false, cname: null, caddress: null })
    show2 = size2 => () => this.setState({ size2, open2: true })
    close2 = () => this.setState({ open2: false, cname: null, caddress: null })
    constructor(props) {
        super(props);
        this.state = {
            customers: [], loading: true, open: false, cusid: null, open1: false, open2: false, cname: null,
            caddress: null
        };
        this.loadData = this.loadData.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getvalue = this.getvalue.bind(this);
        this.onChangeCustomerName = this.onChangeCustomerName.bind(this);
        this.onChangeCustomerAddress = this.onChangeCustomerAddress.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const $ = window.$;
        $.ajax({
            url: "api/Customers/GetCustomer",
            type: "GET",
            success: function (data) { this.setState({ customers: data, loading: false }) }.bind(this)
        });
    }

    //get a customer info for update 
    update(id) {
        this.setState({ cusid: id, open1: true });
        const $ = window.$;
        $.ajax({
            url: "api/Customers/TakeCustomer/" + id,
            type: "GET",
            success: function (data) {
                this.setState({
                    cname: data.name,
                    caddress: data.address
                })
            }.bind(this)
        });
    }

    getvalue(id) {
        this.setState({ cusid: id, open: true });
    }

    //edit a customer
    editCustomer(e) {
        let nid = this.state.cusid;
        let data = { id: nid, name: this.state.cname, address: this.state.caddress }
        e.preventDefault();
        const $ = window.$;
        $.ajax({
            url: "api/Customers/EditCustomer",
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    open1: false,
                    cname: null,
                    caddress: null
                })
                this.loadData();
            }.bind(this),
            error: function () {
                alert('Please fill out all required fields correctly!');
            }
        });
    }

    //delete a customer 
    delete(id) {
        const $ = window.$;
        $.ajax({
            url: "api/Customers/DeleteCustomer/" + id,
            type: "DELETE",
            success: function (data) {
                this.setState({
                    customers: this.state.customers.filter((rec) => {
                        return (rec.id != id);
                    }),
                    open: false,
                    cname: null,
                    caddress: null
                })
            }.bind(this),
            error: function () {
                alert('This record could not be deleted because of an association!');
            }
        });
    }

    //Get value of input onchange 
    onChangeCustomerName(e) {
        this.setState({
            cname: e.target.value
        });
    }
    onChangeCustomerAddress(e) {
        this.setState({
            caddress: e.target.value
        })
    }

    //Add a new customer 
    onSubmit(e) {
        e.preventDefault();
        const $ = window.$;
        let data = { name: this.state.cname, address: this.state.caddress }
        $.ajax({
            url: "api/Customers/PostCustomer",
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    open2: false,
                    cname: null,
                    caddress: null
                })
                this.loadData();
            }.bind(this),
            error: function () {
                alert('Please fill out all required fields correctly!');
            }
        });
    }

    render() {
        const { open2, size2 } = this.state;
        const { open1, size1 } = this.state;
        const { open, size } = this.state;
        let custList = this.state.customers;
        let cusID = this.state.cusid;
        let tableData = null;
        if (custList != "") {
            tableData = custList.map(cus =>
                <tr key={cus.id}>
                    <td className="three wide">{cus.name}</td>
                    <td className="three wide">{cus.address}</td>
                    <td className="three wide">
                        <button class="ui yellow button" onClick={this.update.bind(this, cus.id)}><i class="edit icon"></i>EDIT</button>
                    </td>
                    <td className="three wide">
                        <button class="ui red button" onClick={this.getvalue.bind(this, cus.id)} > <i class="trash icon" i></i>DELETE</button>
                    </td>
                </tr>
            )
        }
        return (

            <div>
                <React.Fragment>
                    <Button className="ui blue button" onClick={this.show2('small')}>New Customer</Button>
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="three wide">Name</th>
                                <th className="three wide">Address</th>
                                <th className="three wide">Actions</th>
                                <th className="three wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Modal open={open2} onClose={this.close2} dimmer={"blurring"} id="test">
                                <Modal.Header>Create customer</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <input type="text" placeholder='Name' defaultValue={this.state.cname} onChange={this.onChangeCustomerName} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Address</label>
                                            <input type="text" placeholder='Address' defaultValue={this.state.caddress} onChange={this.onChangeCustomerAddress} />
                                        </Form.Field>
                                        <Form.Field>
                                        </Form.Field>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close2} className="ui black button">Cancel</Button>
                                    <Button positive icon='checkmark' labelPosition='right' onClick={this.onSubmit} content='Create' />
                                </Modal.Actions>
                            </Modal>
                            <Modal open={open} onClose={this.close} id="test" dimmer={"blurring"} >
                                <Modal.Header>Delete customer</Modal.Header>
                                <Modal.Content>
                                    <p>Are you sure?</p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close} className="ui black button">Cancel</Button>
                                    <Button negative icon='x icon' onClick={this.delete.bind(this, cusID)} labelPosition='right' content='Delete' />
                                </Modal.Actions>
                            </Modal>
                            <Modal open={open1} onClose={this.close1} dimmer={"blurring"} id="test">
                                <Modal.Header>Edit</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <input placeholder='Name' defaultValue={this.state.cname} onChange={this.onChangeCustomerName} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Address</label>
                                            <input placeholder='Address' defaultValue={this.state.caddress} onChange={this.onChangeCustomerAddress} />
                                        </Form.Field>
                                        <Form.Field>
                                        </Form.Field>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close1} className="ui black button">Cancel</Button>
                                    <Button positive icon='checkmark' labelPosition='right' onClick={this.editCustomer} content='Edit' />
                                </Modal.Actions>
                            </Modal>
                            {tableData}
                        </tbody>
                    </table>
                </React.Fragment>
            </div>
        )
    }
}

