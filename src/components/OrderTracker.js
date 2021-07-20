import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext';

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
            customers: [],
            bulk_orders: [],
            selectedStatus: null,
            selectedTeamMember: null,
            editing: false,
            loading: true,
            selectedCustomers: null,
            selectedOrders: null
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


    updateWeightStatus(props,value, currDate) {

        console.log(this.state.customers[props.rowIndex])
        // console.log(props.rowIndex)

        //if (value > props.rowData.maxweight) {
        
        //if (value > firebase.database().ref('/customers/'+props.rowData.id+'/maxweight')) {
        console.log('value: ',value);
        console.log('maxweight comparison: ',parseInt(this.state.customers[props.rowIndex].maxweight));
        if (parseFloat(value) > parseFloat(this.state.customers[props.rowIndex].maxweight)) {
            let over = parseFloat(value) - parseFloat(this.state.customers[props.rowIndex].maxweight)
            console.log('marking as overweight.');
            firebase.database().ref('/customers/' + props.rowData.id + '/'+'weightstatus').set('overweight')
            /*let temp = firebase.database().ref('/customers/' + props.rowData.id + '/' + 'quarter-overages')
            temp.once('value', (snapshot) => {
                let total = snapshot.val()+over
                firebase.database().ref('/customers/' + props.rowData.id + '/' + 'quarter-overages').set(total)
            })*/
            let updatedCustomers = this.state.customers;
            updatedCustomers[props.rowIndex][props.field] = value;
            updatedCustomers[props.rowIndex]['weightstatus'] = 'overweight';
            //updatedCustomers[props.rowIndex]['quarter-overages'] += parseFloat(value);
            // this.setState({ customers: updatedCustomers });
            return value
        }
        else {
            console.log('marking as underweight');
            firebase.database().ref('/customers/' + props.rowData.id + '/'+'weightstatus').set('underweight')
            let updatedCustomers = this.state.customers;
            updatedCustomers[props.rowIndex][props.field] = value;
            updatedCustomers[props.rowIndex]['weightstatus'] = 'underweight';
            // this.setState({ customers: updatedCustomers });
            return value
        }
    }

    async onEditorValueChange(props, value) {

        firebase.database().ref('/bulk_orders/' + props.rowData.id + '/' + props.field).set(value)
        const db = firebase.database().ref();
        var currWeight = value;
        var currDay = new Date().getDate();
        var currMonth = new Date().getMonth() +1;
        if (currMonth < 10) {
            currMonth = '0'+currMonth
        }
        if (currDay < 10) {
            currDay = '0' + currDay
        }
        var currYear = new Date().getFullYear();
        var currDate = currYear + '-' + currMonth + '-'+currDay;
        var fullDate = new Date().toDateString();
        var currTime = new Date().toLocaleTimeString('it-IT');
        db.child('/history/' + currDate + props.rowData.id).once("value")
            .then(snapshot => {
                if (!snapshot.val()) {
                    db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id).set(0)
                    db.child('/history/' + currDate +' '+currTime+' - '+props.rowData.id + '/blank').set(props.rowData.blank);
                    db.child('/history/' + currDate+' '+currTime+' - ' + props.rowData.id + '/design').set(props.rowData.design);
                    db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/id').set(props.rowData.order_id);
                    db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/team_member').set(props.rowData.team_member);
                    db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/status').set(props.rowData.status);
                }
                db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/date').set(currDate+' '+ currTime);
                db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/blank').set(props.rowData.blank);
                db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/id').set(props.rowData.order_id);
                db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/team_member').set(props.rowData.team_member);
                db.child('/history/' + currDate +' '+currTime+' - '+ props.rowData.id + '/status').set(props.rowData.status);

            })
        firebase.database().ref('/history/' + props.rowData.id + '/last_quote_updated').set(currDate + ' ' + currTime)
        
    }

    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]} style={{ maxWidth: 100 }} onChange={(e) => { this.onEditorValueChange(props, e.target.value);}}/>
    }

    generalEditor(props) {
        return this.inputTextEditor(props, ' ');
    }

    bagStatusEditor(allorders, currentorder, newstatus) {
        let updatedOrders = [...allorders];
        const db = firebase.database().ref()
        var currDay = new Date().getDate();
        var currMonth = new Date().getMonth() +1;
        if (currMonth < 10) {
            currMonth = '0'+currMonth
        }
        if (currDay < 10) {
            currDay = '0' + currDay
        }
        var currYear = new Date().getFullYear();
        var currDate = currYear + '-' + currMonth + '-'+currDay;
        //var currDate = new Date().toDateString();
        var currTime = new Date().toLocaleTimeString('it-IT');

        if (currentorder) {
            var ids = Object.keys(currentorder).map(function (key) {
                return currentorder[key].id;
            });
            updatedOrders.map(each => {
                if (ids.includes(each.id)) {
                    each.status = newstatus;
                    if (newstatus === 'cancelled') {
                        each.final_total = 'N/A'
                        db.child('/bulk_orders/'+each.id+'/active').set('False');
                    }
                    firebase.database().ref('/bulk_order/' + each.id + '/last_status_updated').set(currDate + ' ' + currTime)

                    db.child('/history/' + currDate + each.id).once("value")
                        .then(snapshot => {
                            if (!snapshot.val()) {
                                db.child('/history/' + currDate +' '+currTime+' - '+ each.id).set(0)
                                db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/blank').set(each.blank);
                                db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/design').set(each.design);
                                db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/id').set(each.order_id);
                                db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/team_member').set(each.team_member);
                                db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/status').set(each.status);
                            }
                            db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/date').set(currDate+' '+ currTime);
                            db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/design').set(each.design);
                            db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/id').set(each.order_id);
                            db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/team_member').set(each.team_member);
                            db.child('/history/' + currDate +' '+currTime+' - '+ each.id + '/status').set(each.status);

                        })

                }
            })
            this.setState({ customers: updatedOrders });
        }
        console.log('bagStatusEditor currentorder: ',currentorder);
        this.dothisfirst(currentorder, newstatus)

    }


    dothisfirst(currentorder, newstatus) {
        console.log('currentorder: ',currentorder);
        console.log('newstatus: ',newstatus);
        if (currentorder) {
            var ids = Object.keys(currentorder).map(function (key) {
                return currentorder[key].id;
            });
            console.log('ids: ',ids);
            var query = firebase.database().ref("bulk_orders").orderByKey();
            query.once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var key = childSnapshot.key;
                        if (ids.includes(key)) {
                            var key = childSnapshot.key;
                            firebase.database().ref('/bulk_orders/' + key + '/' + "orderstatus").set(newstatus);
                            console.log('currentorder in forEach: ',currentorder);

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
        var statusDisplay = {
            'Confirmed': 'confirmed',
            'In Production': 'in production',
            'Invoiced': 'invoiced',
            'Fulfilled': 'fulfilled',
            'Shipped': 'Shipped',
            'Quote': 'quote'
        }
        return <span className={rowData.status}>{statusDisplay[rowData.status]}</span>
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
             showClear={true} placeholder="Select a Status" className="p-column-filter" style={{maxWidth: 200, minWidth: 50}} />
        );
    }

    // weightBodyTemplate(rowData) {
    //     return <span className={rowData.weightstatus}>{rowData.weightstatus}</span>;
    // }


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
            { label: 'Philippe Manzone', value: 'Philippe Manzone'},
            { label: 'Alec Aragon', value: 'Alec Aragon'},
            { label: 'Shannon Groves', value: 'Shannon Groves'},
            { label: 'Ali Kilic', value: 'Ali Kilic'}
    ];

        return (

            <Dropdown value={this.state.selectedTeamMember} options={teammembers} onChange={this.onTeamMemberFilterChange}
             showClear={true} placeholder="Select a Team Member" className="p-column-filter" style={{maxWidth: 200, minWidth: 50}} />
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
                if (childSnapshot.val().active === 'True' ) {
                    customerArray.push(childSnapshot.toJSON());
                }

            });
            console.log(customerArray)
            console.log(customerArray[0])
        });
        this.setState({ customers: customerArray });
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
                <div>
                    <Button type="button" style={{ color: '#23547B', backgroundColor: '#B3E5FC', borderColor: '#23547B', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Confirmed" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'confirmed')}}>
                    </Button>
                    <Button type="button" style={{ color: '#694382', backgroundColor: '#ECCFFF', borderColor: '#694382', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="In Production" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'in production') }}>
                    </Button>
                    <Button type="button" style={{ color: '#256029', backgroundColor: '#C8E6C9', borderColor: '#256029', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Invoiced" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'invoiced') }}>
                    </Button>
                    <Button type="button" style={{ color: '#474549', backgroundColor: 'lightgrey', borderColor: '#474549', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Fulfilled" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'fulfilled') }}>
                    </Button>
                    <Button type="button" style={{ color: '#C63737', backgroundColor: '#FFCDD2', borderColor: '#C63737', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Shipped" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'Shipped') }}>
                    </Button>
                    <Button type="button" style={{ color: '#474549', backgroundColor: 'lightgrey', borderColor: '#474549', marginRight: 10 }} icon="pi pi-check" iconPos="left" label="Quote" onClick={() => { this.bagStatusEditor(allorders, currentorder, 'quote') }}>
                    </Button>

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
                        <DataTable value={this.state.bulk_orders} header={header} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} responsive={true} autoLayout={true}
                        editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}
                        footer={this.displaySelection(this.state.selectedOrders)} selection={this.state.selectedOrders} onSelectionChange={e => this.setState({ selectedOrders: e.value })}>
                            <Column selectionMode="multiple" style={{ width: '3em' }} />
                            <Column field="order_id" header="ID" sortable={true} />
                            <Column field="name" header="Name" style={{ maxWidth: 150 }} sortable filter filterPlaceholder="Search by name" />
                            <Column field="organization" header="Organization" style={{ maxWidth: 150 }} sortable={true} filter filterElement={statusFilter}  exportable={false}/>
                            <Column field="blank" header="Blank" style={{ maxWidth: 150 }}  sortable={true}  exportable={false}/>
                            <Column field="design" header="Design" style={{ maxWidth: 100 }} sortable={true}  />
                            <Column field="tax_exempt" header="Tax Exempt" style={{ maxWidth: 100 }} sortable={true}  exportable={false}/>
                            <Column field="team_member" header="Team Member" style={{ maxWidth: 100 }} sortable={true}  exportable={false}/>
                            <Column field="status" header="Status" style={{ maxWidth: 100 }} sortable={true} body={this.statusBodyTemplate} exportable={false}/>
                            <Column field="order_quote" header="Order Quote" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 100 }}/>
                            <Column field="final_total" header="Final Total" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 100 }}/>

                            {/* <Column field="organization" header="Organization" style={{ maxWidth: 150 }} sortable={true} filter filterElement={statusFilter}  exportable={false}/>
                            <Column field="reshall" header="Residential Hall" style={{ maxWidth: 200 }} sortable={true} filter filterElement={reshallFilter} /> 
                            <Column field="laundrystatus" header="Bag Status" style={{ maxWidth: 150 }} sortable={true} filter filterElement={statusFilter} />
                            <Column field="weightstatus" header="Weight Status" style={{ maxWidth: 150 }} sortable={true} />

                            <Column field="weekweight" header="Bag Weight" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 100 }} editor={this.generalEditor}/> */}
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
                        <DataTable value={this.state.bulk_orders} header={header} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} responsive={true} autoLayout={true} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}>
                            <Column field="order_id" header="ID" sortable={true} />
                            <Column field="name" header="Name" style={{ maxWidth: 150 }} sortable filter filterPlaceholder="Search by name" />
                            <Column field="organization" header="Organization" style={{ maxWidth: 150 }} sortable={true} filter filterElement={statusFilter}  exportable={false}/>
                            <Column field="blank" header="Blank" style={{ maxWidth: 150 }}  sortable={true}  exportable={false}/>
                            <Column field="design" header="Design" style={{ maxWidth: 100 }} sortable={true}  />
                            <Column field="tax_exempt" header="Tax Exempt" style={{ maxWidth: 100 }} sortable={true}  exportable={false}/>
                            <Column field="team_member" header="Team Member" style={{ maxWidth: 100 }} sortable={true}  exportable={false}/>
                            <Column field="status" header="Status" style={{ maxWidth: 100 }} sortable={true} body={this.statusBodyTemplate} exportable={false}/>
                            <Column field="order_quote" header="Order Quote" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 100 }}/>
                            <Column field="final_total" header="Final Total" sortable={true} style={{ backgroundColor: '#6a09a4', color: 'white', maxWidth: 100 }}/>
                            {/* <Column field="reshall" header="Residential Hall" style={{ maxWidth: 200 }} sortable={true} filter filterElement={reshallFilter} />
                            <Column field="laundrystatus" header="Bag Status" style={{ maxWidth: 150 }} sortable={true} filter filterElement={statusFilter}  />
                            <Column field="weightstatus" header="Weight Status" style={{ maxWidth: 150 }} sortable={true} />
                            <Column field="weekweight" header="Bag Weight" style={{ maxWidth: 100 }} sortable={true} /> */}

                        </DataTable>
                    </div>
                </div>
            );

        }

    }
}
