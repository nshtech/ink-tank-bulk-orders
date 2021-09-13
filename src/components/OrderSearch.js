import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { Chart } from 'primereact/chart'
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { ToggleButton } from 'primereact/togglebutton';
import { RadioButton } from 'primereact/radiobutton';
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
            newShipAddress: null,
            newphone: null,
            newemail: null,
            planSelectYear: [
                { label: '2020-2021', value: '2020-2021' },
                { label: '2021-2022', value: '2021-2022' },
                { label: '2022-2023', value: '2022-2023' },
                { label: '2023-2024', value: '2023-2024' }
            ],
            planSelectQuarter: [
                { label: 'Full Year', value: '-F-W-S' },
                { label: 'Winter/Spring Quarter', value: '-W-S' },
                { label: 'Fall Quarter', value: '-F' },
                { label: 'Winter Quarter', value: '-W' },
                { label: 'Spring Quarter', value: '-S' },
            ],
            planSelectWeight: [
                { label: '15 lb/week', value: '15' },
                { label: '20 lb/week', value: '20' },
                { label: '25 lb/week', value: '25' },
            ],
            planSelectReshall: [
                { label: 'Choose later', value: 'Choose later' },
                { label: '560 Lincoln', value: '560 Lincoln' },
                { label: '720 Emerson', value: '720 Emerson' },
                { label: '1715 Chicago', value: '1715 Chicago' },
                { label: '1838 Chicago', value: '1838 Chicago' },
                { label: '1856 Orrington', value: '1856 Orrington' },
                { label: '2303 Sheridan', value: '2303 Sheridan' },
                { label: 'Ayers', value: 'Ayers' },
                { label: 'Allison', value: 'Allison' },
                { label: 'Bobb', value: 'Bobb' },
                { label: 'Chapin', value: 'Chapin' },
                { label: 'East Fairchild', value: 'East Fairchild' },
                { label: 'Elder', value: 'Elder' },
                { label: 'West Fairchild', value: 'West Fairchild' },
                { label: 'Foster-Walker (PLEX)', value: 'Foster-Walker (PLEX)' },
                { label: 'Goodrich', value: 'Goodrich' },
                { label: 'Hobart', value: 'Hobart' },
                { label: 'Jones', value: 'Jones' },
                { label: 'Kemper', value: 'Kemper' },
                { label: 'McCulloch', value: 'McCulloch' },
                { label: 'PARC (North Mid Quads)', value: 'PARC (North Mid Quads)' },
                { label: 'Rogers House', value: 'Rogers House' },
                { label: 'Sargent', value: 'Sargent' },
                { label: 'Shepard Residential College (South Mid Quads)', value: 'Shepard Residential College (South Mid Quads)' },
                { label: 'Shepard Hall', value: 'Shepard Hall' },
                { label: 'Slivka', value: 'Slivka' },
                { label: 'Willard', value: 'Willard' },
                { label: 'Delta Gamma', value: 'Delta Gamma' },
                { label: 'Kappa Kappa Gamma', value: 'Kappa Kappa Gamma' },
                { label: 'Zeta Beta Tau (ZBT)', value: 'Zeta Beta Tau (ZBT)' }
            ]

        };
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        // this.onPlanYearValueChange = this.onPlanYearValueChange.bind(this)
        // this.onPlanQuarterValueChange = this.onPlanQuarterValueChange.bind(this)
        this.getBulkOrderHistory = this.getBulkOrderHistory.bind(this)
        //this.displayPlanQuarters = this.displayPlanQuarters.bind(this)
        this.resetNewInfo = this.resetNewInfo.bind(this)
    }

    edit() {
        this.setState({ editing: true });
        this.resetNewInfo();
    }

    save(bulk_order) {
        this.setState({ editing: false });
        //console.log(this.state.newplan)
        let allbulk_orders = [...this.state.bulk_orders];
        let newbulk_order = this.state.selectedOrder;
        console.log('newbulk_order',newbulk_order)
        console.log('bulk_order: ',bulk_order);
        console.log('bulk_order.id: ',bulk_order.order_id)
        if (this.state.newShipAddress) {
            newbulk_order.ship_address = this.state.newShipAddress;
            firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/ship_address').set(newbulk_order.ship_address);
        }
        if (this.state.newphone) {
            newbulk_order.phone = this.state.newphone;
            firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/phone').set(newbulk_order.phone);
        }
        if (this.state.newemail) {
            newbulk_order.email = this.state.newemail;
            firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/email').set(newbulk_order.email)
        }
  
        let count = 0;
        let individual=null;
        console.log('updated newbulk_order',newbulk_order)
        for (var i=0; i < allbulk_orders.length; i++) {
            if (allbulk_orders[i].order_id === newbulk_order.order_id) {
                allbulk_orders[i] = newbulk_order;
            }
        }
        
        console.log('updated allbulkorders',allbulk_orders);

        this.setState({ bulk_orders: allbulk_orders });
        this.setState({selectedOrder: newbulk_order});

    }

    //CUSTOMER INFORMATION EDITING
    onShipAddressValueChange(value) {
        //console.log('newPlanYear: ', value)
        this.setState({ newShipAddress: value });
    }

    onPhoneValueChange(value) {
        if (value[3] === '-' && value[7] === '-' && value.length === 12) {
            this.setState({ newphone: value });
        }
    }
    onEmailValueChange(value) {
        if (value.includes('@') && value.includes('.')) {
            this.setState({ newemail: value });
        }
    }

    getBulkOrderHistory(bulk_order) {
        var history = []
        firebase.database().ref('/orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var cid = childSnapshot.key;
                var res = cid.split('-');
                //console.log(res[1])
                if (res[1] === bulk_order.id) {
                    history.push(childSnapshot.toJSON())
                }
            });
        });
        //console.log(history)
        return history;
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
        if (this.state.selectedOrder) {
            var header = <div style={{ textAlign: 'left' }}></div>
            var bulk_order = this.state.selectedOrder
            if (this.state.editing) {
                return (
                    <div style={{ display: 'flex' }}>
                        <div className="card card-search">
                            <DataTable value={this.state.bulk_orders} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} selectionMode="single"
                                responsive={true} autoLayout={true} selection={this.state.selectedOrder} onSelectionChange={e => this.setState({ selectedOrder: e.value })}>
                                <Column field="order_id" header="ID" sortable={true} filter filterPlaceholder="Search id" />
                                <Column field="name" header="Name" sortable filter filterPlaceholder="Search name" />
                                <Column field="organization" header="Organization" sortable filter filterPlaceholder="Search organization" />
                            </DataTable>
                        </div>
                        <div className="card card-list">  <p className={bulk_order.active} style={{ marginRight: 15 }}>Active: {bulk_order.active}</p>
                            <h1>{bulk_order.name}</h1>
                            <div style={{ display: 'flex' }}>
                                <div style={{ minWidth: '50%' }}>
                                    <h3 style={{ marginBlockStart: 0, marginBlockEnd: '0.25em' }}>Account Information</h3>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Order ID: {bulk_order.order_id}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Organization: {bulk_order.organization}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Blank: {bulk_order.blank}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Design: {bulk_order.design}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Tax Exempt: {bulk_order.tax_exempt}</p>

                                </div>
                                <div style={{ minWidth: '50%' }}>
                                    <h3 style={{ marginBlockStart: 0, marginBlockEnd: '0.25em' }}>Contact Information</h3>
                                    <div className="p-field p-grid">
                                    <label htmlFor="lastname3" className="p-col-fixed" style={{ width: '120px' }}>Email:</label>
                                    <div className="p-col">
                                        <InputText type="text" placeholder={bulk_order.email} onChange={(e) => { this.onEmailValueChange(e.target.value); }}/>
                                    </div>
                                </div>
                                <div className="p-field p-grid">
                                    <label htmlFor="lastname3" className="p-col-fixed" style={{ width: '120px' }}>Phone:</label>
                                    <div className="p-col">
                                        <InputText type="text" placeholder={bulk_order.phone} onChange={(e) => { this.onPhoneValueChange(e.target.value); }}/>
                                    </div>
                                </div>
                                <div className="p-field p-grid">
                                    <label htmlFor="lastname3" className="p-col-fixed" style={{ width: '120px' }}>Phone:</label>
                                    <div className="p-col">
                                        <InputText type="text" placeholder={bulk_order.ship_address} onChange={(e) => { this.onShipAddressValueChange(e.target.value); }}/>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <Button type="button" style={{ color: 'white', backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginTop: 30 }} icon="pi pi-save" iconPos="left" label="SAVE" onClick={() => {this.save(bulk_order)}}>
                            </Button>
                       </div>
                    </div>
                );
            }
            else {
                return (
                    <div style={{ display: 'flex' }}>
                        <div className="card card-search">
                            <DataTable value={this.state.bulk_orders} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} selectionMode="single"
                                responsive={true} autoLayout={true} selection={this.state.selectedOrder} onSelectionChange={e => this.setState({ selectedOrder: e.value })}>
                                <Column field="order_id" header="ID" sortable={true} filter filterPlaceholder="Search id" />
                                <Column field="name" header="Name" sortable filter filterPlaceholder="Search name" />
                                <Column field="organization" header="Organization" sortable filter filterPlaceholder="Search name" />
                            </DataTable>
                        </div>
                        <div className="card card-list">  <p className={bulk_order.active} style={{ marginRight: 15 }}>Active: {bulk_order.active}</p>
                            <h1>{bulk_order.name}</h1>
                            <div style={{ display: 'flex' }}>
                                <div style={{ minWidth: '50%' }}>
                                    <h3 style={{ marginBlockStart: 0, marginBlockEnd: '0.25em' }}>Order Information</h3>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Order ID: {bulk_order.order_id}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Organization: {bulk_order.organization}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Blank: {bulk_order.blank}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Design: {bulk_order.design}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Tax Exempt: {bulk_order.tax_exempt}</p>

                                </div>
                                <div style={{ minWidth: '50%' }}>
                                    <h3 style={{ marginBlockStart: 0, marginBlockEnd: '0.25em' }}>Contact Information</h3>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Email: {bulk_order.email}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Phone: {bulk_order.phone}</p>
                                    <p style={{ marginBlockStart: 0, marginBlockEnd: '0.25em', paddingRight: 15 }}>Shipping Address: {bulk_order.ship_address}</p>

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
            }

        } else {
            var header = <div style={{ textAlign: 'left' }}>
            </div>;

            return (
                <div style={{ display: 'flex' }}>
                    <div className="card card-search">
                        <DataTable value={this.state.bulk_orders} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} selectionMode="single"
                            responsive={true} autoLayout={true} selection={this.state.selectedOrder} onSelectionChange={e => this.setState({ selectedOrder: e.value })}>
                            <Column field="order_id" header="ID" sortable={true} filter filterPlaceholder="Search id" />
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
