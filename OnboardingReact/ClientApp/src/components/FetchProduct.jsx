import React, { Component } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

export class FetchProduct extends Component {
    static displayName = FetchProduct.name;
    show = size => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })
    show1 = size1 => () => this.setState({ size1, open1: true })
    close1 = () => this.setState({ open1: false, pname: null, pprice: null })
    show2 = size2 => () => this.setState({ size2, open2: true })
    close2 = () => this.setState({ open2: false, pname: null, pprice: null })
    constructor(props) {
        super(props);
        this.state = {
            products: [], loading: true, open: false, pid: null, open1: false, pname: null, pprice: null, open2: false,
        };
        this.loadData = this.loadData.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getvalue = this.getvalue.bind(this);
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeProductPrice = this.onChangeProductPrice.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const $ = window.$;
        $.ajax({
            url: "api/Products/GetProduct",
            type: "GET",
            success: function (data) {
                this.setState({
                    products: data,
                    loading: false
                })
            }.bind(this)
        });
    }

    //Get a product record by id
    update(id) {
        this.setState({ pid: id, open1: true });
        const $ = window.$;
        $.ajax({
            url: "api/Products/GetProduct/" + id,
            type: "GET",
            success: function (data) {
                this.setState({
                    pname: data.name,
                    pprice: data.price
                });
                this.loadData();
            }.bind(this)
        });
    }

    getvalue(id) {
        this.setState({ pid: id, open: true });
    }

    //Delete a product record
    delete(id) {
        const $ = window.$;
        $.ajax({
            url: "api/Products/DeleteProduct/" + id,
            type: "DELETE",
            success: function (data) {
                this.setState({
                    products: this.state.products.filter((rec) => {
                        return (rec.id != id);
                    }),
                    open: false
                })
            }.bind(this),
            error: function () {
                alert('This record could not be deleted because of an association!');
            }
        });
    }

    //edit a product record
    editProduct(e) {
        let nid = this.state.pid;
        let data = { id: nid, name: this.state.pname, price: this.state.pprice }
        e.preventDefault();
        const $ = window.$;
        $.ajax({
            url: "api/Products/PutProduct",
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    open1: false,
                    pname: null,
                    pprice: null
                })
                this.loadData();
            }.bind(this),
            error: function () {
                alert('Please fill out all required fields correctly!');
            }
        });
    }

    //Get value of input onchange 
    onChangeProductName(e) {
        this.setState({
            pname: e.target.value
        });
    }
    onChangeProductPrice(e) {
        this.setState({
            pprice: e.target.value
        })
    }

    //Add a new product record
    onSubmit(e) {
        e.preventDefault();
        let data = { name: this.state.pname, price: this.state.pprice }
        const $ = window.$;
        $.ajax({
            url: "api/Products/PostProduct",
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    open2: false,
                    pname: null,
                    pprice: null
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
        let proList = this.state.products;
        let pID = this.state.pid;
        let tableData = null;
        if (proList != "") {
            tableData = proList.map(p =>
                <tr key={p.id}>
                    <td className="three wide">{p.name}</td>
                    <td className="three wide">${p.price}</td>
                    <td className="three wide">
                        <button class="ui yellow button" onClick={this.update.bind(this, p.id)}><i class="edit icon"></i>EDIT</button>
                    </td>
                    <td className="three wide">
                        <button class="ui red button" onClick={this.getvalue.bind(this, p.id)} > <i class="trash icon" i></i>DELETE</button>
                    </td>
                </tr>
            )
        }
        return (
            <div>
                <React.Fragment>
                    <Button className="ui blue button" onClick={this.show2('small')}>New Product</Button>
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="three wide">Name</th>
                                <th className="three wide">Price</th>
                                <th className="three wide">Actions</th>
                                <th className="three wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Modal open={open1} onClose={this.close1} dimmer={"blurring"} id="test">
                                <Modal.Header>Edit</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <input placeholder='Name' defaultValue={this.state.pname} onChange={this.onChangeProductName} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Address</label>
                                            <input placeholder='Price' type='number' defaultValue={this.state.pprice} onChange={this.onChangeProductPrice} />
                                        </Form.Field>
                                        <Form.Field>
                                        </Form.Field>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close1} className="ui black button">Cancel</Button>
                                    <Button positive icon='checkmark' labelPosition='right' onClick={this.editProduct} content='Edit' />
                                </Modal.Actions>
                            </Modal>
                            <Modal dimmer={"blurring"} open={open} onClose={this.close} id="test">
                                <Modal.Header>Delete product</Modal.Header>
                                <Modal.Content>
                                    <p>Are you sure?</p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close} className="ui black button">Cancel</Button>
                                    <Button negative icon='x icon' onClick={this.delete.bind(this, pID)} labelPosition='right' content='Delete' />
                                </Modal.Actions>
                            </Modal>
                            <Modal dimmer={"blurring"} open={open2} onClose={this.close2} id="test">
                                <Modal.Header>Create product</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <input type="text" placeholder='Product Name' defaultValue={this.state.pname} onChange={this.onChangeProductName} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Price</label>
                                            <input type="text" type='number' placeholder='Product Price' defaultValue={this.state.pprice} onChange={this.onChangeProductPrice} />
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
                            {tableData}
                        </tbody>
                    </table>
                </React.Fragment>
            </div>
        )
    }
}
