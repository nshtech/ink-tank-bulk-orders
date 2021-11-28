import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { ToggleButton } from 'primereact/togglebutton';
import { RadioButton } from 'primereact/radiobutton';
import { p } from 'react';

import firebase from 'firebase/app';
import 'firebase/database';

import validator from 'validator'


import customerData from '../customers.json';
// import classNames from 'classnames';

import '../Dashboard.css';
//import { arrayToHash } from '@fullcalendar/core/util/object';


export class OrderTracker extends Component {

    constructor() {
        super();
        this.state = {
            bulk_orders: [],
            selectedStatus: null,
            selectedTeamMember: null,
            selectedToggle: null,
            editing: false,
            loading: true,
            selectedOrders: null,
            planYesNo: [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' }
            ]
        };
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.export = this.export.bind(this);
        this.onStatusFilterChange = this.onStatusFilterChange.bind(this);
        this.onTeamMemberFilterChange = this.onTeamMemberFilterChange.bind(this);
        this.bagStatusEditor = this.bagStatusEditor.bind(this)
        this.displaySelection = this.displaySelection.bind(this)
        this.loadInitialState = this.loadInitialState.bind(this)
        this.generalEditor = this.generalEditor.bind(this);
        this.dropdownEditor = this.dropdownEditor.bind(this);



    }
    export() {
        this.dt.exportCSV();
    }

    /* --------------- Editing ---------------- */
    edit() {
        this.setState({ editing: true });
    }

    save() {
        this.setState({ editing: false });
    }

