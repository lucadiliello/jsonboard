import { Component } from 'react';
import { Button, Divider, InputNumber, Layout, Menu, Space, Switch } from 'antd';
import { ExperimentOutlined, RedoOutlined } from '@ant-design/icons';
import './Sidebar.css';


const { Sider } = Layout;


class Filters extends Component {

    state = {
        forceUpdateLoading: false,
        selectingLoading: false,
        deselectingLoading: false,
    }

    onSelect = (item) => this.props.updateActive(item.key, true);
    onDeselect = (item) => this.props.updateActive(item.key, false);
    activeAll = () => {
        this.setState({selectingLoading: true}, this.props.updateActive(Object.keys(this.props.experiments), true, () => this.setState({selectingLoading: false})))
    }
    deactiveAll = () => {
        this.setState({deselectingLoading: true}, this.props.updateActive(Object.keys(this.props.experiments), false, () => this.setState({deselectingLoading: false})))
    }
    setInterval = (e) => this.props.setInterval(e);
    updateData = () => {
        this.setState({forceUpdateLoading: true}, this.props.updateData(() => this.setState({forceUpdateLoading: false})))
    }

    render() {
        const theme = this.props.settings.theme;
        const color = this.props.settings.theme == 'dark' ? 'white' : 'black';
        const items = Object.entries(this.props.experiments).sort((a, b) => a[0].localeCompare(b[0])).map(
            ([name, value]) => ({key: name, icon: <ExperimentOutlined />, label: <b style={{color: value.color}}>{name}</b>})
        );

        return (
            <Sider theme={theme}>

                <Space align="center" direction="vertical" size="middle" style={{display: 'flex', paddingTop: '10px'}}>
                    <h2 style={{color: color, font: 'tahoma'}}>JsonBoard</h2>
                </Space>

                <Divider style={{backgroundColor: color, margin: 0}} />

                <Space align="center" direction="horizontal" style={{display: 'flex', padding: '20px'}}>
                    <Button type="primary" loading={this.state.selectingLoading} onClick={this.activeAll} style={{width: '120px'}}>Select all</Button>
                    <Button type="danger" loading={this.state.deselectingLoading} onClick={this.deactiveAll} style={{width: '120px'}}>Deselect all</Button>
                </Space>
                <Menu
                    theme={theme}
                    mode="inline"
                    multiple
                    onSelect={this.onSelect}
                    onDeselect={this.onDeselect}
                    style={{overflow: 'auto', overflowX: 'hidden'}}
                    selectedKeys={Object.entries(this.props.experiments).filter(([name, value]) => value.active).map(([name, value]) => name)}
                    items={items}
                />

                <Divider style={{backgroundColor: color}} />

                <Space align="center" direction="vertical" size="middle" style={{ display: 'flex', margin: 10 }}>
                    <h4 style={{color: color}}>Dark mode <Switch checked={theme === 'dark'} onChange={this.props.setTheme}/></h4>
                    <h4 style={{color: color}}>Refresh interval <InputNumber min={1} value={this.props.settings.interval} onChange={this.setInterval} /></h4>
                    <h4 style={{color: color}}>
                        <Button style={{width: '180px'}} loading={this.state.forceUpdateLoading} onClick={this.updateData} icon={<RedoOutlined />}>
                            Force update
                        </Button>
                    </h4>
                </Space>
            </Sider>
        );
    }
}

export default Filters;
