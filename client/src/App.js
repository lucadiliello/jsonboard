import { Component } from 'react';
import axios from 'axios';
import update from 'react-addons-update'; // ES6
import { Layout } from 'antd';
import Main from './Components/Main';
import Colors from './Components/Colors';
import Sidebar from './Components/Sidebar';
import './App.css';


// axios.defaults.baseURL = "http://127.0.0.1:1337";


class App extends Component {

    state = {
        experiments: {},  // map names experiments to objects with active/data keys
        settings: {
            theme: 'light',
            interval: 30,
        }
    }

    constructor(props) {
        super(props);
        this.colorGen = new Colors();
        this.loadNames = this.loadNames.bind(this);
        this.loadData = this.loadData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.recurrentUpdate = this.recurrentUpdate.bind(this);
        this.updateActive = this.updateActive.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.setInterval = this.setInterval.bind(this);
    }

    componentDidMount() {
        document.title = "JsonBoard"
        this.loadNames(this.recurrentUpdate());
    }

    loadNames(callback) {
        axios.get('/data')
            .then(response => {this.setState(prevState => ({
                experiments: {
                    ...prevState.experiments,
                    ...Object.fromEntries(
                        response.data.filter(name => !(name in this.state.experiments)).map(
                            name => [name, {data: undefined, active: false, color: this.colorGen.getNewColor()}]
                        )
                    )
                }
            }), callback)})
            .catch((error) => console.log(error));
    }

    loadData(names, callback) {
        /* Launch many axios requests and update state */
        names = Array.isArray(names) ? names : [names];
        axios.all(names.map(name => axios.post('/data', {name: name})))
        .then(axios.spread((...responses) => {
            this.setState(prevState => update(prevState, {
                experiments: Object.fromEntries(
                    responses.map(response => Object.entries(response.data)).flat().map(([name, value]) => ([name, {data: {$set: value}}]))
                )
            }), callback)})
        ).catch((error) => console.log(error));
    }

    updateData(callback) {
        this.loadData(
            Object.entries(this.state.experiments).filter(([name, value]) => value.active).map(([name, value]) => name),
            callback
        );
    }

    recurrentUpdate() {
        this.updateData();
        setTimeout(this.recurrentUpdate, this.state.settings.interval * 1000);
    }

    updateActive(names, status, callback) {
        names = Array.isArray(names) ? names : [names];
        this.setState(prevState => update(prevState, {
            experiments: Object.fromEntries(names.map(name => [name, {active: {$set: status}}]))
        }), callback);
    }

    setTheme(value) {
        this.setState(prevState => update(prevState, {
            settings: {theme: {$set: value ? 'dark' : 'light'}}
        }));
    }

    setInterval(interval, callback) {
        this.setState(prevState => update(prevState, {
            settings: {interval: {$set: interval}}
        }), callback);
    }

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar
                    updateActive={this.updateActive}
                    setTheme={this.setTheme}
                    updateData={this.updateData}
                    setInterval={this.setInterval}
                    settings={this.state.settings}
                    experiments={this.state.experiments}
                />
                <Main
                    loadData={this.loadData}
                    experiments={this.state.experiments}
                    settings={this.state.settings}
                />
            </Layout>
        )
    }
}

export default App;
