import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { Chart } from 'primereact/chart'
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { InputTextarea } from 'primereact/inputtextarea';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';

import firebase from 'firebase/app';
import 'firebase/database';

import validator from 'validator'


import customerData from '../customers.json';
// import classNames from 'classnames';

import '../Dashboard.css';
//import { arrayToHash } from '@fullcalendar/core/util/object';


export class AddOrders extends Component {

    constructor() {
        super();
        this.state = {
            customers: [],
            orders: [],
            bulk_orders: [],
            selectedCustomer: null,
            selectedOrders: null,
            editing: false,
            idcount: null,
            name: '',
            team_member: '',
            blank: '',
            design: '',
            organization: '',
            tax_exempt: '',
            quantity: '',
            order_quote: '',
            final_total: '',
            phone: '',
            fullphone: '',
            email: '',
            fullemail: '',
            newaddress: '',
            address: '',
            newcity: '',
            city: '',
            newstate: '',
            state: '',
            newpostalcode: '',
            postal_code: '',
            ship_address: '',
            planSelectYear: [
                { label: '2020-2021', value: '2020-2021' },
                { label: '2021-2022', value: '2021-2022' },
                { label: '2022-2023', value: '2022-2023' },
                { label: '2023-2024', value: '2023-2024' }
            ],
            planTeamMember: [
                { label: 'Caden Gaviria', value: 'Caden Gaviria' },
                { label: 'Philippe Manzone', value: 'Philippe Manzone' },
                { label: 'Alec Aragon', value: 'Alec Aragon' },
                { label: 'Shannon Groves', value: 'Shannon Groves' },
                { label: 'Ali Kilic', value: 'Ali Kilic' },
                { label: 'Kethan Bajaj', value: 'Kethan Bajaj' }
            ],
            planSelectStatus: [
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'In Production', value: 'in production' },
                { label: 'Invoiced', value: 'invoiced' },
                { label: 'Fulfilled', value: 'fulfilled' },
                { label: 'Shipped', value: 'Shipped' },
                { label: 'Quote', value: 'quote' }
            ],
            planYesNo: [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' }
            ]

        };
        this.edit = this.edit.bind(this);
        this.onTeamMemberValueChange = this.onTeamMemberValueChange.bind(this)
        this.resetNewInfo = this.resetNewInfo.bind(this)
        this.addBulkOrder = this.addBulkOrder.bind(this)
        this.padId = this.padId.bind(this)
    }


    padId(idNum) {
        var digitLength = (idNum.toString()).length;
        if (digitLength === 1) {
            var result = '0000' + idNum;
        }
        else if (digitLength === 2) {
            var result = '000' + idNum;
        }
        else if (digitLength === 3) {
            var result = '00' + idNum;
        }
        else if (digitLength === 4) {
            var result = '0' + idNum;
        }
        else if (digitLength === 5) {
            var result = idNum.toString();
        }
        return result;

    }
    edit() {
        this.setState({ editing: true });
        //this.resetNewInfo();
    }
    /*
        save(bulk_order) {
            this.setState({ editing: false });
            //console.log(this.state.newplan)
            let allbulkorders = [...this.state.bulk_orders];
            let newbulkorder = { ...this.state.selectedOrders };
    
            if (this.state.newaddress && this.state.newcity && this.state.newstate && this.state.newpostalcode) {
                newbulkorder.ship_address = this.state.newaddress + this.state.newcity + ', ' + this.state.newstate + this.state.newpostalcode;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/ship_address').set(newbulkorder.ship_address);
            }
    
            if (this.state.blank) {
                newbulkorder.blank = this.state.blank;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/blank').set(newbulkorder.blank);
            }
            if (this.state.quantity) {
                newbulkorder.quantity = this.state.quantity;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/quantity').set(newbulkorder.quantity);
            }
            if (this.state.phone) {
                newbulkorder.phone = this.state.phone;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/phone').set(newbulkorder.phone);
            }
            if (this.state.email) {
                newbulkorder.email = this.state.email;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/email').set(newbulkorder.email)
            }
            if (this.state.organization) {
                newbulkorder.organization = this.state.organization;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/organization').set(newbulkorder.organization)
            }
            if (this.state.order_quote) {
                newbulkorder.order_quote = this.state.order_quote;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/order_quote').set(newbulkorder.order_quote)
            }
            if (this.state.final_total) {
                newbulkorder.final_total = this.state.final_total;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/final_total').set(newbulkorder.final_total)
            }
            if (this.state.tax_exempt) {
                newbulkorder.tax_exempt = this.state.tax_exempt;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/tax_exempt').set(newbulkorder.tax_exempt)
            }
            if (this.state.team_member) {
                newbulkorder.order_quote = this.state.team_member;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/team_member').set(newbulkorder.team_member)
            }
            if (this.state.design) {
                newbulkorder.design = this.state.design;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/design').set(newbulkorder.design)
            }
            if (this.state.name) {
                newbulkorder.name = this.state.name;
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/name').set(newbulkorder.name)
                firebase.database().ref('/bulk_orders/' + bulk_order.order_id + '/status').set('invoiced')
            }
    
            let count = 0;
            let individual = null;
            allbulkorders.map(each => {
                if (newbulkorder.order_id == each.order_id) {
                    individual = { ...allbulkorders[count] };
                    individual = newbulkorder;
                    allbulkorders[count] = individual;
                }
                count = count + 1
            })
            this.setState({ bulk_orders: allbulkorders });
            this.setState({ selectedOrders: newbulkorder });
    
        }
    */
    //CUSTOMER INFORMATION EDITING
    onNameValueChange(value) {
        //console.log('new first name: ', value)
        this.setState({ name: value });

    }

    onTeamMemberValueChange(value) {
        //console.log('newPlanYear: ', value)
        this.setState({ team_member: value });
    }
    onBlankValueChange(value) {
        //console.log('newPlanQuarter: ', value)
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ blank: "NA" });
        }
        else {
            this.setState({ blank: value });
        }
    }
    onDesignValueChange(value) {
        this.setState({ design: value });
    }
    onOrganizationValueChange(value) {
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ organization: "NA" });
        }
        else {
            this.setState({ organization: value })
        }
    }
    onTaxExemptValueChange(value) {
        this.setState({ tax_exempt: value });
    }
    onQuantityValueChange(value) {
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ quantity: "NA" })
        }
        else {
            this.setState({ quantity: value });
        }
    }
    onOrderQuoteValueChange(value) {
        //try, execept 
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ order_quote: "NA" })
        }
        else {
            this.setState({ order_quote: value });
        }
    }
    onFinalTotalValueChange(value) {
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ final_total: "NA" })
        }
        else {
            this.setState({ final_total: value });
        }
    }
    onPhoneValueChange(value) {
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ fullphone: "NA" })
            this.setState({ phone: "NA" })
        } else if (value[3] === '-' && value[7] === '-' && value.length === 12) {
            this.setState({ fullphone: value })
        }
        else {
            this.setState({ phone: value })
        }
        //this.setState({ phone: value });
        // if value == NA: set to NA; conver to uppercase
        // else; cast as float

    }
    onEmailValueChange(value) {
        if (value.includes('@') && value.includes('.')) {
            this.setState({ fullemail: value });
        }
        this.setState({ email: value });

    }
    onAddressValueChange(value) {
        if ((value.toUpperCase() === "NA" || value.toUpperCase() === "N/A")) {
            this.setState({ newaddress: "NA" })
        }
        else {
            this.setState({ newaddress: value });
        }
    }
    onCityValueChange(value) {
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ newcity: "NA" })
        }
        else {
            this.setState({ newcity: value });
        }
    }
    onStateValueChange(value) {
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ newstate: "NA" })
        }
        else {
            this.setState({ newstate: value });
        }
    }
    onPostalCodeValueChange(value) {
        if (value.toUpperCase() === "NA" || value.toUpperCase() === "N/A") {
            this.setState({ newpostalcode: "NA" });
        }
        else {
            this.setState({ newpostalcode: value })
        }
    }
    resetNewInfo() {
        this.setState({ name: '' });
        this.setState({ team_member: '' });
        this.setState({ blank: '' });
        this.setState({ design: '' });
        this.setState({ organization: '' });
        this.setState({ tax_exempt: '' });
        this.setState({ quantity: '' });
        this.setState({ order_quote: '' });
        this.setState({ final_total: '' });
        this.setState({ phone: '' });
        this.setState({ email: '' });
        this.setState({ newaddress: '' });
        this.setState({ newstate: '' });
        this.setState({ newcity: '' });
        this.setState({ newpostalcode: '' });
    }

    addBulkOrder() {
        //console.log('new first name: ', this.state.newfirstname);
        //console.log('new last name: ', this.state.newlastname);
        // console.log('new plan year: ', this.state.newplanyear);
        // console.log('new plan quarter: ', this.state.newplanquarter);
        // console.log('new max weight: ', this.state.newmax);
        // console.log('new res hall: ', this.state.newreshall);
        // console.log('new phone: ', this.state.newphone);
        // console.log('new email: ', this.state.newemail);
        //this.setState({idcount: this.state.idcount+1});
        //console.log('updated id Count', this.state.idcount);

        if (this.state.name !== '' && this.state.organization !== '' && this.state.fullemail !== '' && this.state.fullphone !== '' && this.state.blank !== '' && this.state.design !== '' && this.state.team_member !== null && this.state.tax_exempt !== null && this.state.quantity !== null && this.state.order_quote !== null && this.state.final_total !== null) {

            var idNum = this.padId(this.state.idcount);
            // var id = this.state.newfirstname.substring(0,1).toLowerCase() +this.state.newlastname.substring(0,1).toLowerCase()+idNum;
            var order_id = this.state.idcount;
            //console.log('NEW ID: ', order_id);
            this.messages.show({ severity: 'success', summary: 'Success', detail: 'Order Added!' });
            const db = firebase.database().ref()
            //updating order_id count in firebase and then updating state variable
            db.child('/idcount').set(this.state.idcount + 1);
            db.child('/idcount').once('value')
                .then(snapshot => {
                    this.setState({ idcount: snapshot.val() })
                    console.log('state var idcount: ', this.state.idcount);
                    //idNum = snapshot.val();
                    console.log('id from firebase: ', snapshot.val());
                });

            const name = this.state.name;
            const phone = this.state.fullphone;
            const email = this.state.fullemail;
            const organization = this.state.organization
            const design = this.state.design
            const blank = this.state.blank
            const quantity = this.state.quantity
            const ship_address = this.state.newaddress + ' ' + this.state.newcity + ' ' + this.state.newstate + ' ' + this.state.newpostalcode
            const final_total = this.state.final_total
            const order_quote = this.state.order_quote
            const team_member = this.state.team_member
            const tax_exempt = this.state.tax_exempt
            db.child('/bulk_orders/' + order_id).once("value")
                .then(snapshot => {
                    if (!snapshot.val()) {
                        db.child('/bulk_orders/' + order_id + '/active').set("Yes");
                        db.child('/bulk_orders/' + order_id + '/status').set("invoiced");
                        db.child('/bulk_orders/' + order_id + '/email').set(email);
                        db.child('/bulk_orders/' + order_id + '/order_id').set(order_id.toString());
                        db.child('/bulk_orders/' + order_id + '/last_status_updated').set('N/A');
                        db.child('/bulk_orders/' + order_id + '/name').set(name);
                        db.child('/bulk_orders/' + order_id + '/phone').set(phone);
                        db.child('/bulk_orders/' + order_id + '/organization').set(organization);
                        db.child('/bulk_orders/' + order_id + '/design').set(design);
                        db.child('/bulk_orders/' + order_id + '/blank').set(blank);
                        db.child('/bulk_orders/' + order_id + '/ship_address').set(ship_address);
                        db.child('/bulk_orders/' + order_id + '/final_total').set(final_total);
                        db.child('/bulk_orders/' + order_id + '/order_quote').set(order_quote);
                        db.child('/bulk_orders/' + order_id + '/team_member').set(team_member);
                        db.child('/bulk_orders/' + order_id + '/quantity').set(quantity);
                        db.child('/bulk_orders/' + order_id + '/tax_exempt').set(tax_exempt);

                    }
                })
            this.setState({ name: '' });
            this.setState({ email: '' });
            this.setState({ phone: '' });
            this.setState({ organization: '' });
            this.setState({ design: '' });
            this.setState({ blank: '' });
            this.setState({ ship_address: '' });
            this.setState({ address: '' });
            this.setState({ city: '' });
            this.setState({ state: '' });
            this.setState({ postal_code: '' });
            this.setState({ final_total: '' });
            this.setState({ order_quote: '' });
            this.setState({ team_member: '' });
            this.setState({ quantity: '' });
            this.setState({ tax_exempt: '' });
            this.setState({ fullphone: '' });
            this.setState({ fullemail: '' });
            //const curr  = await this.resetNewInfo();

            //console.log('reset info: ', this.state.newfirstname);
            //document.getElementById("form").reset();
        }
        else {
            this.messages.show({ severity: "error", summary: "Invalid or Missing Fields", detail: 'Please enter all information or "NA" if field information is not available' });
        }

    }

    /* --------------- Filters ---------------- */
    componentDidMount() {
        const customerArray = [];
        firebase.database().ref('/bulk_orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                customerArray.push(childSnapshot.toJSON());
            });
        });
        this.setState({ customers: customerArray });
        this.setState({ bulk_orders: customerArray });
        const orderArray = [];
        firebase.database().ref('/orders').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                orderArray.push(childSnapshot.toJSON());
            });
        });
        this.setState({ orders: orderArray });
        var idNum = 0;
        firebase.database().ref('/idcount').once('value')
            .then(snapshot => {
                this.setState({ idcount: snapshot.val() })
                console.log('state var idcount: ', this.state.idcount);
                idNum = snapshot.val();
                console.log('id from firebase: ', snapshot.val());
            });
        //console.log('var idNum: ', idNum);
        this.setState({ idcount: idNum });
    }

    render() {
        var header = <div style={{ textAlign: 'left' }}></div>
        var bulk_order = this.state.selectedOrders
        //var history = this.getCustomerHistory(customer)

        return (
            <div className="card" id="form">
                <h1>Add New Order Inquiry</h1>
                <p>Use this form to enter all information about a new order or order inquiry</p>

                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="firstname6">Name*</label>
                        <InputText value={this.state.name} id="firstname" type="text" onChange={(e) => { this.onNameValueChange(e.target.value); }} />
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="lastname6">Organization</label>
                        <InputText value={this.state.organization} id="lastname" type="text" onChange={(e) => { this.onOrganizationValueChange(e.target.value); }} placeholder='Type Organization or "NA"' />
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="firstname6">Blank</label>
                        <InputText value={this.state.blank} id="blank" type="text" onChange={(e) => { this.onBlankValueChange(e.target.value); }} placeholder='Type Blank or "NA"' />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="firstname6">Email*</label>
                        <InputText value={this.state.email} id="newemail" type="text" onChange={(e) => { this.onEmailValueChange(e.target.value); }} placeholder='Required'/>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="firstname6">Phone</label>
                        <InputText value={this.state.phone} id="newphone" type="text" onChange={(e) => { this.onPhoneValueChange(e.target.value); }} placeholder='###-###-#### or "NA"' />
                    </div>


                    <div className="p-field p-col-12 p-md-3">
                        <label htmlFor="address">Street Address</label>
                        <InputText value={this.state.newaddress} id="newaddress" type="text" onChange={(e) => { this.onAddressValueChange(e.target.value); }} placeholder='Type Street Address or "NA"' />

                    </div>
                    <div className="p-field p-col-12 p-md-3">
                        <label htmlFor="lastname6">City</label>
                        <InputText value={this.state.newcity} id="newaddress" type="text" onChange={(e) => { this.onCityValueChange(e.target.value); }} placeholder='Type City Name or "NA"' />
                    </div>
                    <div className="p-field p-col-12 p-md-3">
                        <label htmlFor="city">State</label>
                        <InputText value={this.state.newstate} id="newaddress" type="text" onChange={(e) => { this.onStateValueChange(e.target.value); }} placeholder='Type State or "NA"' />
                    </div>
                    <div className="p-field p-col-12 p-md-3">
                        <label htmlFor="state">Postal Code</label>
                        <InputText value={this.state.newpostalcode} id="newaddress" type="text" onChange={(e) => { this.onPostalCodeValueChange(e.target.value); }} placeholder='Type Postal Code or "NA"' />    </div>


                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="firstname6">Tax-Exempt</label>
                        <Dropdown value={this.state.tax_exempt} options={this.state.planYesNo} onChange={(e) => { this.onTaxExemptValueChange(e.target.value); }} placeholder='Select Yes or No' />
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="lastname6">Design</label>
                        <Dropdown value={this.state.design} options={this.state.planYesNo} onChange={(e) => { this.onDesignValueChange(e.target.value); }} placeholder='Select Yes or No' />
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="firstnames6">Assigned Ink Tank Team Member</label>
                        <Dropdown value={this.state.team_member} options={this.state.planTeamMember} onChange={(e) => { this.onTeamMemberValueChange(e.target.value); }} placeholder='Select Team Member' />

                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="firstname6">Quantity</label>
                        <InputText value={this.state.quantity} id="quantity" type="text" onChange={(e) => { this.onQuantityValueChange(e.target.value); }} placeholder='Type Quantity or "NA"' />
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="lastname6">Order Quote</label>
                        <InputText value={this.state.order_quote} id="order_quote" type="text" onChange={(e) => { this.onOrderQuoteValueChange(e.target.value); }} placeholder='Type Order Quote or "NA"' />
                    </div>
                    <div className="p-field p-col-12 p-md-4">
                        <label htmlFor="firstname6">Final Total</label>
                        <InputText value={this.state.final_total} id="final_total" type="text" onChange={(e) => { this.onFinalTotalValueChange(e.target.value); }} placeholder='Type Final Total or "NA"' />
                    </div>


                    <div className="p-field p-col-12">
                        <Button type="button" style={{ color: 'white', backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginTop: 30 }} label="ADD ORDER" onClick={() => { this.addBulkOrder() }} />
                    </div>
                    <div className="p-field p-col-12">
                        <Messages ref={(el) => this.messages = el}></Messages>
                    </div>


                </div>
            </div>
        );




    }
}
