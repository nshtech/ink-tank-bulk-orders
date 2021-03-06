import React, { Component } from 'react';
import classNames from 'classnames';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { Button } from 'primereact/button';
import { Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { OrderSearch } from './components/OrderSearch';
import { OrderTracker } from './components/OrderTracker';
import { OrderSheet } from './components/OrderSheet';
import { AddOrders } from './components/AddOrders';
import { FormsDemo } from './components/FormsDemo';
import { SampleDemo } from './components/SampleDemo';
import { DataDemo } from './components/DataDemo';
import { PanelsDemo } from './components/PanelsDemo';
import { OverlaysDemo } from './components/OverlaysDemo';
import { MenusDemo } from './components/MenusDemo';
import { MessagesDemo } from './components/MessagesDemo';
import { ChartsDemo } from './components/ChartsDemo';
import { MiscDemo } from './components/MiscDemo';
import { EmptyPage } from './components/EmptyPage';
import { Documentation } from "./components/Documentation";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
/*import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';*/
import './layout/layout.scss';
import './App.scss';
import './App.css';


import firebase from 'firebase/app';
import 'firebase/database';

import 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgoj3XqIh91DYeJiC4bh7EpylDOqZ43cU",
    authDomain: "ink-tank-bulk-orders.firebaseapp.com",
    databaseURL: "https://ink-tank-bulk-orders-default-rtdb.firebaseio.com",
    projectId: "ink-tank-bulk-orders",
    storageBucket: "ink-tank-bulk-orders.appspot.com",
    messagingSenderId: "231641991110",
    appId: "1:231641991110:web:ddd67fd2b417573e7514c7",
    measurementId: "G-7TDVQM7S2X"
};
firebase.initializeApp(firebaseConfig);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

class App extends Component {

    constructor() {
        super();
        this.state = {
            layoutMode: 'static',
            layoutColorMode: 'dark',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            user: null
        };
        this.login = this.login.bind(this); // <-- add this line
        this.logout = this.logout.bind(this);

        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.createMenu();
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                console.log(user.email)
                console.log(user.displayName)
                this.setState({
                    user
                })
                { window.location.reload() }
                { window.location = '/' }

            });
    }

    logout() {
        auth.signOut()

            .then(() => {
                this.setState({
                    user: null
                })
                { window.location = '/#/sign-out' }

            });
    }

    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }

        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
    }

    onMenuItemClick(event) {

        if (!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            })
        }

    }

    createMenu() {
        this.menu = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { window.location = '#/' } },
            { label: 'Order Tracker', icon: 'pi pi-fw pi-check', to: '/ordertracker' },
            {label: 'Add New Order Inquiry', icon: 'pi pi-fw pi-user-plus', to: '/addorders' },
            {label: 'Order Details', icon: 'pi pi-fw pi-search', to: '/ordersearch' },
            //{ label: 'History', icon: 'pi pi-fw pi-inbox', to: '/ordersheet' },

        ];
    }

    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    componentDidUpdate() {
        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
    }

    render() {
        const {
            user,
            signOut,
            signInWithGoogle,
        } = this.props;

        const wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': this.state.layoutMode === 'overlay',
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive
        });



        if (this.state.user && this.state.user.email.includes('studentholdings.org')) {
            // const db = firebase.database().ref()
            // if (this.state.user.photourl) {
            //     db.child('/users/' + this.state.user.uid).once("value")
            //         .then(snapshot => {
            //             if (!snapshot.val()) {
            //                 db.child('/users/' + this.state.user.uid).set({
            //                     username: this.state.user.displayName,
            //                     email: this.state.user.email,
            //                     photourl: this.state.user.photoUrl
            //                 })
            //             }
            //         })
            // } else {
            //     db.child('/users/' + this.state.user.uid).once("value")
            //         .then(snapshot => {
            //             if (!snapshot.val()) {
            //                 db.child('/users/' + this.state.user.uid).set({
            //                     username: this.state.user.displayName,
            //                     email: this.state.user.email,
            //                     photourl: "assets/layout/images/profile.png"
            //                 })
            //             }
            //         })
            // }

            localStorage.setItem('user', JSON.stringify(this.state.user))
        }


        return (
            <div>

                {this.state.user && !this.state.user.email.includes('studentholdings.org') ?
                    <div className="p-grid-login">
                        <div className="p-col-12">
                            <div className="login-error">
                                <p>FAILED LOG IN</p>
                            </div>
                            <div className="card login-card">

                                <h1>Rez Laundry Ops App</h1>
                                <p>Log in with your SH email for access.</p>

                                <div className="login-centered">
                                    <Button label="Log In" className="p-button-raised p-button-secondary" onClick={this.login} />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        {this.state.user && this.state.user.email.includes('studentholdings.org') ?
                            <div>
                                <div className={wrapperClass} onClick={this.onWrapperClick}>
                                    <AppTopbar onToggleMenu={this.onToggleMenu} logout={this.logout} />

                                    <div ref={(el) => this.sidebar = el} className='layout-sidebar' onClick={this.onSidebarClick}>
                                        <div className="layout-logo">
                                        <img alt="Logo" className="login-logo" src="/images/ink_tank_logo.png" />
                                        </div>
                                        <AppProfile user={this.state.user} />
                                        <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                                    </div>
                                    <div className="layout-main">
                                        <Route path="/" exact component={Dashboard} />
                                        <Route path="/ordersearch" component={OrderSearch} />
                                        <Route path="/ordertracker" component={OrderTracker} />
                                        <Route path="/ordersheet" component={OrderSheet} />
                                        <Route path="/addorders" component={AddOrders} />
                                        <Route path="/menudemo" component={MenusDemo} />
                                    </div>

                                    <AppFooter />

                                    <div className="layout-mask"></div>
                                </div>
                            </div>
                            :
                            <div className="p-grid-login">
                                <div className="p-col-12">
                                    <div className="card login-card">
                                        <h1>Rez Laundry Ops App</h1>
                                        <p>Log in with your SH email for access.</p>
                                        <div className="login-centered">
                                            <Button label="Log In" className="p-button-raised p-button-secondary" onClick={this.login} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default App;
