import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';

import firebase from 'firebase/app';
import 'firebase/database';

import validator from 'validator'


import customerData from '../customers.json';
// import classNames from 'classnames';

import '../Dashboard.css';
//import { arrayToHash } from '@fullcalendar/core/util/object';


export class CustomerSheet extends Component {

    constructor() {
        super();
        this.state = {
            customers: [],
            selectedStatus: null,
            editing: false,
            bulk_orders: []
        };
        // this.edit = this.edit.bind(this);
        this.export = this.export.bind(this);
        this.onStatusFilterChange = this.onStatusFilterChange.bind(this);

    }
    export() {
        this.dt.exportCSV();
    }

/* --------------- Editing ---------------- */
    // edit() {
    //     this.setState({editing: true});
    //     this.growl.show({ severity: 'info', summary: 'Editing Enabled', detail: 'Save changes before continuing' });
    // }

   

/* --------------- Filters ---------------- */
    statusBodyTemplate(rowData) {
        var laundryStatusDisplay = {
            'picked-up': 'picked up',
            'delivered-to-SH': 'delivered to SH',
            'delivered-to-dorm': 'delivered to dorm',
            'out-of-service': 'out of service',
            'bag-missing': 'bag missing',
            'start-of-quarter': 'start of quarter'
        }
        return <span className={rowData.laundrystatus}>{laundryStatusDisplay[rowData.laundrystatus]}</span>;
    }

    weightBodyTemplate(rowData) {
        return <span className={rowData.weightstatus}>{rowData.weightstatus}</span>;
    }

    activeBodyTemplate(rowData) {
        return <span className={rowData.activestatus}>{rowData.activestatus}</span>;
    }

    detergentBodyTemplate(rowData){
        return <span className={rowData.detergent}>{rowData.detergent}</span>;
    }

    fabricSoftenerBodyTemplate(rowData){
        return <span className={rowData.fabric_softener}>{rowData.fabric_softener}</span>;
    }

    specialRequestBodyTemplate(rowData){
        return <span className={rowData.special_request}>{rowData.special_request}</span>;
    }

    renderStatusFilter() {
        var statuses =  [
            {label: 'Picked Up', value: 'picked-up'},
            {label: 'Out of Service', value: 'out-of-service'},
            {label: 'Delivered to SH', value: 'delivered-to-SH'},
            {label: 'Delivered to Dorm', value: 'delivered-to-dorm'},
            {label: 'Bag Missing', value: 'bag-missing'},
            { label: 'Start of Quarter', value: 'start-of-quarter' }
                ];
        return (
            <Dropdown value={this.state.selectedStatus} options={statuses} onChange={this.onStatusFilterChange}
                showClear={true} placeholder="Filter Status" className="p-column-filter" style={{ maxWidth: 200, minWidth: 50 }}/>
        );
    }

    onStatusFilterChange(event) {
        this.dt.filter(event.value, 'laundrystatus', 'equals');
        this.setState({selectedStatus: event.value});
    }

    componentDidMount() {
        const customerArray = [];
        firebase.database().ref('/bulk_orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().activestatus === 'active') {
                    customerArray.push(childSnapshot.toJSON());
                }
            });
            console.log(customerArray)
            console.log(customerArray[0])
        });
        this.setState({ customers: customerArray });
        this.setState({ bulk_orders: customerArray })
    }

    render() {
        const statusFilter = this.renderStatusFilter();


        var header = <div style={{ textAlign: 'left' }}>
            <Button type="button" style={{ backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginRight: 10 }} icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.export}>
            </Button>
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <div className="card">
                    <h1>Ink Tank Bulk Orders Dashboard</h1>
                    <p>This page will list either just current or all ongoing and past ink tank bulk orders.</p>
                    <DataTable value={this.state.bulk_orders} header={header} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} responsive={true} autoLayout={true} >
                        <Column field="id" header="ID" sortable={true} />
                        <Column field="name" header="Name" style={{ maxWidth: 150 }} sortable filter filterPlaceholder="Search name" exportable={false}/>
                        <Column field="organization" header="Organization" style={{ maxWidth: 150 }} sortable={true} filter filterElement={statusFilter}  exportable={false}/>
                        <Column field="blank" header="Blank" style={{ maxWidth: 150 }}  sortable={true}  exportable={false}/>
                        <Column field="design" header="Design" style={{ maxWidth: 100 }} sortable={true}  />
                        <Column field="tax_exempt" header="Tax Exempt" style={{ maxWidth: 100 }} sortable={true}  exportable={false}/>
                        <Column field="team_member" header="Team Member" style={{ maxWidth: 100 }} sortable={true}  exportable={false}/>
                        <Column field="status" header="Status" style={{ maxWidth: 100 }} sortable={true}  exportable={false}/>
                        
                    </DataTable>
                </div>
            </div>
        );

        }
    }

