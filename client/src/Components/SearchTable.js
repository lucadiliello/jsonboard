import { Input, Table } from "antd";
import { Component } from 'react';
import { SearchOutlined } from '@ant-design/icons';


class SearchTable extends Component {

    field = undefined

    state = {
        search: "",
    }

    constructor(props) {
        super(props);
        this.updateSearch = this.updateSearch.bind(this);
    }

    updateSearch(e) {
        this.setState({search: e.target.value})
    }

    render() {
        const activeExperiments = Object.entries(this.props.experiments).filter(([name, value]) => value.active && value.data !== undefined);
        const columns = [
            {
                title: 'Parameter',
                width: 200,
                dataIndex: 'parameter',
                key: 'parameter',
                fixed: 'left',
            }
        ].concat(activeExperiments.map(([name, value]) => ({ title: name, dataIndex: name, key: name })).sort(
            (a, b) =>  (a.title).localeCompare(b.title)
        ));

        const allParameters = Array.from(new Set(
            activeExperiments.map(([name, value]) => Object.keys(value.data[this.field]).filter(k => k.includes(this.state.search))).flat()
        )).sort();
        const data = allParameters.map(parameter => ({
            key: parameter,
            parameter: parameter,
            ...Object.fromEntries(activeExperiments.map(([name, value]) => [name, value.data[this.field][parameter]]))
        }));

        return <Table title={
            () => <Input size="large" value={this.state.search} placeholder="search parameter" onChange={this.updateSearch} prefix={<SearchOutlined />} />
        } columns={columns} dataSource={data} pagination={{ pageSize: 10, height: '400px' }} scroll bordered/>;
    }
}

export default SearchTable;
