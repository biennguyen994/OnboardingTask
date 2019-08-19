import React, { Component } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

export class FetchStore extends Component {
    static displayName = FetchStore.name;
    show = size => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })
    show1 = size1 => () => this.setState({ size1, open1: true })
    close1 = () => this.setState({ open1: false, sname: null, saddress: null })
    show2 = size2 => () => this.setState({ size2, open2: true })
    close2 = () => this.setState({ open2: false, sname: null, saddress: null })
    constructor(props) {
        super(props);
        this.state = {
            stores: [], loading: true, open: false, storeid: null, open1: false, open2: false, sname: null, saddress: null,
        };
        this.loadData = this.loadData.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getvalue = this.getvalue.bind(this);
        this.onChangeStoreName = this.onChangeStoreName.bind(this);
        this.onChangeStoreAddress = this.onChangeStoreAddress.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.editStore = this.editStore.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const $ = window.$;
        $.ajax({
            url: "api/Stores/GetStore",
            type: "GET",
            success: function (data) {
                this.setState({
                    stores: data,
                    loading: false
                })
            }.bind(this)
        });
    }
    update(id) {
        this.setState({ storeid: id, open1: true });
        const $ = window.$;
        $.ajax({
            url: "api/Stores/GetStore/" + id,
            type: "GET",
            success: function (data) {
                this.setState({
                    sname: data.name,
                    saddress: data.address
                });
                this.loadData();
            }.bind(this)
        });
    }

    //edit a store
    editStore(e) {
        let nid = this.state.storeid;
        e.preventDefault();
        const $ = window.$;
        let data = { id: nid, name: this.state.sname, address: this.state.saddress }
        $.ajax({
            url: "api/Stores/PutStore",
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    open1: false,
                    sname: null,
                    saddress: null
                })
                this.loadData();
            }.bind(this),
            error: function () {
                alert('Please fill out all required fields correctly!');
            }
        });
    }

    getvalue(id) {
        this.setState({ storeid: id, open: true });
    }

    //delete a store
    delete(id) {
        const $ = window.$;
        $.ajax({
            url: "api/Stores/DeleteStore/" + id,
            type: "DELETE",
            success: function (data) {
                this.setState({
                    stores: this.state.stores.filter((rec) => {
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

    //Get value of input onchange 
    onChangeStoreName(e) {
        this.setState({
            sname: e.target.value
        });
    }
    onChangeStoreAddress(e) {
        this.setState({
            saddress: e.target.value
        })
    }

    //Add a new store 
    onSubmit(e) {
        e.preventDefault();
        let data = { name: this.state.sname, address: this.state.saddress }
        const $ = window.$;
        $.ajax({
            url: "api/Stores/PostStore",
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    open2: false,
                    sname: null,
                    saddress: null
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
        let storeList = this.state.stores;
        let storeID = this.state.storeid;
        let tableData = null;
        if (storeList != "") {
            tableData = storeList.map(st =>
                <tr key={st.id}>
                    <td className="three wide">{st.name}</td>
                    <td className="three wide">{st.address}</td>
                    <td className="three wide">
                        <button class="ui yellow button" onClick={this.update.bind(this, st.id)}><i class="edit icon"></i>EDIT</button>
                    </td>
                    <td className="three wide">
                        <button class="ui red button" onClick={this.getvalue.bind(this, st.id)} > <i class="trash icon" i></i>DELETE</button>
                    </td>
                </tr>
            )
        }
        return (

            <div>
                <React.Fragment>
                    <Button className="ui blue button" onClick={this.show2('small')}>New Store</Button>
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
                            <Modal size={size1} open={open1} onClose={this.close1} id="test" dimmer={"blurring"}>
                                <Modal.Header>Edit</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <input placeholder='Store Name' defaultValue={this.state.sname} onChange={this.onChangeStoreName} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Address</label>
                                            <input placeholder='Store Address' defaultValue={this.state.saddress} onChange={this.onChangeStoreAddress} />
                                        </Form.Field>
                                        <Form.Field>
                                        </Form.Field>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close1} className="ui black button">Cancel</Button>
                                    <Button positive icon='checkmark' labelPosition='right' onClick={this.editStore} content='Edit' />
                                </Modal.Actions>
                            </Modal>
                            <Modal size={size} open={open} onClose={this.close} id="test" dimmer={"blurring"} >
                                <Modal.Header>Delete store</Modal.Header>
                                <Modal.Content>
                                    <p>Are you sure?</p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close} className="ui black button">Cancel</Button>
                                    <Button negative icon='x icon' onClick={this.delete.bind(this, storeID)} labelPosition='right' content='Delete' />
                                </Modal.Actions>
                            </Modal>
                            <Modal size={size2} open={open2} onClose={this.close2} id="test" dimmer={"blurring"}>
                                <Modal.Header>Create store</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <input type="text" placeholder='Store Name' defaultValue={this.state.sname} onChange={this.onChangeStoreName} />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Address</label>
                                            <input type="text" placeholder='Store Address' defaultValue={this.state.saddress} onChange={this.onChangeStoreAddress} />
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
