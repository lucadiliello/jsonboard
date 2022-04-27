import { Component } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card } from 'antd';


const sliceToolTip = ({ slice }) => <div style={{ background: 'white', padding: '4px 6px', border: '2px solid #ccc' }}>
    {slice.points.map(point => <div style={{ color: point.serieColor, fontWeight: "bold", fontSize: 11 }}>
        {point.serieId} &rarr; x: {point.data.xFormatted}, y: {point.data.yFormatted}
    </div>
    )}
</div>


class Plot extends Component {

    unique(array) {
        return [...new Set(array)];
    }

    partitionArray(number, array) {
        if (array.length < number) return array;
        const step = (array.length - 1) / (number - 1);
        return Array.from(Array(number).keys()).map(i => array[Math.round(step * i)]);
    }

    render() {
        const data = Object.entries(this.props.experiments)
            .filter(([key, value]) => (value.active && (value.data !== undefined) && (value.data.metrics.includes(this.props.metric))))
            .map(([key, value]) => ({
                color: value.color,
                id: key,
                data: value.data.logs.map(entry => ({ x: entry.step, y: entry[this.props.metric] }))
                    .filter(a => ((a.y !== undefined) && (a.y !== null)))
            }));

        const allTickValues = this.unique(Object.values(data).map(e => e.data.map(a => a.x)).flat());
        const tickValues = this.partitionArray(this.props.plotStyle.nTicks, allTickValues);

        return (
            <Card title={this.props.metric} bodyStyle={{padding: 0, margin: 0}} bordered>
                <div style={{ height: this.props.plotStyle.height, width: '100%' }}>
                    <ResponsiveLine
                        data={data}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
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
                            legendPosition: 'middle',
                            type: 'linear',
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            tickValues: 10,
                            legend: this.props.metric,
                            legendOffset: -40,
                            legendPosition: 'middle',
                            type: 'linear',
                        }}
                        colors={d => d.color}
                        margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
                        theme={{ background: "#ffffff", textColor: "#333333" }}
                        enableSlices='x'
                        sliceTooltip={sliceToolTip}
                        enablePoints={this.props.plotStyle.enablePoints}
                        enableGridY={this.props.plotStyle.enableGridY}
                        enableGridX={this.props.plotStyle.enableGridX}
                        gridXValues={tickValues}
                        lineWidth={this.props.plotStyle.lineWidth}
                        pointSize={8}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        useMesh={true}                    
                    />
                </Card>
            </div>
        )
    }
}

export default Plot;
