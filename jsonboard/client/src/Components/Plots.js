import { Component } from 'react';
import { Row, Col, Input, Card, Segmented, Tooltip, Select, Space, Slider, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Plot from './Plot';
import update from 'react-addons-update'; // ES6


const lineTypeMenu = [
    { key: "basis", label: "Basis" },
    { key: "cardinal", label: "Cardinal" },
    { key: "catmullRom", label: "Catmull-Rom" },
    { key: "linear", label: "Linear" },
    { key: "monotoneX", label: "Monotone X" },
    { key: "monotoneY", label: "Monotone Y" },
    { key: "natural", label: "Natural" },
    { key: "step", label: "Step" },
    { key: "stepAfter", label: "Step After" },
    { key: "stepBefore", label: "Step Before" },
];


class Plots extends Component {

    state = {
        plotsPerLine: 3,
        search: "",
        plotStyle: {
            lineType: "linear",
            lineWidth: 3,
            enablePoints: false,
            enableGridX: true,
            enableGridY: true,
            nTicks: 7,
            height: 300,
        }
    }

    constructor(props) {
        super(props);
        this.updateSearch = this.updateSearch.bind(this);
        this.setLineType = this.setLineType.bind(this);
        this.setLineWidth = this.setLineWidth.bind(this);
        this.setEnablePoints = this.setEnablePoints.bind(this);
        this.setGridX = this.setGridX.bind(this);
        this.setGridY = this.setGridY.bind(this);
        this.setPlotsPerLine = this.setPlotsPerLine.bind(this);
        this.setNumberTicks = this.setNumberTicks.bind(this);
        this.setPlotHeight = this.setPlotHeight.bind(this);
    }

    getMetrics() {
        return Array.from(new Set(
            Object.values(this.props.experiments).filter(value => value.active && (value.data !== undefined))
                .map(value => value.data.metrics).flat().filter(metric => metric.includes(this.state.search))
        )).sort();
    }

    updateSearch(e) {
        this.setState({ search: e.target.value })
    }

    setPlotsPerLine(e) {
        this.setState({
            plotsPerLine: e,
            plotStyle: {...this.state.plotStyle, nTicks: Math.floor(18 / e) + 1}
        })
    }

    setLineType(e) {
        this.setState(prevState => update(prevState, { plotStyle: {lineType: {$set: e }}}))
    }

    setLineWidth(e) {
        this.setState(prevState => update(prevState, { plotStyle: {lineWidth: {$set: e }}}))
    }

    setEnablePoints(e) {
        this.setState(prevState => update(prevState, { plotStyle: { enablePoints: {$set: e }}}))
    }

    setGridX(e) {
        this.setState(prevState => update(prevState, { plotStyle: { enableGridX: {$set: e }}}))
    }

    setGridY(e) {
        this.setState(prevState => update(prevState, { plotStyle: { enableGridY: {$set: e }}}))
    }

    setNumberTicks(e) {
        this.setState(prevState => update(prevState, { plotStyle: {nTicks: {$set: e }}}))
    }

    setPlotHeight(e) {
        this.setState(prevState => update(prevState, { plotStyle: {height: {$set: e }}}))
    }

    render() {
        const allMetrics = this.getMetrics();
        return (
            <div>
                <Card title={
                    <Row>
                        <Col span={4}>
                            <Input size="large" value={this.state.search} placeholder="search logs" onChange={this.updateSearch} prefix={<SearchOutlined />} />
                        </Col>
                        <Col span={3}>
                            <Space align="center" direction="horizontal" style={{ display: 'flex', padding: 4, paddingRight: 20, paddingLeft: 20 }}>
                                <Tooltip title="Line type">
                                    <Select value={this.state.plotStyle.lineType} style={{ width: 120 }} onChange={this.setLineType}>
                                        {lineTypeMenu.map(item => <Select.Option value={item.key} key={item.key}>{item.label}</Select.Option>)}
                                    </Select>
                                </Tooltip>
                            </Space>
                        </Col>

                        <Col span={3}>
                            <Space direction="vertical" style={{ display: 'flex', padding: 4, paddingRight: 10, paddingLeft: 10}}>
                                <Slider min={1} max={8} value={this.state.plotStyle.lineWidth} onChange={this.setLineWidth} />
                            </Space>
                        </Col>

                        <Col span={3}>
                            <Space direction="vertical" style={{ display: 'flex', padding: 4, paddingRight: 10, paddingLeft: 10}}>
                                <Slider min={2} max={25} value={this.state.plotStyle.nTicks} onChange={this.setNumberTicks} />
                            </Space>
                        </Col>

                        <Col span={3}>
                            <Space direction="vertical" style={{ display: 'flex', padding: 4, paddingRight: 10, paddingLeft: 10}}>
                                <Slider min={200} max={1000} step={50} value={this.state.plotStyle.height} onChange={this.setPlotHeight} />
                            </Space>
                        </Col>

                        <Col span={1}>
                            <Space direction="horizontal" style={{display: 'flex', padding: 4, paddingRight: 10, paddingLeft: 10}}>
                                <Tooltip title="Enable points">
                                    <Switch checked={this.state.plotStyle.enablePoints} onChange={this.setEnablePoints} />
                                </Tooltip>
                            </Space>
                        </Col>

                        <Col span={1}>
                            <Space direction="vertical" style={{ display: 'flex', padding: 4, paddingRight: 10, paddingLeft: 10 }}>
                                <Tooltip title="Grix X">
                                    <Switch checked={this.state.plotStyle.enableGridX} onChange={this.setGridX} />
                                </Tooltip>
                            </Space>
                        </Col>

                        <Col span={1}>
                            <Space direction="vertical" style={{ display: 'flex', padding: 4, paddingRight: 10, paddingLeft: 10 }}>
                                <Tooltip title="Grid Y">
                                    <Switch checked={this.state.plotStyle.enableGridY} onChange={this.setGridY} />
                                </Tooltip>
                            </Space>
                        </Col>

                        <Col span={5}>
                            <Tooltip title="Plots per line">
                                <Segmented
                                    block
                                    style={{ marginTop: 4, marginBottom: 4, marginLeft: 20, marginRight: 20 }}
                                    options={[1, 2, 3, 4, 6]}
                                    value={this.state.plotsPerLine}
                                    onChange={this.setPlotsPerLine}
                                />
                            </Tooltip>
                        </Col>
                    </Row>
                } bordered={true}>
                    <Row>
                        {allMetrics.map(metric => (
                            <Col span={Math.floor(24 / this.state.plotsPerLine)} key={metric}>
                                <Plot metric={metric} experiments={this.props.experiments} plotStyle={this.state.plotStyle} plotsPerLine={this.state.plotsPerLine}/>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </div>
        )
    }
}

export default Plots;
