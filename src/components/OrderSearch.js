import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { Chart } from 'primereact/chart'
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import {ToggleButton} from 'primereact/togglebutton';
import {RadioButton} from 'primereact/radiobutton';
import firebase from 'firebase/app';
import 'firebase/database';
import validator from 'validator'


import customerData from '../customers.json';
// import classNames from 'classnames';

import '../Dashboard.css';
//import { arrayToHash } from '@fullcalendar/core/util/object';


export class OrderSearch extends Component {

    constructor() {
        super();
        this.state = {
            customers: [],
            bulk_orders: [],
            selectedCustomer: null,
            selectedOrder: null,
            editing: false,
            newplanYear: null,
            newplanQuarter: null,
            newmax: null,
            newreshall: null,
            newphone: null,
            newemail: null,
            newactive: null,
            planSelectYear: [
                {label: '2020-2021', value: '2020-2021'},
                {label: '2021-2022', value: '2021-2022'},
                {label: '2022-2023', value: '2022-2023'},
                {label: '2023-2024', value: '2023-2024'}
            ],
            planSelectQuarter: [
                {label: 'Full Year', value: '-F-W-S'},
                {label: 'Winter/Spring Quarter', value: '-W-S'},
                {label: 'Fall Quarter', value: '-F'},
                {label: 'Winter Quarter', value: '-W'},
                {label: 'Spring Quarter', value: '-S'},
            ],
            planSelectWeight: [
                {label: '15 lb/week', value: '15'},
                {label: '20 lb/week', value: '20'},
                {label: '25 lb/week', value: '25'},
            ],
            planSelectReshall:[
                {label: 'Choose later', value: 'Choose later'},
                {label: '560 Lincoln', value: '560 Lincoln'},
                {label: '720 Emerson', value: '720 Emerson'},
                {label: '1715 Chicago', value: '1715 Chicago'},
                {label: '1838 Chicago', value: '1838 Chicago'},
                {label: '1856 Orrington', value: '1856 Orrington'},
                {label: '2303 Sheridan', value: '2303 Sheridan'},
                {label: 'Ayers', value: 'Ayers'},
                {label: 'Allison', value: 'Allison'},
                {label: 'Bobb', value: 'Bobb'},
                {label: 'Chapin', value: 'Chapin'},
                {label: 'East Fairchild', value: 'East Fairchild'},
                {label: 'Elder', value: 'Elder'},
                {label: 'West Fairchild', value: 'West Fairchild'},
                {label: 'Foster-Walker (PLEX)', value: 'Foster-Walker (PLEX)'},
                {label: 'Goodrich', value: 'Goodrich'},
                {label: 'Hobart', value: 'Hobart'},
                {label: 'Jones', value: 'Jones'},
                {label: 'Kemper', value: 'Kemper'},
                {label: 'McCulloch', value: 'McCulloch'},
                {label: 'PARC (North Mid Quads)', value: 'PARC (North Mid Quads)'},
                {label: 'Rogers House', value: 'Rogers House'},
                {label: 'Sargent', value: 'Sargent'},
                {label: 'Shepard Residential College (South Mid Quads)', value: 'Shepard Residential College (South Mid Quads)'},
                {label: 'Shepard Hall', value: 'Shepard Hall'},
                {label: 'Slivka', value: 'Slivka'},
                {label: 'Willard', value: 'Willard'},
                {label: 'Delta Gamma', value: 'Delta Gamma'},
                {label: 'Kappa Kappa Gamma', value: 'Kappa Kappa Gamma'},
                { label: 'Zeta Beta Tau (ZBT)', value: 'Zeta Beta Tau (ZBT)'}
            ]

        };
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.onPlanYearValueChange = this.onPlanYearValueChange.bind(this)
        this.onPlanQuarterValueChange = this.onPlanQuarterValueChange.bind(this)
        this.getCustomerHistory = this.getCustomerHistory.bind(this)
        this.displayPlanQuarters = this.displayPlanQuarters.bind(this)
        this.resetNewInfo = this.resetNewInfo.bind(this)
    }

    edit() {
        this.setState({ editing: true });
        this.resetNewInfo();
    }