    async onEditorValueChange(props, value) {
        console.log('value: ', value, '\tfield: ', props.field);
        firebase.database().ref('/bulk_orders/' + props.rowData.order_id + '/' + props.field).set(value)
        let updatedOrders = this.state.bulk_orders;
        updatedOrders[props.rowIndex][props.field] = value;
        const db = firebase.database().ref();
        var currDay = new Date().getDate();
        var currMonth = new Date().getMonth() + 1;
        if (currMonth < 10) {
            currMonth = '0' + currMonth
        }
        if (currDay < 10) {
            currDay = '0' + currDay
        }
        var currYear = new Date().getFullYear();
        var currDate = currYear + '-' + currMonth + '-' + currDay;
        var currTime = new Date().toLocaleTimeString('it-IT');
        db.child('/history/' + currDate + props.rowData.order_id).once("value")
            .then(snapshot => {
                if (!snapshot.val()) {
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id).set(0)
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/blank').set(props.rowData.blank);
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/design').set(props.rowData.design);
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/id').set(props.rowData.order_id);
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/team_member').set(props.rowData.team_member);
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/status').set(props.rowData.status);
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/final_total').set(props.rowData.final_total);
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/order_quote').set(props.rowData.order_quote);
                    db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/quantity').set(props.rowData.quantity);
                }
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/date').set(currDate + ' ' + currTime);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/blank').set(props.rowData.blank);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/design').set(props.rowData.design);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/id').set(props.rowData.order_id);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/team_member').set(props.rowData.team_member);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/status').set(props.rowData.status);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/final_total').set(props.rowData.final_total);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/order_quote').set(props.rowData.order_quote);
                db.child('/history/' + currDate + ' ' + currTime + ' - ' + props.rowData.order_id + '/quantity').set(props.rowData.quantity);

            })
        firebase.database().ref('/history/' + props.rowData.order_id + '/last_quote_updated').set(currDate + ' ' + currTime)

    }

    inputTextEditor(props, field) {
        console.log('props.rowData[props.field]: ', props.rowData[props.field]);

        if (field === "design" || field === "tax_exempt") {
            return <InputText type="text" value={props.rowData[props.field]} tooltip="Yes or No only" placeholder={props.rowData[props.field]} className="p-inputtext-sm p-d-block p-mb-2" style={{ maxWidth: 100 }} onChange={(e) => { this.onEditorValueChange(props, e.target.value); }} />

        }
        return <InputText type="text" value={props.rowData[field]} placeholder={props.rowData[field]} className="p-inputtext-sm p-d-block p-mb-2" style={{ maxWidth: 100 }} onChange={(e) => { this.onEditorValueChange(props, e.target.value); }} />
    }

    dropdownEditor(props, field) {
        //return <Dropdown value={props.rowData[field]} style={{ width: 20 }} options={this.state.planYesNo} onChange={(e) => { this.onEditorValueChange(props, e.target.value); }} />
        //return <SelectButton value={this.state.planYesNo[props.rowData[field]]} options={this.state.planYesNo} style={{ maxWidth: 100 }} onChange={(e) => { this.onEditorValueChange(props, e.label); }} />
        //this.setState({selectedToggle: props.rowData[field]})
        //return <ToggleButton checked={props.rowData[field]} onChange={(e) => {this.onEditorValueChange(props, e.value); }} onLabel="Yes" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times" />
        let choice = props.rowData[props.field];
        return <div className="card">
            <div className="p-field-radiobutton">
                <RadioButton inputId="choice1" name="yes" value={choice} onChange={(e) => { choice = e.value; this.onEditorValueChange(props, e.value); }} checked={choice === 'Yes'} />
                <label >Yes</label>
            </div>
            <div className="p-field-radiobutton">
                <RadioButton inputId="choice2" name="no" value={choice} onChange={(e) => { choice = e.value; this.onEditorValueChange(props, e.value); }} checked={choice === 'No'} />
                <label >No</label>
            </div>
        </div>
    }

    generalEditor(props, field) {
        return this.inputTextEditor(props, field);
    }

    quoteEditor(props) {
        return this.generalEditor(props, 'order_quote');
    }

    totalEditor(props) {
        return this.generalEditor(props, 'final_total');
    }

    quantityEditor(props) {
        return this.generalEditor(props, 'quantity');
    }


    bagStatusEditor(allorders, currentorder, newstatus) {
        let updatedOrders = [...allorders];
        const db = firebase.database().ref()
        var currDay = new Date().getDate();
        var currMonth = new Date().getMonth() + 1;
        if (currMonth < 10) {
            currMonth = '0' + currMonth
        }
        if (currDay < 10) {
            currDay = '0' + currDay
        }
        var currYear = new Date().getFullYear();
        var currDate = currYear + '-' + currMonth + '-' + currDay;
        //var currDate = new Date().toDateString();
        var currTime = new Date().toLocaleTimeString('it-IT');

        if (currentorder) {
            var ids = Object.keys(currentorder).map(function (key) {
                return currentorder[key].order_id;
            });
            updatedOrders.map(each => {
                if (ids.includes(each.order_id)) {
                    each.status = newstatus;
                    if (newstatus === 'cancelled') {
                        each.final_total = 'N/A'
                        db.child('/bulk_orders/' + each.order_id + '/active').set('False');
                    }
                    if (newstatus === 'fulfilled') {
                        db.child('/bulk_orders/' + each.order_id + '/active').set('False');
                    }
                    firebase.database().ref('/bulk_orders/' + each.order_id + '/last_status_updated').set(currDate + ' ' + currTime)

                    db.child('/history/' + currDate + each.order_id).once("value")
                        .then(snapshot => {
                            if (!snapshot.val()) { //why is each.id undefined on firebase?
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id).set(0)
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/blank').set(each.blank);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/design').set(each.design);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/id').set(each.order_id);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/team_member').set(each.team_member);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/status').set(each.status);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/final_total').set(each.final_total);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/order_quote').set(each.order_quote);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/quantity').set(each.quantity);
                            }
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/date').set(currDate + ' ' + currTime);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/design').set(each.design);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/id').set(each.order_id);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/team_member').set(each.team_member);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/status').set(each.status);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/final_total').set(each.final_total);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/order_quote').set(each.order_quote);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/quantity').set(each.quantity);

                        })

                }
            })
            this.setState({ bulk_orders: updatedOrders });
        }
        console.log('bagStatusEditor currentorder: ', currentorder);
        this.dothisfirst(currentorder, newstatus)

    }


    dothisfirst(currentorder, newstatus) {
        console.log('currentorder: ', currentorder);
        console.log('newstatus: ', newstatus);
        if (currentorder) {
            var ids = Object.keys(currentorder).map(function (key) {
                return currentorder[key].order_id;
            });
            console.log('ids: ', ids);
            var query = firebase.database().ref("bulk_orders").orderByKey();
            query.once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var key = childSnapshot.key;
                        console.log('key: ', key);
                        if (ids.includes(key)) {
                            var key = childSnapshot.key;
                            firebase.database().ref('/bulk_orders/' + key + '/' + "status").set(newstatus);
                            console.log('currentorder in forEach: ', currentorder);

                        }
                    });
                });
        }
        return currentorder
    }

    teammemberEditor(allorders, currentorder, newteammember) {
        let updatedOrders = [...allorders];
        const db = firebase.database().ref()
        var currDay = new Date().getDate();
        var currMonth = new Date().getMonth() + 1;
        if (currMonth < 10) {
            currMonth = '0' + currMonth
        }
        if (currDay < 10) {
            currDay = '0' + currDay
        }
        var currYear = new Date().getFullYear();
        var currDate = currYear + '-' + currMonth + '-' + currDay;
        //var currDate = new Date().toDateString();
        var currTime = new Date().toLocaleTimeString('it-IT');

        if (currentorder) {
            var ids = Object.keys(currentorder).map(function (key) {
                return currentorder[key].order_id;
            });
            updatedOrders.map(each => {
                if (ids.includes(each.order_id)) {
                    each.team_member = newteammember;
                    firebase.database().ref('/bulk_orders/' + each.order_id + '/last_status_updated').set(currDate + ' ' + currTime)

                    db.child('/history/' + currDate + each.order_id).once("value")
                        .then(snapshot => {
                            if (!snapshot.val()) {
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id).set(0)
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/blank').set(each.blank);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/design').set(each.design);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/id').set(each.order_id);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/team_member').set(each.team_member);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/status').set(each.status);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/final_total').set(each.final_total);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/order_quote').set(each.order_quote);
                                db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/quantity').set(each.quantity);
                            }
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/date').set(currDate + ' ' + currTime);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/design').set(each.design);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/id').set(each.order_id);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/team_member').set(each.team_member);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/status').set(each.status);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/final_total').set(each.final_total);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/order_quote').set(each.order_quote);
                            db.child('/history/' + currDate + ' ' + currTime + ' - ' + each.order_id + '/quantity').set(each.quantity);

                        })

                }
            })
            this.setState({ bulk_orders: updatedOrders });
        }
        console.log('bagStatusEditor currentorder: ', currentorder);
        this.dothisfirst_teammember(currentorder, newteammember)

    }


    dothisfirst_teammember(currentorder, newteammember) {
        console.log('currentorder: ', currentorder);
        console.log('newteammember: ', newteammember);
        if (currentorder) {
            var ids = Object.keys(currentorder).map(function (key) {
                return currentorder[key].order_id;
            });
            console.log('ids: ', ids);
            var query = firebase.database().ref("bulk_orders").orderByKey();
            query.once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var key = childSnapshot.key;
                        if (ids.includes(key)) {
                            var key = childSnapshot.key;
                            firebase.database().ref('/bulk_orders/' + key + '/' + "team_member").set(newteammember);
                            console.log('currentorder in forEach: ', currentorder);

                        }
                    });
                });
        }
        return currentorder
    }



    displaySelection(data) {
        if (this.state.editing && (!data || data.length === 0)) {
            return <div style={{ textAlign: 'left' }}>No Selection</div>;
        }
    }


    /* --------------- Filters ---------------- */

    //dropdown for status
    statusBodyTemplate(rowData) {
        var orderStatusDisplay = {
            'quote': 'quote',
            'confirmed': 'confirmed',
            'invoiced': 'invoiced',
            'in-production': 'in production',
            'shipped': 'shipped',
            'fulfilled': 'fulfilled',
            'cancelled': 'cancelled'
        }
        return <span className={rowData.status}>{orderStatusDisplay[rowData.status]}</span>;
    }

    renderStatusFilter() {
        var statuses = [
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'In Production', value: 'in production' },
            { label: 'Invoiced', value: 'invoiced' },
            { label: 'Fulfilled', value: 'fulfilled' },
            { label: 'Shipped', value: 'Shipped' },
            { label: 'Quote', value: 'quote' }
        ];

        return (

            <Dropdown value={this.state.selectedStatus} options={statuses} onChange={this.onStatusFilterChange}
                showClear={true} placeholder="Select a Status" className="p-column-filter" style={{ maxWidth: 200, minWidth: 50 }} />
        );
    }


    onStatusFilterChange(event) {
        this.dt.filter(event.value, 'status', 'equals');
        this.setState({ selectedStatus: event.value });
    }


    //dropdown for reshall

    teammemberBodyTemplate(rowData) {
        var teammemberDisplay = {
            'Caden Gaviria': 'Caden Gaviria',
            'Philippe Manzone': 'Philippe Manzone',
            'Alec Aragon': 'Alec Aragon',
            'Shannon Groves': 'Shannon Groves',
            'Ali Kilic': 'Ali Kilic'
        }
        return <span className={rowData.teammember}>{teammemberDisplay[rowData.teammember]}</span>
    }

    renderTeamMemberFilter() {
        var teammembers = [
            { label: 'Caden Gaviria', value: 'Caden Gaviria' },
            { label: 'Philippe Manzone', value: 'Philippe Manzone' },
            { label: 'Alec Aragon', value: 'Alec Aragon' },
            { label: 'Shannon Groves', value: 'Shannon Groves' },
            { label: 'Ali Kilic', value: 'Ali Kilic' }
        ];

        return (

            <Dropdown value={this.state.selectedTeamMember} options={teammembers} onChange={this.onTeamMemberFilterChange}
                showClear={true} placeholder="Select a Team Member" className="p-column-filter" style={{ maxWidth: 200, minWidth: 50 }} />
        );
    }


    onTeamMemberFilterChange(event) {
        this.dt.filter(event.value, 'team_member', 'equals');
        this.setState({ selectedTeamMember: event.value });
    }

    loadInitialState = async () => {
        const customerArray = [];
        firebase.database().ref('/bulk_orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().active.toLowerCase() === 'yes' || childSnapshot.val().active.toLowerCase() === 'true') {
                    customerArray.push(childSnapshot.toJSON());
                }

            });
            console.log(customerArray)
            console.log(customerArray[0])
        });
        this.setState({ bulk_orders: customerArray });
        this.setState({ loading: false });
        console.log('bulk orders in ordertracking: ', customerArray);

    }

    componentWillMount() {
        this.loadInitialState()
    }

    render() {
        const statusFilter = this.renderStatusFilter();
        const teammemberFilter = this.renderTeamMemberFilter();
        const allorders = this.state.bulk_orders;
        const currentorder = this.state.selectedOrders;
        const allbulkorders = this.state.bulk_orders;
        const currentorders = this.state.selectedOrders;

        /* --------------- RETURN ---------------- */
        /* ---------------- edit mode ------------*/
        if (this.state.editing) {
            var header = <div style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: 10 }}>
                    <Button type="button" style={{ backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginRight: 10 }} icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.export}>
                    </Button>
                    <Button type="button" style={{ color: 'white', backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginRight: 10 }} icon="pi pi-save" iconPos="left" label="SAVE" onClick={this.save}>
                    </Button>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <p>To edit order status or team member, select the rows you want to edit, and then use the buttons to set fields.</p>
                    <p>Columns highlighted in purple can be individually edited. Click on the cell you'd like to edit to make changes.</p>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <p>Order Status: &emsp;
                        <Button type="button" style={{ color: '#694382', backgroundColor: '#ECCFFF', borderColor: '#23547B', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Invoiced" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'invoiced') }}>
                        </Button>
                        <Button type="button" style={{ color: '#23547B', backgroundColor: '#B3E5FC', borderColor: '#694382', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Quote" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'quote') }}>
                        </Button>
                        <Button type="button" style={{ color: '#c532a0', backgroundColor: '#f5d4f5', borderColor: '#474549', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Confirmed" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'confirmed') }}>
                        </Button>
                        <Button type="button" style={{ color: '#8A5340', backgroundColor: '#FEEDAF', borderColor: '#256029', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="In Production" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'in-production') }}>
                        </Button>
                        <Button type="button" style={{ color: '#474549', backgroundColor: 'lightgrey', borderColor: '#474549', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Shipped" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'shipped') }}>
                        </Button>
                        <Button type="button" style={{ color: '#256029', backgroundColor: '#C8E6C9', borderColor: '#474549', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Fulfilled" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'fulfilled') }}>
                        </Button>
                        <Button type="button" style={{ color: '#C63737', backgroundColor: '#FFCDD2', borderColor: '#C63737', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Cancelled" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'cancelled') }}>
                        </Button>
                    </p>



                </div>
                <div>
                    <p>Assigned Team Member: &emsp;
                        <Button type="button" style={{ color: '#343335', backgroundColor: 'white', borderColor: '#343335', marginRight: 10 }} icon="pi pi-user" iconPos="left" label="Caden Gaviria" onClick={() => { this.teammemberEditor(allorders, currentorder, 'Caden Gaviria') }}>
                        </Button>
                        <Button type="button" style={{ color: '#343335', backgroundColor: 'white', borderColor: '#343335', marginRight: 10 }} icon="pi pi-user" iconPos="left" label="Philippe Manzone" onClick={() => { this.teammemberEditor(allorders, currentorder, 'Philippe Manzone') }}>
                        </Button>
                        <Button type="button" style={{ color: '#343335', backgroundColor: 'white', borderColor: '#343335', marginRight: 10 }} icon="pi pi-user" iconPos="left" label="Alec Aragon" onClick={() => { this.teammemberEditor(allorders, currentorder, 'Alec Aragon') }}>
                        </Button>
                        <Button type="button" style={{ color: '#343335', backgroundColor: 'white', borderColor: '#343335', marginRight: 10 }} icon="pi pi-user" iconPos="left" label="Shannon Groves" onClick={() => { this.teammemberEditor(allorders, currentorder, 'Shannon Groves') }}>
                        </Button>
                        <Button type="button" style={{ color: '#343335', backgroundColor: 'white', borderColor: '#343335', marginRight: 10 }} icon="pi pi-user" iconPos="left" label="Ali Kilic" onClick={() => { this.teammemberEditor(allorders, currentorder, 'Ali Kilic') }}>
                        </Button>
                        <Button type="button" style={{ color: '#343335', backgroundColor: 'white', borderColor: '#343335', marginRight: 10 }} icon="pi pi-user" iconPos="left" label="Kethan Bajaj" onClick={() => { this.teammemberEditor(allorders, currentorder, 'Kethan Bajaj') }}>
                        </Button>
                    </p>

                </div>
                <div>

                </div>
            </div>;
            //loading = {true} loadingIcon = "pi pi-spinner"
            return (
                <div id="elmid">
                    <div className="card">
                        <h1>Ink Tank Bulk Order Tracker</h1>
                        <p>This page will be where sales/finance team members can update the status of an order or the team member assigned to it.</p>
                        <p>ONLY individuals running operations should be accessing this page.</p>
                        <p>NOTE: This page only displays active orders. Orders marked as "fulfilled" or "cancelled" will not appear here. Please find them on the Order Details page. </p>
                        <DataTable value={this.state.bulk_orders} header={header} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} responsive={true} autoLayout={true}
                            editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}
                            footer={this.displaySelection(this.state.selectedOrders)} selection={this.state.selectedOrders} onSelectionChange={e => this.setState({ selectedOrders: e.value })}>
                            <Column selectionMode="multiple" style={{ width: '3em' }} />
                            <Column field="order_id" header="ID" sortable={true} />
                            <Column field="name" header="Name" style={{ maxWidth: 150 }} sortable filter filterPlaceholder="Search by name" />
                            <Column field="organization" header="Organization" style={{ maxWidth: 150 }} sortable={true} exportable={false} />
                            <Column field="team_member" header="Team Member" style={{ maxWidth: 100 }} sortable={true} exportable={false} />
                            <Column field="status" header="Status" style={{ maxWidth: 120 }} sortable={true} filter filterElement={statusFilter} body={this.statusBodyTemplate} exportable={false} />
                            <Column field="design" header="Design" style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 80 }} sortable={true} editor={this.generalEditor} />
                            <Column field="tax_exempt" header="Tax Exempt" style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 80 }} sortable={true} exportable={false} editor={this.generalEditor} />
                            <Column field="blank" header="Blank" style={{ maxWidth: 150 }} sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 120 }} exportable={false} editor={this.generalEditor} />
                            <Column field="quantity" header="Quantity" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 80 }} editor={this.generalEditor} />
                            <Column field="order_quote" header="Order Quote" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 80 }} editor={this.generalEditor} />
                            <Column field="final_total" header="Final Total" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 80 }} editor={this.generalEditor} />
                        </DataTable>
                    </div>
                </div>
            );
            /* ---------------- NOT edit mode ------------*/
        } else {
            var header = <div style={{ textAlign: 'left' }}>
                <Button type="button" style={{ backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginRight: 10 }} icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.export}>
                </Button>
                <Button type="button" style={{ backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginRight: 10 }} icon="pi pi-pencil" iconPos="left" label="EDIT" onClick={this.edit}>
                </Button>
            </div>;
            return (

                <div id="elmid">
                    <div className="card">
                        <h1>Ink Tank Bulk Order Tracker</h1>
                        <p>This page will be where sales/finance team members can update the status of an order or the team member assigned to it.</p>
                        <p>ONLY individuals running operations should be accessing this page.</p>
                        <p>NOTE: This page only displays active orders. Orders marked as "fulfilled" or "cancelled" will not appear here. Please find them on the Order Details page. </p>
                        <DataTable value={this.state.bulk_orders} header={header} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} responsive={true} autoLayout={true} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}>
                            <Column field="order_id" header="ID" sortable={true} />
                            <Column field="name" header="Name" style={{ maxWidth: 150 }} sortable filter filterPlaceholder="Search by name" />
                            <Column field="organization" header="Organization" style={{ maxWidth: 150 }} sortable={true} exportable={false} />
                            <Column field="team_member" header="Team Member" style={{ maxWidth: 100 }} sortable={true} exportable={false} />
                            <Column field="status" header=" Status " style={{ maxWidth: 120 }} sortable={true} filter filterElement={statusFilter} body={this.statusBodyTemplate} exportable={false} />
                            <Column field="design" header="Design" style={{ maxWidth: 80 }} sortable={true} />
                            <Column field="tax_exempt" header="Tax Exempt" style={{ maxWidth: 80 }} sortable={true} exportable={false} />
                            <Column field="blank" header="Blank" style={{ maxWidth: 120 }} sortable={true} exportable={false} />
                            <Column field="quantity" header="Quantity" style={{ maxWidth: 80 }} sortable={true} />
                            <Column field="order_quote" header="Order Quote" style={{ maxWidth: 80 }} sortable={true} />
                            <Column field="final_total" header="Final Total" style={{ maxWidth: 80 }} sortable={true} />

                        </DataTable>
                    </div>
                </div>
            );

        }

    }
}
