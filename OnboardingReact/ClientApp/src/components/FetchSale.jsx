import React, { Component } from 'react';
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class FetchSale extends Component {
    static displayName = FetchSale.name;
    constructor(props) {
        super(props);
        this.state = {
            salesList: [], custList: [], proList: [], storeList: [], stid: null, loading: true,
            cid: null, pid: null, sid: null, ndate: null, adate: null, storeName: null, customerName: null, productName: null
        };
        this.loadData = this.loadData.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.handleCustomerChange = this.handleCustomerChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleStoreChange = this.handleStoreChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.editSale = this.editSale.bind(this);
    }
    show = size => () => this.setState({ size, open: true });
    close = () => this.setState({ open: false });
    show1 = size1 => () => this.setState({ size1, open1: true });
    close1 = () => this.setState({ open1: false, cid: null, pid: null, sid: null, ndate: null, adate: null, storeName: null, customerName: null, productName: null });
    show2 = size2 => () => this.setState({ size2, open2: true });
    close2 = () => this.setState({ open2: false, cid: null, pid: null, sid: null, ndate: null, adate: null, storeName: null, customerName: null, productName: null });

    componentDidMount() {
        this.loadData();
        this.refreshList();
    }

    refreshList() {
        const $ = window.$;
        $.ajax({
            url: "api/Customers/GetCustomer",
            type: "GET",
            success: function (data) { this.setState({ custList: data }) }.bind(this)
        });

        $.ajax({
            url: "api/Products/GetProduct",
            type: "GET",
            success: function (data) {
                this.setState({
                    proList: data,
                    loading: false
                })
            }.bind(this)
        });

        $.ajax({
            url: "api/Stores/GetStore",
            type: "GET",
            success: function (data) {
                this.setState({
                    storeList: data,
                    loading: false
                })
            }.bind(this)
        });
    };

    loadData() {
        const $ = window.$;
        $.ajax({
            url: "api/Sales/GetSales",
            type: "GET",
            success: function (data) {
                this.setState({ salesList: data, loading: false })
            }.bind(this),
        });

    }

    //update a sale record
    update(id) {
        this.setState({ stid: id, open1: true });
        const $ = window.$;
        $.ajax({
            url: "api/Sales/GetSales/" + id,
            type: "GET",
            success: function (data) {
                const cus = this.state.custList.find(x => x.id === data.customerId).name;
                const pro = this.state.proList.find(y => y.id === data.productId).name;
                const sto = this.state.storeList.find(z => z.id === data.storeId).name;
                const date1 = moment(data.dateSold).format("DD-MM-YYYY");
                this.setState({
                    customerName: cus,
                    productName: pro,
                    storeName: sto,
                    adate: date1,
                    cid: data.customerId,
                    pid: data.productId,
                    sid: data.storeId
                })
            }.bind(this)
        });
    }
    getvalue(id) {
        this.setState({ stid: id, open: true });
    }

    editSale(e) {

        let andate = this.state.ndate;
        let ddate = this.state.adate;
        let nid = this.state.stid;
        const $ = window.$;
        let date2 = null;
        if (andate != null) {
            date2 = moment(andate).format("MM-DD-YYYY")
        }
        else if (andate == null) {
            date2 = moment(ddate).format("MM-DD-YYYY")
        }

        let data = { id: nid, customerId: this.state.cid, productId: this.state.pid, storeId: this.state.sid, dateSold: date2 }
        $.ajax({
            url: "api/Sales/EditSales",
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    open1: false,
                    cid: null,
                    pid: null,
                    sid: null,
                })
                this.loadData();
            }.bind(this),
            error: function () {
                alert('Please fill out all required fields correctly!');
            }
        });
    }

    //delete a sale record
    delete(id) {
        const $ = window.$;
        $.ajax({
            url: "api/Sales/DeleteSales/" + id,
            type: "DELETE",
            success: function (data) {
                this.setState({
                    salesList: this.state.salesList.filter((rec) => {
                        return (rec.id != id);
                    }),
                    open: false,
                })
            }.bind(this)
        });
    }

    //Add a new sale record

    handleCustomerChange(e) {
        this.setState({
            cid: e.target.value
        })
    }

    handleProductChange(e) {
        this.setState({
            pid: e.target.value
        })
    }


    handleDateChange(date) {
        this.setState({
            ndate: date
        })
    }

    handleStoreChange(e) {
        this.setState({
            sid: e.target.value
        })
    }

    onSubmit(e) {

        let andate = this.state.ndate;
        const date1 = moment(andate).format("MM-DD-YYYY");
        const $ = window.$;
        if (this.state.cid != '' && this.state.pid != '' && this.state.sid != '' && date1 != '') {
            let data = { customerId: this.state.cid, productId: this.state.pid, storeId: this.state.sid, dateSold: date1 };
            $.ajax({
                url: "api/Sales/PostSales",
                type: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                success: function (data) {
                    this.setState({
                        open2: false,
                        cid: '',
                        pid: '',
                        sid: '',
                    })
                    this.loadData();
                }.bind(this),
                error: function () {
                    alert('Please fill out all required fields correctly!');
                }
            });
        }
    }


    render() {
        let cList = this.state.custList;
        let pList = this.state.proList;
        let sList = this.state.storeList;
        const { open, size } = this.state;
        const { open1, size1 } = this.state;
        let saleList = this.state.salesList;
        let sID = this.state.stid;

        let tableData = null;
        const { open2, size2 } = this.state;
        if (saleList != "") {
            tableData = saleList.map(s =>
                <tr key={s.id}>
                    <td className="two wide">{s.customerName}</td>
                    <td className="two wide">{s.productName}</td>
                    <td className="two wide">{s.storeName}</td>
                    <td className="two wide">{s.dateSold}</td>
                    <td className="two wide">
                        <button class="ui yellow button" onClick={this.update.bind(this, s.id)}><i class="edit icon"></i>EDIT</button>
                    </td>
                    <td className="two wide">
                        <button class="ui red button" onClick={this.getvalue.bind(this, s.id)}> <i class="trash icon" i></i>DELETE</button>
                    </td>
                </tr>
            )
        }
        return (
            <React.Fragment>
                <Button className="ui blue button" onClick={this.show2('small')}>Create Sale</Button>
                <table className="ui striped table">
                    <thead>
                        <tr>
                            <th className="two wide">Customer</th>
                            <th className="two wide">Product</th>
                            <th className="two wide">Store</th>
                            <th className="two wide">Date Sold</th>
                            <th className="two wide">Actions</th>
                            <th className="two wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Modal size={size2} open={open2} onClose={this.close2} id="test12" dimmer={'blurring'} >
                            <Modal.Header>Create sale</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <label>Date Sold</label>
                                        <DatePicker selected={this.state.ndate} onChange={this.handleDateChange} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Customer</label>
                                        <select class="ui dropdown" name="Customer" onChange={this.handleCustomerChange}>
                                            <option value=""></option>
                                            {cList.map(c => (
                                                <option key={c.id} value={c.id}  >
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Product</label>
                                        <select class="ui dropdown" name="Product" onChange={this.handleProductChange}>
                                            <option value=""></option>
                                            {pList.map(p => (
                                                <option key={p.id} value={p.id}  >
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Store</label>
                                        <select class="ui dropdown" name="Store" onChange={this.handleStoreChange}>
                                            <option value=""></option>
                                            {sList.map(s => (
                                                <option key={s.id} value={s.id}  >
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={this.close2} className="ui black button">Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' onClick={this.onSubmit} content='Create' />
                            </Modal.Actions>
                        </Modal>

                        <Modal open={open1} onClose={this.close1} dimmer={"blurring"} id="test12">
                            <Modal.Header>Edit</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <label>Date Sold</label>
                                        <DatePicker selected={this.state.ndate} placeholderText={this.state.adate} dateFormat="dd-MM-yyyy" onChange={this.handleDateChange} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Customer</label>
                                        <select class="ui dropdown" name="Customer" onChange={this.handleCustomerChange}>
                                            <option value={this.state.cid}>{this.state.customerName}</option>
                                            {cList.map(c => (
                                                <option key={c.id} value={c.id}  >
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Product</label>
                                        <select class="ui dropdown" name="Product" onChange={this.handleProductChange}>
                                            <option value={this.state.pid}>{this.state.productName}</option>
                                            {pList.map(p => (
                                                <option key={p.id} value={p.id}  >
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Store</label>
                                        <select class="ui dropdown" name="Store" onChange={this.handleStoreChange}>
                                            <option value={this.state.sid}>{this.state.storeName}</option>
                                            {sList.map(s => (
                                                <option key={s.id} value={s.id}  >
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={this.close1} className="ui black button">Cancel</Button>
                                <Button positive icon='checkmark' labelPosition='right' onClick={this.editSale} content='Edit' />
                            </Modal.Actions>
                        </Modal>

                        <Modal size={size} open={open} onClose={this.close} id="test" dimmer={'blurring'} >
                            <Modal.Header>Delete Sale</Modal.Header>
                            <Modal.Content>
                                <p>Are you sure?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={this.close} className="ui black button">Cancel</Button>
                                <Button negative icon='x icon' onClick={this.delete.bind(this, sID)} labelPosition='right' content='Delete' />
                            </Modal.Actions>
                        </Modal>
                        {tableData}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}