    save(customer) {
        this.setState({ editing: false });
        //console.log(this.state.newplan)
        let allcustomers = [...this.state.customers];
        let newcustomer = {...this.state.selectedCustomer};
        if (this.state.newplanYear && this.state.newplanQuarter) {
             newcustomer.plan = this.state.newplanYear+this.state.newplanQuarter;
             //console.log('newplanQuarter: ', this.state.newplanQuarter);
             //console.log('newplanYear', this.state.newplanYear)
             firebase.database().ref('/customers/' + customer.id + '/plan').set(newcustomer.plan);
        }
        else if (this.state.newplanYear) {
            newcustomer.plan = this.state.newplanYear+customer.plan.substring(9);
            //console.log('newcustomer.plan: ', newcustomer.plan);
            //console.log('newplanYear', this.state.newplanYear)
            //console.log('customer quarter: ', customer.plan.substring(9));
            firebase.database().ref('/customers/' + customer.id + '/plan').set(newcustomer.plan);
       }
       else if (this.state.newplanQuarter) {
            newcustomer.plan = customer.plan.substring(0,9)+this.state.newplanQuarter;
            //console.log('newcustomer.plan: ', newcustomer.plan);
            //console.log('customer year', customer.plan.substring(0,9))
            //console.log('newplanQuarter: ', this.state.newplanQuarter);
            firebase.database().ref('/customers/' + customer.id + '/plan').set(newcustomer.plan);
   }
        if (this.state.newmax) {
            newcustomer.maxweight = this.state.newmax;
            firebase.database().ref('/customers/' + customer.id + '/maxweight').set(newcustomer.maxweight);
       }
        if (this.state.newreshall) {
            newcustomer.reshall = this.state.newreshall;
            firebase.database().ref('/customers/' + customer.id + '/reshall').set(newcustomer.reshall);
        }
        if (this.state.newphone) {
            newcustomer.phone = this.state.newphone;
            firebase.database().ref('/customers/' + customer.id + '/phone').set(newcustomer.phone);
        }
        if (this.state.newemail) {
            newcustomer.email = this.state.newemail;
            firebase.database().ref('/customers/' + customer.id + '/email').set(newcustomer.email)
        }
        if (this.state.newactive) {
            newcustomer.activestatus = this.state.newactive;
            firebase.database().ref('/customers/' + customer.id + '/activestatus').set(newcustomer.activestatus)
        }
        let count = 0;
        let individual=null;
        allcustomers.map(each => {
            if (newcustomer.id === each.id) {
                individual = {...allcustomers[count]};
                individual= newcustomer;
                allcustomers[count] = individual;
            }
            count = count+1
        })
        this.setState({ customers: allcustomers });
        this.setState({selectedCustomer: newcustomer});

    }

    //CUSTOMER INFORMATION EDITING
    onPlanYearValueChange(value) {
        //console.log('newPlanYear: ', value)
        this.setState({ newplanYear: value });
    }
    onPlanQuarterValueChange(value) {
        //console.log('newPlanQuarter: ', value)
        this.setState({ newplanQuarter: value });
    }
    onMaxweightValueChange(value) {
        this.setState({ newmax: value });
    }
    onReshallValueChange(value) {
        this.setState({ newreshall: value });
    }
    onPhoneValueChange(value) {
        if(value[3] ==='-' && value[7] ==='-' && value.length===12) {
            this.setState({ newphone: value });
        }
    }
    onEmailValueChange(value) {
        if (value.includes('@') && value.includes('.')) {
            this.setState({ newemail: value });
        }
    }
    onActiveValueChange(value) {
        this.setState({ newactive:value})


    }

