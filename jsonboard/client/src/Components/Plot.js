import { Component } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card } from 'antd';


class Plot extends Component {

    unique(array) {
        return [...new Set(array)];
    }

    partitionArray(number, array) {
        const step = (array.length - 1) / (number - 1);
        return this.unique(
            Array.from(Array(number).keys()).map(i => array[Math.round(step * i)])
        );
    }

    render() {
        const data = Object.entries(this.props.experiments)
            .filter(([key, value]) => value.active && value.data !== undefined && this.props.metric in value.data.logs)
            .map(([key, value]) => ({
                color: value.color,
                id: key,
                data: this.unique(
                    value.data.steps
                        .map((step, index) => ({ x: step, y: value.data.logs[this.props.metric][index] }))
                        .filter(a => a.y !== undefined && a.y !== null)
                )
            }));

        const allTickValues = this.unique(Object.values(data).map(e => e.data.map(a => a.x)).flat()).sort();
        const tickValues = this.partitionArray(this.props.plotStyle.nTicks, allTickValues);

        return (
            <Card title={this.props.metric} bodyStyle={{padding: 0, margin: 0}} bordered>
                <div style={{ height: '300px' }}>
                    <div style={{ height: '100%', display: 'flex', minWidth: 0 }}>
                        <ResponsiveLine
                            theme={{ background: "#ffffff", textColor: "#333333" }}
                            data={data}
                            colors={d => d.color}
                            margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{
                                type: 'linear',
                                min: 'auto',
                                max: 'auto',
                                stacked: true,
                                reverse: false
                            }}
                            yFormat=" >-.2f"
                            curve={this.props.plotStyle.lineType}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickValues: tickValues,
                                format: (a) => (a > 10000 ? a.toExponential(1) : a),
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Step',
                                legendOffset: 30,
                                legendPosition: 'middle'
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                format: (a) => (a > 100 || a < 0.01 ? a.toExponential(1) : a),
                                tickPadding: 5,
                                tickRotation: 0,
                                tickValues: 10,
                                legendOffset: -40,
                                legendPosition: 'middle'
                            }}
                            enableSlices='x'
                            enablePoints={this.props.plotStyle.enablePoints}
                            enableGridY={this.props.plotStyle.enableGridY}
                            enableGridX={this.props.plotStyle.enableGridX}
                            lineWidth={this.props.plotStyle.lineWidth}
                            pointSize={8}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            pointLabelYOffset={-12}
                            useMesh={true}
                        />
                    </div>
                </div>
            </Card >
        )
    }
}

export default Plot;
