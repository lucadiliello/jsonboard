import { Component } from 'react';
import { Layout, Tabs } from 'antd';
import { DatabaseOutlined, LineChartOutlined, ApartmentOutlined } from '@ant-design/icons';
import Hyperparameters from './Hyperparameters';
import Plots from './Plots';
import Metadata from './Metadata';

const { Content, Footer } = Layout;
const { TabPane } = Tabs;


class Main extends Component {

    componentDidUpdate(prevProps) {
        if ((prevProps.experiments !== this.props.experiments) || (prevProps.metric !== this.props.metric)) {
            Object.entries(this.props.experiments).forEach(([name, value]) => {
                if (value.active && (value.data === undefined)) this.props.loadData(name)
            })
        }
    }

    render() {
        return (
            <Content>
                <Layout className="site-layout">
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, margin: 16 }}>
                            <Tabs defaultActiveKey="1" type="card" size='default'>
                                <TabPane tab={
                                    <span>
                                        <DatabaseOutlined /> Hyperparameters
                                    </span>
                                } key="hyperparameters">
                                    <Hyperparameters experiments={this.props.experiments} metric={this.props.metric} loadData={this.props.loadData}/>
                                </TabPane>
                                <TabPane tab={
                                    <span>
                                        <LineChartOutlined /> Logs plots
                                    </span>
                                } key="plots">
                                    <Plots experiments={this.props.experiments} metric={this.props.metric} loadData={this.props.loadData}/>
                                </TabPane>
                                <TabPane tab={
                                    <span>
                                        <ApartmentOutlined /> Metadata
                                    </span>
                                } key="metadata">
                                    <Metadata experiments={this.props.experiments} metric={this.props.metric} loadData={this.props.loadData}/>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}><code>JsonBoard v0.1.0, created by Luca Di Liello</code></Footer>
                </Layout>
            </Content>
        )
    }
}

export default Main;