    getCustomerHistory(customer) {
        var history = []
        firebase.database().ref('/orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var cid = childSnapshot.key;
                var res = cid.split('-');
                //console.log(res[1])
                if (res[1] === customer.id) {
                    history.push(childSnapshot.toJSON())
                }
            });
        });
        //console.log(history)
        return history;
    }

    displayPlanQuarters(customerPlan) {
        if (customerPlan) {

            if (customerPlan === 'F') {
                const result = 'Fall Quarter';
                return result;
            }
            else if (customerPlan === 'W') {
                const result = 'Winter Quarter' ;
                return result;
            }
            else if (customerPlan === 'S') {
                const result = 'Spring Quarter' ;
                return result;
            }
            else if (customerPlan === 'F-W-S') {
                const result = 'Full Year' ;
                return result;
            }
        }
    }

    resetNewInfo() {
        this.setState({ newplanYear: null });
        this.setState({ newplanQuarter: null });
        this.setState({ newmax: null });
        this.setState({ newreshall: null });
        this.setState({ newphone: null });
        this.setState({ newemail: null });
        this.setState({ newactive: null })
    }

    /* --------------- Filters ---------------- */
    componentDidMount() {
        const customerArray = [];
        firebase.database().ref('/bulk_orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                customerArray.push(childSnapshot.toJSON());
            });
        });
        this.setState({ bulk_orders: customerArray });
    }

    render() {
        if (this.state.selectedCustomer) {
            var header = <div style={{ textAlign: 'left' }}></div>
            var customer = this.state.selectedCustomer
            var history = this.getCustomerHistory(customer)
            var laundryStatusDisplay = {
                'picked-up': 'picked up',
                'delivered-to-SH': 'delivered to SH',
                'delivered-to-dorm': 'delivered to dorm',
                'out-of-service': 'out of service',
                'bag-missing': 'bag missing'
            }

            return (
                <div style={{display: 'flex'}}>
                    <div className="card card-search">
                        <DataTable value={this.state.bulk_orders} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} selectionMode="single"
                            responsive={true} autoLayout={true} selection={this.state.selectedCustomer} onSelectionChange={e => this.setState({ selectedCustomer: e.value })}>
                            <Column field="order_id" header="ID" sortable={true} filter filterPlaceholder="Search id"/>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search name" />
                            <Column field="organization" header="Organization" sortable filter filterPlaceholder="Search name" />
                        </DataTable>
                    </div>
                    <div className="card card-list">  <p className={customer.active} style={{ marginRight: 15 }}>Active: {customer.active}</p>
                        <h1>{customer.name}</h1>
                        <div style={{ display: 'flex' }}>
                            <div style={{ minWidth: '50%'  }}>
                                <h3 style={{ marginBlockStart: 0, marginBlockEnd: '0.25em' }}>Account Information</h3>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Order ID: {customer.order_id}</p>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Organization: {customer.organization}</p>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Blank: {customer.blank}</p>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Shipping Address: {customer.ship_address}</p>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Design: {customer.design}</p>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Tax Exempt: {customer.tax_exempt}</p>
                            
                            </div>
                            <div style={{ minWidth: '50%' }}>
                                <h3 style={{ marginBlockStart: 0, marginBlockEnd: '0.25em' }}>Contact Information</h3>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Email: {customer.email}</p>
                                <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Phone: {customer.phone}</p>
                            </div>
                        </div>
                        <Button type="button" style={{ color: 'white', backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginTop: 30 }} icon="pi pi-pencil" iconPos="left" label="EDIT" onClick={this.edit}>
                        </Button>
                        {/* <h3 style={{ marginBlockStart: '1em', marginBlockEnd: 0 }}>Bag Weight History</h3> */}
                        {/* <Chart type="line" data={data} /> */}
                        {/* <Editor style={{ height: '320px' }} value={this.state.text} onTextChange={(e) => this.setState({ text: e.htmlValue })} /> */}
                    </div>
                </div>
            );

        } else {
            var header = <div style={{ textAlign: 'left' }}>
            </div>;

            return (
                <div style={{ display: 'flex' }}>
                    <div className="card card-search">
                        <DataTable value={this.state.bulk_orders} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} selectionMode="single"
                        responsive={true} autoLayout={true} selection={this.state.selectedCustomer} onSelectionChange={e => this.setState({ selectedCustomer: e.value })}>
                            <Column field="order_id" header="ID" sortable={true} filter filterPlaceholder="Search id"/>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search name" />
                            <Column field="organization" header="Organization" sortable filter filterPlaceholder="Search name" />
                        </DataTable>
                    </div>
                    <div className="card card-list">
                        <h1>Select an Order</h1>
                    </div>
                </div>
            );
        }


    }
}
