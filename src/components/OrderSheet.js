import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';

import firebase from 'firebase/app';
import 'firebase/database';

// import classNames from 'classnames';

import '../Dashboard.css';
//import { arrayToHash } from '@fullcalendar/core/util/object';


export class OrderSheet extends Component {

    constructor() {
        super();
        this.state = {
            customers: [],
            orders: [],
            bulk_orders: [],
            selectedStatus: null,
            editing: false
        };
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.export = this.export.bind(this);
        this.onStatusFilterChange = this.onStatusFilterChange.bind(this);

        this.generalEditor = this.generalEditor.bind(this);
    }
    export() {
        this.dt.exportCSV();
    }

    /* --------------- Editing ---------------- */
    edit() {
        this.setState({ editing: true });
        this.growl.show({ severity: 'info', summary: 'Editing Enabled', detail: 'Save changes before continuing' });
    }

    save() {
        this.setState({ editing: false });
        this.growl.clear();
    }

    onEditorValueChange(props, value) {
        firebase.database().ref('/customers/' + props.rowData.id + '/' + props.field).set(value)
        let updatedCustomers = [...props.value];
        updatedCustomers[props.rowIndex][props.field] = value;
        this.setState({ customers: updatedCustomers });
        console.log(props)
    }

    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    generalEditor(props) {
        return this.inputTextEditor(props, ' ');
    }

    phoneValidator(props) {
        let value = props.rowData[props.field]
        return value[3] === '-' && value.length === 12;
    }
    emailValidator(props) {
        let value = props.rowData[props.field]
        return value && value.length > 0;
    }

    /* --------------- Filters ---------------- */
    statusBodyTemplate(rowData) {
        var laundryStatusDisplay = {
            'picked-up': 'picked up',
            'delivered-to-SH': 'delivered to SH',
            'delivered-to-dorm': 'delivered to dorm',
            'out-of-service': 'out of service',
            'bag-missing': 'bag missing'
        }
        return <span className={rowData.laundrystatus}>{laundryStatusDisplay[rowData.laundrystatus]}</span>
    }

    weightBodyTemplate(rowData) {
        return <span className={rowData.weightstatus}>{rowData.weightstatus}</span>;
    }

    renderStatusFilter() {
        var statuses = [
            { label: 'Picked Up', value: 'picked-up' },
            { label: 'Out of Service', value: 'out-of-service' },
            { label: 'Delivered to SH', value: 'delivered-to-SH' },
            { label: 'Delivered to Dorm', value: 'delivered-to-dorm' },
            { label: 'Bag Missing', value: 'bag-missing' }
        ];
        return (
            <Dropdown value={this.state.selectedStatus} options={statuses} onChange={this.onStatusFilterChange}
                showClear={true} placeholder="Select a Status" className="p-column-filter" style={{ maxWidth: 200, minWidth: 50 }} />
        );
    }

    onStatusFilterChange(event) {
        this.dt.filter(event.value, 'laundrystatus', 'equals');
        this.setState({ selectedStatus: event.value });
    }

    componentDidMount() {
        const customerArray = [];
        firebase.database().ref('/bulk_orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                customerArray.push(childSnapshot.toJSON());
            });
        });
        this.setState({ bulk_orders: customerArray });
        const orderArray = [];
        firebase.database().ref('/orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                orderArray.push(childSnapshot.toJSON());
            });
        });
        this.setState({ orders: orderArray });
    }

    render() {
        const statusFilter = this.renderStatusFilter();
        /* --------------- RETURN ---------------- */
        /* ---------------- edit mode ------------*/
        var header = <div style={{ textAlign: 'left' }}></div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <div className="card">
                    <h1>Order Database</h1>
                    <p>This will show all updates to orders and who was assigned to the order at that time. This will create accountability if an order goes wrong and will help pinpoint issues in orders if they arise.</p>
                    <p>All members of the InkTank team should have read and write access to this database.</p>
                    <DataTable value={this.state.bulk_orders} header={header} ref={(el) => { this.dt = el; }} style={{ marginBottom: '20px' }} responsive={true} autoLayout={true} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}>
                        <Column field="date" header="Date" sortable={true} filter filterPlaceholder="Search by date"/>
                        <Column field="team_member" header="Team Member" sortable={true} filter filterPlaceholder="Search by team member"/>
                        <Column field="order_id" header="ID" sortable={true} filter filterPlaceholder="Search by ID"/>
                        <Column field="organization" header="Organization" sortable={true} filter filterPlaceholder="Search by organization"/>
                        <Column field="name" header="Name" sortable={true} filter filterPlaceholder="Search by name"/>
                        <Column field="status" header="Status" sortable={true}/>

                        
                    </DataTable>
                </div>
            </div>
        )

    }
}