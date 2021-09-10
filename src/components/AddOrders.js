import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { Chart } from 'primereact/chart'
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import {InputTextarea} from 'primereact/inputtextarea';
import {Messages} from 'primereact/messages';
import {Message} from 'primereact/message';

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
            newfirstname: null,
            newlastname: null,
            newid: null,
            newplanYear: null,
            newplanQuarter: null,
            newmax: null,
            newreshall: null,
            newphone: null,
            newemail: null,
            newaddress: null,
            newcity: null,
            newstate: null,
            newpostalcode: null,
            planSelectYear: [
                {label: '2020-2021', value: '2020-2021'},
                {label: '2021-2022', value: '2021-2022'},
                {label: '2022-2023', value: '2022-2023'},
                {label: '2023-2024', value: '2023-2024'}
            ],
            planTeamMember: [
                { label: 'Caden Gaviria', value: 'Caden Gaviria' },
                { label: 'Philippe Manzone', value: 'Philippe Manzone'},
                { label: 'Alec Aragon', value: 'Alec Aragon'},
                { label: 'Shannon Groves', value: 'Shannon Groves'},
                { label: 'Ali Kilic', value: 'Ali Kilic'}
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
                {label: 'Yes', value: 'yes'},
                {label: 'No', value: 'no'}
            ]

        };
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.onTeamMemberValueChange = this.onTeamMemberValueChange.bind(this)
        //this.onPlanQuarterValueChange = this.onPlanQuarterValueChange.bind(this)
        //this.getCustomerHistory = this.getCustomerHistory.bind(this)
        //this.displayPlanQuarters = this.displayPlanQuarters.bind(this)
        this.resetNewInfo = this.resetNewInfo.bind(this)
        this.addBulkOrder = this.addBulkOrder.bind(this)
        this.padId = this.padId.bind(this)
    }


    padId(idNum) {
        var digitLength = (idNum.toString()).length;
        if (digitLength === 1) {
            var result = '0000'+idNum;
        }
        else if (digitLength === 2) {
            var result = '000'+idNum;
        }
        else if (digitLength === 3) {
            var result = '00'+idNum;
        }
        else if (digitLength === 4) {
            var result = '0'+idNum;
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

    save(bulk_order) {
        this.setState({ editing: false });
        //console.log(this.state.newplan)
        let allbulkorders = [...this.state.bulk_orders];
        let newbulkorder = {...this.state.selectedOrders};

        if (this.state.newaddress && this.state.newcity && this.state.newstate && this.state.newpostalcode) {
            newbulkorder.ship_address = this.state.newaddress+this.state.newcity+this.state.newstate+this.state.newpostalcode;
            //console.log('newplanQuarter: ', this.state.newplanQuarter);
            //console.log('newplanYear', this.state.newplanYear)
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/ship_address').set(newbulkorder.ship_address);
        }

        if (this.state.blank) {
            newbulkorder.blank = this.state.blank;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/blank').set(newbulkorder.blank);
       }
        if (this.state.quantity) {
            newbulkorder.quantity = this.state.quantity;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/quantity').set(newbulkorder.quantity);
        }
        if (this.state.phone) {
            newbulkorder.phone = this.state.phone;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/phone').set(newbulkorder.phone);
        }
        if (this.state.email) {
            newbulkorder.email = this.state.email;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/email').set(newbulkorder.email)
        }
        if (this.state.organization) {
            newbulkorder.organization = this.state.organization;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/organization').set(newbulkorder.organization)
        }
        if (this.state.order_quote) {
            newbulkorder.order_quote = this.state.order_quote;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/order_quote').set(newbulkorder.order_quote)
        }
        if (this.state.final_total) {
            newbulkorder.final_total = this.state.final_total;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/final_total').set(newbulkorder.final_total)
        }
        if (this.state.tax_exempt) {
            newbulkorder.tax_exempt = this.state.tax_exempt;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/tax_exempt').set(newbulkorder.tax_exempt)
        }
        if (this.state.team_member) {
            newbulkorder.order_quote = this.state.team_member;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/team_member').set(newbulkorder.team_member)
        }
        if (this.state.design) {
            newbulkorder.design = this.state.design;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/design').set(newbulkorder.design)
        }
        if (this.state.name) {
            newbulkorder.name = this.state.name;
            firebase.database().ref('/bulk_orders/' + bulk_order.id + '/name').set(newbulkorder.name)
        }

        let count = 0;
        let individual=null;
        allbulkorders.map(each => {
            if (newbulkorder.id == each.id) {
                individual = {...allbulkorders[count]};
                individual= newbulkorder;
                allbulkorders[count] = individual;
            }
            count = count+1
        })
        this.setState({ bulk_orders: allbulkorders });
        this.setState({selectedOrders: newbulkorder});
        
    }

    //CUSTOMER INFORMATION EDITING
    onNameValueChange(value) {
        //console.log('new first name: ', value)
        this.setState({name: value});
        
    }

    onTeamMemberValueChange(value) {
        //console.log('newPlanYear: ', value)
        this.setState({ team_member: value });
    }
    onBlankValueChange(value) {
        //console.log('newPlanQuarter: ', value)
        this.setState({ blank: value });
    }
    onDesignValueChange(value) {
        this.setState({ design: value });
    }
    onOrganizationValueChange(value) {
        this.setState({ organization: value });
    }
    onTaxExemptValueChange(value) {
        this.setState({ tax_exempt: value });
    }
    onQuantityValueChange(value) {
        this.setState({ quantity: value });
    }
    onOrderQuoteValueChange(value) {
        //try, execept 
        this.setState({ order_quote: value });
    }
    onFinalTotalValueChange(value) {
        this.setState({ final_total: value });
    }
    onPhoneValueChange(value) {
        // if (value == "NA") {
        //     this.setState({ phone: "NA"})
        // }else{
        //     if(value[3] ==='-' && value[7]==='-' && value.length===12) {
        //         this.setState({ phone: value });
        //     }
        // }
        this.setState({ phone: value });
        // if value == NA: set to NA; conver to uppercase
        // else; cast as float
        
    }
    onEmailValueChange(value) {
        if (value.includes('@') && value.includes('.')) {
            this.setState({ email: value });
        }
    }
    onAddressValueChange(value) {
        this.setState({newaddress: value});  
    }
    onCityValueChange(value) {
        this.setState({ newcity: value});  
    }
    onStateValueChange(value) {
        this.setState({ newstate: value});  
    }
    onPostalCodeValueChange(value) {
        this.setState({ newpostalcode: value});  
    }
    resetNewInfo() {
        this.setState({name: ''});
        this.setState({ team_member: ''});
        this.setState({ blank: '' });
        this.setState({ design: '' });
        this.setState({ organization: ''});
        this.setState({ tax_exempt: '' });
        this.setState({ quantity: '' });
        this.setState({ quantity: '' });
        this.setState({ order_quote: '' });
        this.setState({ final_total: '' });
        this.setState({ phone: ''});
        this.setState({ email: ''});
        this.setState({ newaddress: ''});
        this.setState({ newstate: ''});
        this.setState({ newcity: ''});
        this.setState({ newpostalcode: ''});
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
        if(this.state.name !=='' && this.state.organization !== '' && this.state.email !=='' && this.state.phone !== '' && this.state.blank!=='' && this.state.design!=='' && this.state.team_member!==null && this.state.tax_exempt !== null && this.state.quantity !== null && this.state.order_quote !== null && this.state.final_total !== null) {
            
            var idNum = this.padId(this.state.idcount);
            // var id = this.state.newfirstname.substring(0,1).toLowerCase() +this.state.newlastname.substring(0,1).toLowerCase()+idNum;
            var id = this.state.idcount;
            //console.log('NEW ID: ', id);
            this.messages.show({severity: 'success', summary: 'Success', detail: 'Order Added!'});
            const db = firebase.database().ref()
            //updating id count in firebase and then updating state variable
            db.child('/idcount').set(this.state.idcount+1);
            db.child('/idcount').once('value')
                .then(snapshot => {
                    this.setState({idcount: snapshot.val()})
                    console.log('state var idcount: ', this.state.idcount);
                    //idNum = snapshot.val();
                    console.log('id from firebase: ', snapshot.val());
                });

            const name = this.state.name;
            const email = this.state.email
            const phone = this.state.phone
            const organization = this.state.organization
            const design = this.state.design
            const blank = this.state.blank
            const quantity = this.state.quantity
            const ship_address = this.state.newaddress + this.state.newcity + this.state.newstate + this.state.newpostal_code
            const final_total = this.state.final_total
            const order_quote = this.state.order_quote
            const team_member = this.state.team_member
            db.child('/bulk_orders/'+id).once("value")
                .then(snapshot => {
                    if(!snapshot.val()) {
                        db.child('/bulk_orders/'+id+'/status').set("Yes");
                        db.child('/bulk_orders/'+id+'/email').set(email);
                        db.child('/bulk_orders/'+id+'/id').set(id);
                        db.child('/bulk_orders/'+id+'/last_status_updated').set('N/A');
                        db.child('/bulk_orders/'+id+'/name').set(name);
                        db.child('/bulk_orders/'+id+'/phone').set(phone);
                        db.child('/bulk_orders/'+id+'/organization').set(organization);
                        db.child('/bulk_orders/'+id+'/design').set(design);
                        db.child('/bulk_orders/'+id+'/blank').set(blank);
                        db.child('/bulk_orders/'+id+'/ship_address').set(ship_address);
                        db.child('/bulk_orders/'+id+'/final_total').set(final_total);
                        db.child('/bulk_orders/'+id+'/order_quote').set(order_quote);
                        db.child('/bulk_orders/'+id+'/team_member').set(team_member);
                        db.child('/bulk_orders/'+id+'/quantity').set(quantity);

                    }
                })

            this.setState({email: ''});
            this.setState({phone: ''});
            this.setState({ organization: '' });
            this.setState({ design: ''});
            this.setState({ blank: '' });
            this.setState({ ship_address: '' });
            this.setState({ final_total: '' });
            this.setState({ order_quote: '' });
            this.setState({ team_member: '' });
            this.setState({ quantity: '' });
            //const curr  = await this.resetNewInfo();
       
            //console.log('reset info: ', this.state.newfirstname);
            //document.getElementById("form").reset();
        }
        else {
            this.messages.show({severity: "error", summary: "Missing Fields", detail: "Please enter all information"});
        }

    }

    // displayPlanQuarters(customerPlan) {
    //     if (customerPlan) {

    //         if (customerPlan === 'F') {
    //             const result = 'Fall Quarter';
    //             return result;
    //         }
    //         else if (customerPlan === 'W') {
    //             const result = 'Winter Quarter' ;
    //             return result;
    //         }
    //         else if (customerPlan === 'S') {
    //             const result = 'Spring Quarter' ;
    //             return result;
    //         }
    //         else if (customerPlan === 'W-S') {
    //             const result = 'Winter/Spring Quarter' ;
    //             return result;
    //         }
    //         else if (customerPlan === 'F-W-S') {
    //             const result = 'Full Year' ;
    //             return result;
    //         }
    //     }
    // }



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
                this.setState({idcount: snapshot.val()})
                console.log('state var idcount: ', this.state.idcount);
                idNum = snapshot.val();
                console.log('id from firebase: ', snapshot.val());
            });
        //console.log('var idNum: ', idNum);
        this.setState({idcount: idNum});
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
        <label htmlFor="firstname6">Name</label>
        <InputText value={this.state.name} id="firstname" type="text" onChange={(e) => { this.onNameValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="lastname6">Organization</label>
        <InputText value={this.state.organization} id="lastname" type="text" onChange={(e) => { this.onOrganizationValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="firstname6">Blank</label>
        <InputText value={this.state.blank} id="blank" type="text" onChange={(e) => { this.onBlankValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-6">
        <label htmlFor="firstname6">Email</label>
        <InputText value={this.state.email} id="newemail" type="text" onChange={(e) => { this.onEmailValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-6">
        <label htmlFor="firstname6">Phone</label>
        <InputText value={this.state.phone} id="newphone" type="text" onChange={(e) => { this.onPhoneValueChange(e.target.value); }} placeholder='Type Phone Number or "NA"'/>
    </div>


    <div className="p-field p-col-12 p-md-3">
        <label htmlFor="address">Address</label>
        <InputText value={this.state.address} id="newaddress" type="text" onChange={(e) => { this.onAddressValueChange(e.target.value); }}/>

    </div>
    <div className="p-field p-col-12 p-md-3">
        <label htmlFor="lastname6">City</label>
        <InputText value={this.state.city} id="newaddress" type="text" onChange={(e) => { this.onCityValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-3">
        <label htmlFor="city">State</label>
        <InputText value={this.state.state} id="newaddress" type="text" onChange={(e) => { this.onStateValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-3">
        <label htmlFor="state">Postal Code</label>
        <InputText value={this.state.postal_code} id="newaddress" type="text" onChange={(e) => { this.onPostalCodeValueChange(e.target.value); }}/>    </div>


    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="firstname6">Tax-Exempt</label>
        <Dropdown value={this.state.tax_exempt} options={this.state.planYesNo} onChange={(e) => { this.onTaxExemptValueChange(e.target.value); }} placeholder='Select Yes or No'/>
    </div>
    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="lastname6">Design</label>
        <Dropdown value={this.state.design} options={this.state.planYesNo} onChange={(e) => { this.onDesignValueChange(e.target.value); }} placeholder='Select Yes or No'/>
    </div>
    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="firstnames6">Assigned Ink Tank Team Member</label>
        <Dropdown  value={this.state.team_member} options={this.state.planTeamMember} onChange={(e) => {this.onTeamMemberValueChange(e.target.value);}} placeholder='Select Team Member'/>

    </div>
    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="firstname6">Quantity</label>
        <InputText value={this.state.quantity} id="quantity" type="text" onChange={(e) => { this.onQuantityValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="lastname6">Order Quote</label>
        <InputText value={this.state.order_quote} id="order_quote" type="text" onChange={(e) => { this.onOrderQuoteValueChange(e.target.value); }}/>
    </div>
    <div className="p-field p-col-12 p-md-4">
        <label htmlFor="firstname6">Final Total</label>
        <InputText value={this.state.final_total} id="final_total" type="text" onChange={(e) => { this.onFinalTotalValueChange(e.target.value); }} />
    </div>
    
    
    <div className = "p-field p-col-12">
    <Button type="button" style={{ color: 'white', backgroundColor: '#6a09a4', borderColor: '#6a09a4', marginTop: 30 }} label="ADD ORDER" onClick={() => {this.addBulkOrder()}} />
    </div>
    <div className = "p-field p-col-12">
    <Messages ref={(el) => this.messages = el}></Messages>
    </div>


</div>
</div>
            );




    }
}
